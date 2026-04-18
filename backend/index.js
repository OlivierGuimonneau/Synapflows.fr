import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import submitRoute from './routes/submit.js';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV === 'development';

// 🔒 Trust proxy - Traefik/Nginx passe X-Forwarded-For
app.set('trust proxy', 1);

// Log configuration au démarrage
console.log('\n========== Configuration Airtable ==========');
console.log('BASE_ID:', process.env.AIRTABLE_BASE_ID);
console.log('TABLE (Projets Soumis):', process.env.AIRTABLE_PROJETS_SOUMIS);
console.log('TOKEN exists:', !!process.env.AIRTABLE_TOKEN);
console.log('TOKEN length:', process.env.AIRTABLE_TOKEN?.length);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', PORT);
console.log('==========================================\n');

// 🔒 Middleware de sécurité HTTP (en-têtes essentiels)
app.use((req, res, next) => {
  // Content-Security-Policy-Report-Only (mode observation, non-bloquant)
  // En mode Report-Only durant 48-72h pour détecter les violations sans casser la fonctionnalité
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://recaptcha.net/ https://cdn.jsdelivr.net/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/; img-src 'self' data: https:; font-src 'self' https: https://fonts.gstatic.com/; connect-src 'self' https://api.airtable.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://recaptcha.net/ https://www.google.com/recaptcha/api/ https://www.gstatic.com/ https://fonts.googleapis.com/ https://fonts.gstatic.com/; frame-src https://www.google.com/recaptcha/ https://recaptcha.net/; frame-ancestors 'none'; report-uri /api/csp-report;"
  );
  
  // Strict-Transport-Security (HSTS) - force HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Anti-clickjacking - refuse framing
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Masquer Express version (sécurité par obscurité)
  res.removeHeader('X-Powered-By');
  
  // MIME sniffing protection
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer-Policy - limite l'exposition du Referer
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy - restreint les APIs navigateur
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  
  next();
});

// Middleware CORS restrictif
const allowedOrigins = isDev 
  ? ['http://localhost:5000', 'http://localhost:5001', 'http://localhost:5174', 'http://127.0.0.1:5000', 'http://127.0.0.1:5001', 'http://127.0.0.1:5174']
  : ['https://www.synapflows.fr'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// 🚦 Rate Limiting pour /api/submit
// 10 soumissions par IP par 15 minutes (standard pour formulaires)
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requêtes
  message: 'Trop de soumissions depuis cette IP. Essayez à nouveau dans 15 minutes.',
  standardHeaders: true, // Retourne info limite dans `RateLimit-*` headers
  legacyHeaders: false // Désactiver `X-RateLimit-*` headers
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Endpoint de test configuration
app.get('/api/config-test', (req, res) => {
  res.json({
    baseId: process.env.AIRTABLE_BASE_ID,
    table: process.env.AIRTABLE_PROJETS_SOUMIS,
    hasToken: !!process.env.AIRTABLE_TOKEN,
    tokenLength: process.env.AIRTABLE_TOKEN?.length,
    nodeEnv: process.env.NODE_ENV,
    port: PORT
  });
});

// 📊 Endpoint CSP Report-Only - Collecte les violations CSP
// Les navigateurs envoient les violations CSP à cet endpoint (mode rapport, non-bloquant)
app.post('/api/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  const report = req.body['csp-report'] || req.body;
  
  console.log('\n[CSP VIOLATION REPORT]');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Blocked URI:', report['blocked-uri'] || 'N/A');
  console.log('Violation Type:', report['violated-directive'] || 'N/A');
  console.log('Original Policy:', report['original-policy'] || 'N/A');
  console.log('Source File:', report['source-file'] || 'N/A');
  console.log('Line Number:', report['line-number'] || 'N/A');
  console.log('----\n');
  
  // Répondre avec 204 No Content (standard pour CSP reports)
  res.status(204).send();
});

// 🚦 API Routes sécurisées avec rate limiting
try {
  app.use('/api/submit', submitLimiter, submitRoute);
  console.log('✅ Route /api/submit enregistrée avec succès');
} catch (error) {
  console.error('❌ Erreur lors du chargement de la route /api/submit:', error);
  process.exit(1);
}

// Servir les fichiers statiques (en dev et prod)
app.use(express.static(path.join(__dirname, '../public')));

// En production, serve index.html pour SPA fallback
if (!isDev) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Erreur serveur' });
});

console.log('[STARTUP] Démarrage du serveur sur port', PORT);

app.listen(PORT, () => {
  console.log(`✅ Serveur SynapFlows lancé sur http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ ERREUR LISTEN:', err);
  process.exit(1);
});

// Capture des exceptions non gérées
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
  process.exit(1);
});
