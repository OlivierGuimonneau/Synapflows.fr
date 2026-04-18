import https from 'https';

// Mapper les champs du formulaire React vers les noms de colonnes Airtable
function mapToAirtableFields(payload) {
  // Formater la date avec l'heure pour Airtable (YYYY-MM-DD HH:mm au lieu de timestamp ISO)
  const submittedDate = payload.submitted_at || new Date().toISOString();
  const dateObj = new Date(submittedDate);
  const dateOnly = submittedDate.split('T')[0]; // "2026-04-07T13:42:18.392Z" -> "2026-04-07"
  const time = dateObj.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateWithTime = `${dateOnly} ${time}`; // "2026-04-07 16:37"

  return {
    'Prénom': payload.prenom || '',
    'Nom': payload.nom || '',
    'Email': payload.email || '',
    'Téléphone': payload.tel || '',
    'Fonction': payload.fonction || '',
    'Entreprise': payload.societe || '',
    'Type de projet': payload.type_projet || '',
    'Description du projet': payload.description || '',
    'Objectif principal': payload.objectif || '',
    'Fonctionnalités': Array.isArray(payload.fonctions) ? payload.fonctions.join(', ') : payload.fonctions || '',
    'Priorités V1': payload.priorites || '',
    'Utilisateurs lancement': payload.users_launch || '',
    'Utilisateurs à 1 an': payload.users_year1 || '',
    'Profils utilisateurs': Array.isArray(payload.profils) ? payload.profils.join(', ') : payload.profils || '',
    'Conformité et sécurité': payload.compliance || '',
    'Intégrations existantes': payload.integrations || '',
    'Ambiance visuelle': Array.isArray(payload.ambiance) ? payload.ambiance.join(', ') : payload.ambiance || '',
    'Références design': payload.refs_design || '',
    'Contraintes de charte': payload.charte || '',
    'Budget': payload.budget || '',
    'Délai': payload.delai || '',
    'Informations complémentaires': payload.commentaire || '',
    'Date de soumission': dateWithTime,
    'Source': 'Formulaire site SynapFlows'
  };
}

export async function submitToAirtable(payload) {
  // Lire les variables d'environnement AU MOMENT de l'appel (pas au chargement du module)
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_PROJETS_SOUMIS = process.env.AIRTABLE_PROJETS_SOUMIS;
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

  return new Promise((resolve, reject) => {
    // Mapper les champs vers les noms de colonnes Airtable
    const mappedFields = mapToAirtableFields(payload);

    console.log('[SUBMIT] Configuration Airtable:');
    console.log('  BASE_ID:', AIRTABLE_BASE_ID);
    console.log('  TABLE (Projets Soumis):', AIRTABLE_PROJETS_SOUMIS);
    console.log('  TOKEN exists:', !!AIRTABLE_TOKEN);
    console.log('  TOKEN length:', AIRTABLE_TOKEN?.length);
    
    console.log('[SUBMIT] Champs mappés pour Airtable:', JSON.stringify(mappedFields, null, 2));

    const postData = JSON.stringify({ records: [{ fields: mappedFields }] });
    const encodedTable = encodeURIComponent(AIRTABLE_PROJETS_SOUMIS);
    const path = `/v0/${AIRTABLE_BASE_ID}/${encodedTable}`;
    
    console.log('[SUBMIT] URL path:', path);

    const options = {
      hostname: 'api.airtable.com',
      path: path,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('[SUBMIT] Headers (sans token full):', {
      'Authorization': 'Bearer ' + (AIRTABLE_TOKEN?.substring(0, 10) + '...'),
      'Content-Type': 'application/json'
    });

    const airtableReq = https.request(options, (airtableRes) => {
      let data = '';
      airtableRes.on('data', chunk => { data += chunk; });
      airtableRes.on('end', () => {
        console.log('[AIRTABLE] Status:', airtableRes.statusCode);
        console.log('[AIRTABLE] Réponse complète:', data);
        if (airtableRes.statusCode >= 200 && airtableRes.statusCode < 300) {
          console.log('[AIRTABLE] ✅ Succès!');
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Airtable error: ${airtableRes.statusCode} - ${data}`));
        }
      });
    });

    airtableReq.on('error', (err) => {
      console.error('[AIRTABLE] Erreur réseau:', err);
      reject(err);
    });

    airtableReq.write(postData);
    airtableReq.end();
  });
}
