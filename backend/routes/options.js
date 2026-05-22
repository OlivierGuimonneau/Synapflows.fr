import express from 'express';
import https from 'https';

const router = express.Router();

// Cache en mémoire — évite de surcharger l'API Airtable meta à chaque chargement
let cache = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 heure

function fetchAirtableFields() {
  return new Promise((resolve, reject) => {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;

    const req = https.request({
      hostname: 'api.airtable.com',
      path: `/v0/meta/bases/${baseId}/tables`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Airtable meta error: ${res.statusCode}`));
        }
        const json = JSON.parse(data);
        const table = json.tables?.[0];
        if (!table) return reject(new Error('Table introuvable'));

        const getChoices = (fieldName) =>
          table.fields
            .find(f => f.name === fieldName)
            ?.options?.choices?.map(c => c.name) ?? [];

        resolve({
          objectif: getChoices('Objectif principal'),
          budget: getChoices('Budget'),
          delai: getChoices('Délai'),
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (!cache || now > cacheExpiresAt) {
      cache = await fetchAirtableFields();
      cacheExpiresAt = now + CACHE_TTL_MS;
    }
    res.json(cache);
  } catch (err) {
    console.error('[OPTIONS] Erreur récupération options Airtable:', err.message);
    res.status(500).json({ error: 'Impossible de récupérer les options' });
  }
});

export default router;
