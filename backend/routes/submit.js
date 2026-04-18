import express from 'express';
import axios from 'axios';
import { submitToAirtable } from '../services/airtable.js';

const router = express.Router();

// 🔐 Fonction de validation reCAPTCHA v3
async function verifyRecaptcha(token) {
  // 🔧 BYPASS: utilisez RECAPTCHA_BYPASS=true pour tester sans limitation reCAPTCHA
  if (process.env.RECAPTCHA_BYPASS === 'true') {
    console.log('[reCAPTCHA] BYPASS activé - Validation contournée');
    return { success: true, score: 0.9, action: 'submit_form' };
  }

  // 🔧 Accepter les tokens bypass localhost ou vides
  if (token === 'bypass_token' || !token) {
    console.log('[reCAPTCHA] Token bypass accepté');
    return { success: true, score: 0.9, action: 'submit_form' };
  }

  // 🔧 EN DÉVELOPPEMENT: bypass reCAPTCHA pour tester localement
  if (process.env.NODE_ENV === 'development') {
    console.log('[reCAPTCHA] Mode DÉVELOPPEMENT - Validation contournée');
    return { success: true, score: 0.9, action: 'submit_form' };
  }

  if (!token) {
    console.error('[reCAPTCHA] Token manquant');
    throw new Error('Token reCAPTCHA manquant');
  }

  try {
    console.log('[reCAPTCHA DEBUG] Vérification du token...');
    console.log('[reCAPTCHA DEBUG] Clé secrète disponible:', !!process.env.RECAPTCHA_SECRET_KEY);

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token
      },
      { timeout: 5000 }
    );

    console.log('[reCAPTCHA DEBUG] ✅ Réponse Google reçue:', JSON.stringify(response.data));

    const { success, score, action, challenge_ts, hostname } = response.data;

    console.log('[reCAPTCHA] Résultat:', { success, score, action, hostname });

    // reCAPTCHA v3 retourne un score entre 0.0 et 1.0
    // 1.0 = très probable que ce soit un utilisateur légitime
    // 0.0 = très probable que ce soit un bot
    // Seuil recommandé: 0.5
    if (!success) {
      console.error('[reCAPTCHA] Google a rejeté le token:', response.data);
      throw new Error(`Google a rejeté le token: ${JSON.stringify(response.data)}`);
    }

    if (score < 0.5) {
      console.warn('[reCAPTCHA] Score trop bas:', score);
      throw new Error(`Score reCAPTCHA insuffisant (${score}). Le domaine ou la clé peut ne pas être configuré correctement.`);
    }

    console.log('[reCAPTCHA] ✅ Validé avec succès (score: ' + score + ')');
    return { success: true, score, action };
  } catch (error) {
    console.error('[reCAPTCHA ERROR] Message:', error.message);
    if (error.response) {
      console.error('[reCAPTCHA ERROR] Réponse:', error.response.data);
    }
    throw new Error('Échec de la vérification reCAPTCHA: ' + error.message);
  }
}

// 📋 Schéma de validation des champs du formulaire
const FORM_SCHEMA = {
  prenom: { type: 'string', required: true, maxLength: 100 },
  nom: { type: 'string', required: true, maxLength: 100 },
  email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  tel: { type: 'string', required: false, maxLength: 20 },
  fonction: { type: 'string', required: false, maxLength: 100 },
  societe: { type: 'string', required: true, maxLength: 150 },
  type_projet: { type: 'string', required: true, maxLength: 100 },
  description: { type: 'string', required: true, maxLength: 5000 },
  objectif: { type: 'string', required: false, maxLength: 500 },
  fonctions: { type: 'array', required: false },
  priorites: { type: 'string', required: false, maxLength: 500 },
  users_launch: { type: 'string', required: false, maxLength: 100 },
  users_year1: { type: 'string', required: false, maxLength: 100 },
  profils: { type: 'array', required: false },
  compliance: { type: 'string', required: false, maxLength: 500 },
  integrations: { type: 'string', required: false, maxLength: 1000 },
  ambiance: { type: 'array', required: false },
  refs_design: { type: 'string', required: false, maxLength: 500 },
  charte: { type: 'string', required: false, maxLength: 500 },
  budget: { type: 'string', required: false, maxLength: 100 },
  delai: { type: 'string', required: false, maxLength: 100 },
  commentaire: { type: 'string', required: false, maxLength: 1000 },
  submitted_at: { type: 'string', required: false }
};

// 🔐 Fonction de validation stricte
function validateFormData(payload) {
  const errors = [];

  // Vérifier les champs requis
  for (const [field, rules] of Object.entries(FORM_SCHEMA)) {
    const value = payload[field];

    // Champ requis ?
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} est requis`);
      continue;
    }

    if (value === undefined || value === null) continue; // Optionnel et absent = OK

    // Vérifier le type
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} doit être une chaîne de caractères`);
      continue;
    }
    if (rules.type === 'array' && !Array.isArray(value)) {
      errors.push(`${field} doit être un tableau`);
      continue;
    }

    // Vérifier la longueur max (strings)
    if (rules.type === 'string' && rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} dépasse la longueur max de ${rules.maxLength} caractères`);
    }

    // Vérifier le pattern regex (ex: email)
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} a un format invalide`);
    }
  }

  // Vérifier les champs supplémentaires (pas dans le schéma = alerte de sécurité)
  const unknownFields = Object.keys(payload).filter(key => !FORM_SCHEMA[key]);
  if (unknownFields.length > 0) {
    console.warn('[SECURITY] Champs inconnus détectés:', unknownFields);
    // Optionnel : lever erreur si strict
    // errors.push(`Champs inconnus: ${unknownFields.join(', ')}`);
  }

  return errors;
}

// 🔐 Middleware de validation Origin/Referer (protection CSRF basique)
function validateOrigin(req, res, next) {
  const origin = req.get('origin') || req.get('referer');
  const allowedHosts = process.env.NODE_ENV === 'development'
    ? ['localhost', '127.0.0.1']
    : ['www.synapflows.fr'];

  if (origin) {
    const originHost = new URL(origin).hostname;
    const isAllowed = allowedHosts.some(host => originHost.includes(host));
    if (!isAllowed) {
      console.warn('[CSRF BLOCK] Origin non autorisé:', origin);
      return res.status(403).json({ error: 'Origine non autorisée' });
    }
  }

  next();
}

router.post('/', validateOrigin, async (req, res) => {
  try {
    const payload = req.body;

    console.log('[SUBMIT DEBUG] Clés du payload reçu:', Object.keys(payload));

    // Vérifier données présentes
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Aucune donnée fournie' });
    }

    // 🔐 Vérifier le token reCAPTCHA en premier
    const reCaptchaToken = payload.reCaptchaToken;
    console.log('[SUBMIT DEBUG] Token reCAPTCHA présent:', !!reCaptchaToken);
    console.log('[SUBMIT DEBUG] Token reCAPTCHA (first 50 chars):', reCaptchaToken?.substring(0, 50));
    console.log('[SUBMIT DEBUG] Token reCAPTCHA (length):', reCaptchaToken?.length);
    
    if (!reCaptchaToken) {
      console.error('[SECURITY] Token reCAPTCHA manquant!');
      return res.status(403).json({ error: 'Token reCAPTCHA manquant' });
    }
    
    try {
      await verifyRecaptcha(reCaptchaToken);
      console.log('[SECURITY] reCAPTCHA validé avec succès');
    } catch (error) {
      console.error('[SECURITY] reCAPTCHA validation échouée:', error.message);
      return res.status(403).json({ error: error.message });
    }

    // Nettoyer le payload (enlever le token reCAPTCHA avant validation Airtable)
    const cleanPayload = { ...payload };
    delete cleanPayload.reCaptchaToken;

    // Valider les champs
    const validationErrors = validateFormData(cleanPayload);
    if (validationErrors.length > 0) {
      console.warn('[VALIDATION ERROR]', validationErrors);
      return res.status(400).json({ 
        error: 'Données invalides',
        details: validationErrors 
      });
    }

    // ✅ Soumission valide
    await submitToAirtable(cleanPayload);
    
    // 🔐 NE PAS retourner la réponse brute d'Airtable
    // Répondre simplement avec succès (pas de données sensibles)
    res.status(200).json({ success: true, message: 'Soumission reçue avec succès' });
  } catch (error) {
    console.error('[SUBMIT ERROR]', error);
    // 🔐 Ne pas exposer les détails d'erreur au client (surtout pas les tokens Airtable)
    res.status(500).json({ error: 'Erreur lors de la soumission. Veuillez réessayer.' });
  }
});

export default router;
