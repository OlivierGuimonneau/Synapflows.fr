# ⚡ Quick Start – 5 minutes

Lance l'app en 5 étapes rapides.

## 1️⃣ Ouvrir le terminal

```bash
cd d:\SynapFlows-ProjectSubmission
```

## 2️⃣ Installer les dépendances

```bash
npm install
```
(Attendre 2-5 min)

## 3️⃣ Créer `.env`

À la racine du projet, créer un fichier `.env`:

```bash
AIRTABLE_BASE_ID=appvGEsLWrImfUU9i
AIRTABLE_TABLE=Projets Soumis
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
PORT=5001
NODE_ENV=development
```

**Valeurs à remplacer:**
- `appvGEsLWrImfUU9i` → Votre BASE_ID (depuis URL Airtable: `airtable.com/{BASE_ID}/...`)
- `patXXX...` → Votre token API (générer sur https://airtable.com/account/tokens)

## 4️⃣ Lancer

```bash
npm run dev
```

Attendre les messages:
```
VITE ready in ... ms
✅ Serveur lancé sur http://localhost:5001
```

## 5️⃣ Ouvrir dans le navigateur

**http://localhost:5174**

---

## ✅ Tester

Remplir le formulaire et cliquer "Envoyer la demande" → Vérifier dans Airtable

---

## ❌ Erreurs?

- **Port déjà utilisé?** → Changer `PORT=5002` dans `.env`
- **Airtable 404?** → Vérifier BASE_ID et token dans `.env`
- **Vite ne démarre pas?** → Relancer: `npm run dev`

Voir [SETUP.md](SETUP.md) pour le dépannage complet.

---

**c'est bon!** 🎉

**API:**
- Airtable REST API - Base de données
- FormData - État formulaire

## 🎯 Prochaines étapes suggérées

1. **Tester le build**:
   ```bash
   npm run build
   npm start
   ```

2. **Ajouter des validations avancées**:
   - Installer `react-hook-form`: `npm install react-hook-form`
   - L'utiliser dans `Step1.jsx` et autres

3. **Ajouter des notifications**:
   - Installer `react-toastify`: `npm install react-toastify`
   - Afficher des messages de succès/erreur

4. **Ajouter des tests**:
   - Installer `Vitest`: `npm install -D vitest @testing-library/react`
   - Tester les composants individuels

5. **Déployer**:
   - Render, Railway, Vercel, Heroku
   - Consulter README.md pour les commandes de déploiement

## 🔗 Ressources utiles

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Express.js](https://expressjs.com)
- [Airtable API](https://airtable.com/api)

## 🎓 Points clés pour la maintenance

1. **Modifier le formulaire**: Éditez les fichiers `Step1-6.jsx`
2. **Changer les styles**: Modifiez `App.css` (variables CSS au top)
3. **Ajouter une étape**: Créez `Step7.jsx` et mettez à jour `TOTAL_STEPS` dans `App.jsx`
4. **Intégrations**: Ajoutez des services dans `backend/services/`
5. **Sécurité**: Toujours utiliser `.env` pour les tokens/secrets

## ✨ Caractéristiques clés

- ✅ Multi-step form complet
- ✅ Validation données
- ✅ Intégration Airtable
- ✅ Thème light/dark adaptatif
- ✅ Responsive design
- ✅ Animation fluidité
- ✅ Écran de confirmation
- ✅ Résumé soumission

---

**Status**: ✅ Prêt pour production  
**Dernière mise à jour**: 2026-04-07  
**Version**: 1.0.0

Bon développement! 🚀
