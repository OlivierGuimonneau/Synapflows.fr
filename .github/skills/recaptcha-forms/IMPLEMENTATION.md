---
name: recaptcha-enterprise-implementation
description: Guide complet d'implémentation reCAPTCHA Enterprise avec exemples Frontend/Backend, erreurs courantes et solutions.
---

# reCAPTCHA Enterprise Implementation Guide

## Table des matières
1. [Configuration Google Cloud](#configuration-google-cloud)
2. [Implémentation Frontend](#implémentation-frontend)
3. [Implémentation Backend](#implémentation-backend)
4. [Erreurs courantes et solutions](#erreurs-courantes-et-solutions)
5. [Checklist déploiement](#checklist-déploiement)

---

## Configuration Google Cloud

### Prérequis
- Compte Google Cloud Billing actif
- Projet Google Cloud créé
- reCAPTCHA Enterprise activé dans APIs

### Étapes
1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. **Sélectionne ton projet** → **Sécurité** → **reCAPTCHA Enterprise**
3. Crée une **clé de site** pour chaque domaine:
   - **Domaine**: `www.synap-ratings.com`
   - **Plateforme**: Web (pas Android/iOS)
4. Copie la **clé de site** (clé publique)
5. Crée une **clé API** pour le backend:
   - **APIs & Services** → **Credentials**
   - **Create Credentials** → **API Key**
6. Copie la **clé API** et le **Project ID**

### Variables d'environnement
```env
# Frontend (.env or frontend/.env)
VITE_RECAPTCHA_SITE_KEY=6LcLH7IsAAAAAAj4Ylz9KNcMLC_VJ8AjdenA0QGx
VITE_RECAPTCHA_ACTION=submit_lead

# Backend (.env or backend/.env)
RECAPTCHA_SITE_KEY=6LcLH7IsAAAAAAj4Ylz9KNcMLC_VJ8AjdenA0QGx
RECAPTCHA_ENTERPRISE_API_KEY=AIzaSyBGO3O5GK1h3vSU3WNLICi_EmhdBLkg-S0
RECAPTCHA_ENTERPRISE_PROJECT_ID=synapflows
RECAPTCHA_EXPECTED_ACTION=submit_lead
RECAPTCHA_MIN_SCORE=0.5
```

---

## Implémentation Frontend

### ✅ Correct avec Vite/React

```tsx
// frontend/src/components/LeadForm.tsx

import { FormEvent, useState, useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: {
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

export function LeadForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured');
      return;
    }

    // Vérifier que le script n'est pas déjà chargé
    if (window.grecaptcha?.enterprise) {
      console.log('reCAPTCHA Enterprise already loaded');
      return;
    }

    // IMPORTANT: Utiliser enterprise.js avec render parameter
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('reCAPTCHA Enterprise script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA Enterprise script');
    };
    document.head.appendChild(script);
  }, [siteKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // IMPORTANT: Capturer le formulaire AVANT l'async
    const form = event.currentTarget as HTMLFormElement;
    
    setStatus('loading');
    setErrorMessage('');

    try {
      let recaptchaToken = '';

      // Générer le token reCAPTCHA
      if (window.grecaptcha?.enterprise && siteKey) {
        try {
          recaptchaToken = await window.grecaptcha.enterprise.execute(siteKey, {
            action: import.meta.env.VITE_RECAPTCHA_ACTION || 'submit_lead',
          });
          console.log('reCAPTCHA token generated:', recaptchaToken.substring(0, 20) + '...');
        } catch (err) {
          console.error('reCAPTCHA execution error:', err);
          if (isDev) {
            recaptchaToken = 'dev-token-' + Date.now();
          } else {
            throw err;
          }
        }
      } else if (isDev) {
        console.warn('reCAPTCHA not available, using dev token');
        recaptchaToken = 'dev-token-' + Date.now();
      } else {
        setStatus('error');
        setErrorMessage('reCAPTCHA non disponible.');
        return;
      }

      if (!recaptchaToken) {
        setStatus('error');
        setErrorMessage('Impossible de générer le token de sécurité.');
        return;
      }

      // Construire le payload
      const firstName = (form.elements.namedItem('firstName') as HTMLInputElement)?.value || '';
      const lastName = (form.elements.namedItem('lastName') as HTMLInputElement)?.value || '';
      const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || '';
      const company = (form.elements.namedItem('company') as HTMLInputElement)?.value || '';
      const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value || '';

      const payload = {
        firstName,
        lastName,
        email,
        company,
        phone,
        recaptchaToken,
      };

      // Envoyer au backend
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || `Erreur serveur: ${response.status}`);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setStatus('error');
      setErrorMessage('Une erreur inattendue est survenue.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" type="text" required />
      <input name="lastName" type="text" required />
      <input name="email" type="email" required />
      <input name="company" type="text" required />
      <input name="phone" type="tel" />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
      </button>
      {status === 'success' && <p>✓ Envoyé avec succès!</p>}
      {status === 'error' && <p>✗ {errorMessage}</p>}
    </form>
  );
}
```

### 🔐 Content Security Policy

```typescript
// backend/src/middleware/securityHeaders.ts

const csp = [
  "default-src 'self'",
  "script-src 'self' https://www.google.com https://*.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' https:",
  "connect-src 'self' https://www.google.com https://*.gstatic.com https://recaptchaenterprise.googleapis.com",
  "frame-src 'self' https://www.google.com",
  "frame-ancestors 'none'",
  "report-uri /api/csp-report"
].join('; ');

res.setHeader('Content-Security-Policy-Report-Only', csp);
```

---

## Implémentation Backend

### ✅ Service reCAPTCHA Enterprise

```typescript
// backend/src/services/recaptchaEnterpriseService.ts

import { env } from '../config/env';

interface RecaptchaEnterpriseResponse {
  name: string;
  event: {
    token: string;
    siteKey: string;
    userIpAddress?: string;
  };
  riskAnalysis: {
    score: number;
    reasons?: string[];
  };
  tokenProperties: {
    valid: boolean;
    invalidReason?: string;
    hostname: string;
  };
}

export async function verifyRecaptchaEnterprise(
  token: string,
  siteKey: string,
  expectedAction: string = 'submit_lead',
  userIpAddress?: string
): Promise<{ valid: boolean; score?: number; reason?: string }> {
  // Configuration check
  if (!env.recaptchaEnterpriseApiKey || !env.recaptchaEnterpriseProjectId) {
    console.error('reCAPTCHA Enterprise not configured');
    return { valid: false, reason: 'reCAPTCHA not configured on server' };
  }

  try {
    // Mode développement: accepter dev-tokens
    if (env.nodeEnv === 'development' && token.startsWith('dev-token-')) {
      console.log('✓ Dev mode: accepting dev token');
      return { valid: true, score: 0.9 };
    }

    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${env.recaptchaEnterpriseProjectId}/assessments?key=${env.recaptchaEnterpriseApiKey}`;

    const requestBody = {
      event: {
        token,
        siteKey,
        ...(userIpAddress && { userIpAddress }),
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google API error: ${response.status} - ${errorText}`);
      return { valid: false, reason: `Google API error: ${response.status}` };
    }

    const data = (await response.json()) as RecaptchaEnterpriseResponse;

    // Validate token
    if (!data.tokenProperties?.valid) {
      console.warn(`Token invalid: ${data.tokenProperties?.invalidReason}`);
      return { valid: false, reason: 'Token validation failed' };
    }

    // Validate hostname
    const validHostnames = ['localhost', '127.0.0.1', 'www.synap-ratings.com', 'synap-ratings.com'];
    if (data.tokenProperties?.hostname && !validHostnames.includes(data.tokenProperties.hostname)) {
      console.warn(`Hostname mismatch: ${data.tokenProperties.hostname}`);
      return { valid: false, reason: `Invalid hostname: ${data.tokenProperties.hostname}` };
    }

    // Check score
    const score = data.riskAnalysis?.score ?? 0;
    const minScore = env.recaptchaMinScore || 0.5;

    if (score < minScore) {
      console.warn(`Score too low: ${score} < ${minScore}`);
      return { valid: false, reason: 'Verification score too low', score };
    }

    console.log(`✓ reCAPTCHA verified: score=${score}`);
    return { valid: true, score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { valid: false, reason: 'Verification error' };
  }
}
```

### ✅ Controller

```typescript
// backend/src/controllers/leadController.ts

import { Request, Response } from 'express';
import { verifyRecaptchaEnterprise } from '../services/recaptchaEnterpriseService';
import { env } from '../config/env';

export async function leadController(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, company, phone, recaptchaToken } = req.body;

    // Valider reCAPTCHA
    const recaptchaValidation = await verifyRecaptchaEnterprise(
      recaptchaToken,
      env.recaptchaSiteKey,
      env.recaptchaExpectedAction,
      req.ip
    );

    if (!recaptchaValidation.valid) {
      return res.status(400).json({
        message: 'Security verification failed',
        error: recaptchaValidation.reason,
      });
    }

    // Traiter le lead (ex: Airtable, email, etc.)
    // ... code métier ...

    return res.status(201).json({ success: true, message: 'Lead created' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
```

---

## Erreurs courantes et solutions

### ❌ "Invalid site key"
**Cause**: Script `api.js` utilisé au lieu de `enterprise.js`
**Solution**: Utiliser `https://www.google.com/recaptcha/enterprise.js?render=SITE_KEY`

### ❌ "Missing assessment.event.site_key" (Google API 400)
**Cause**: Clé de site vide ou manquante dans la requête au backend
**Solution**: Vérifier que `RECAPTCHA_SITE_KEY` est dans le `.env`

### ❌ "error in libcrypto" (GitHub Actions)
**Cause**: Clé SSH mal formatée (newlines perdues)
**Solution**: Utiliser la syntaxe `cat > file << 'EOF'` pour les newlines

### ❌ eForm submission error: Cannot read properties of null
**Cause**: `event.currentTarget` null lors d'async (React)
**Solution**: Capturer `form` **avant** le code async

### ❌ "reCAPTCHA Enterprise script loaded but grecaptcha.enterprise is undefined"
**Cause**: Script chargé mais pas encore prêt, ou erreur de chargement
**Solution**: Ajouter delay ou retry logic

---

## Checklist déploiement

- [ ] Google Cloud reCAPTCHA Enterprise configuré
- [ ] Clé de site et clé API créées pour le domaine de production
- [ ] Variables d'environnement dans le `.env` du VPS
- [ ] Frontend: `VITE_RECAPTCHA_SITE_KEY` et `VITE_RECAPTCHA_ACTION`
- [ ] Backend: Toutes les variables `RECAPTCHA_*` présentes
- [ ] CSP mise à jour avec domaines Google
- [ ] Docker build passe les `VITE_*` au build (via `args:` dans compose)
- [ ] Backend: Service reCAPTCHA chargé et accepte les tokens
- [ ] Tests en production: une soumission réussie crée un lead
- [ ] Logs en production: tokens logués partiellement (`token.substring(0, 20)`)

---

## Réutilisation dans nouveaux projets

1. Copie `recaptchaEnterpriseService.ts`
2. Adapte les `validHostnames` pour ton domaine
3. Module les `VITE_*` et `RECAPTCHA_*` dans ton `.env.example`
4. Mets à jour la CSP pour ton domaine
5. Intègre le service dans ton controller
6. Teste en dev mode d'abord (`dev-token-*`)

