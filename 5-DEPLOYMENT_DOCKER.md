# 🐳 Déploiement & Docker

Guide de déploiement, Docker et configuration d'environnement.

---

## 📦 Configuration racine (Tous frameworks)

### `package.json` (Node.js)

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "PROJECT_DESCRIPTION",
  "type": "module",
  "main": "backend/index.js",
  "scripts": {
    "dev": "concurrently \"vite --host\" \"npm run server:dev\"",
    "server:dev": "node backend/index.js",
    "build": "vite build",
    "preview": "vite preview",
    "start": "npm run build && npm run server:dev"
  },
  "keywords": ["app", "form"],
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "concurrently": "^9.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^8.0.6"
  }
}
```

### `.env.example`

**Toujours inclure ce fichier dans Git (sans valeurs sensibles)**

```
# Airtable
AIRTABLE_BASE_ID=appXXXXXXXXXXXXX
AIRTABLE_TABLE=Projets Soumis
AIRTABLE_TOKEN=patXXXXXXXXXXXX.XXXXXXXXXXXXXX

# Serveur
PORT=5001
NODE_ENV=development

# Optionnel
API_KEY=your-secret-key
```

### `.gitignore`

```
# Dépendances
node_modules/
packages-lock.json
yarn.lock

# Environnement
.env
.env.local
.env.*.local

# Build
dist/
public/assets/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

---

## 🐳 Docker

### `Dockerfile`

```dockerfile
# Utiliser une image Node.js officielle légère
FROM node:20-alpine

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (y compris Vite pour le build)
RUN npm install --legacy-peer-deps

# Copier tout le code source
COPY . .

# Builder l'application (Vite génère les fichiers statiques)
RUN npm run build

# Exposer le port
EXPOSE 5000

# Lancer le serveur
CMD ["npm", "run", "server:dev"]
```

### `docker-compose.yml` (Développement)

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: project-name-dev
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - NODE_ENV=development
      - PORT=5000
    ports:
      - "5000:5000"
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
```

### `docker-compose.yml` (Production avec Traefik)

Utilisez ce setup si vous avez un reverse proxy **Traefik** déjà configuré.

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: project-name-prod
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - PORT=5000
    networks:
      - your-network  # Remplacer par votre réseau Traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`app.yourdomain.com`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=myresolver"
      - "traefik.docker.network=your-network"
      - "traefik.http.services.app.loadbalancer.server.port=5000"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  your-network:
    external: true
```

---

## 🚀 Lancer avec Docker

### Développement

```bash
# Build et lancer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

### Production

```bash
# Build
docker build -t project-name:latest .

# Lancer
docker run -d --name project-name \
  --env-file .env \
  -p 5000:5000 \
  project-name:latest

# Vérifier
docker ps
docker logs project-name
```

---

## ☁️ Déploiement sur plateformes cloud

### Vercel (Frontend uniquement, recommandé pour React)

1. Connecter votre repo GitHub
2. Sélectionner "Vite" + "React"
3. Varibles d'environnement: Non nécessaire (frontend seulement)
4. Deploy!

**Note:** Vercel ne peut pas héberger le backend Express. Utilisez une autre plateforme.

### Heroku (Frontend + Backend)

```bash
# 1. Installer Heroku CLI
npm install -g heroku

# 2. Se connecter
heroku login

# 3. Créer l'app
heroku create project-name

# 4. Ajouter les variables d'environnement
heroku config:set AIRTABLE_BASE_ID=appXXX
heroku config:set AIRTABLE_TOKEN=patXXX
heroku config:set PORT=5000

# 5. Créer Procfile à la racine
echo "web: npm run start" > Procfile

# 6. Deploy
git push heroku main
```

**Note:** Heroku est payant à partir d'un certain usage.

### Railway (Frontend + Backend, plus simple)

1. Connecter votre repo GitHub: https://railway.app
2. Créer un nouveau projet
3. Sélectionner votre repo
4. Ajouter variable d'environnement: `PORT=8000`
5. Ajouter les variables Airtable
6. Deploy!

### Docker Hub + VPS personnel

```bash
# 1. Build local
docker build -t yourusername/project-name:latest .

# 2. Login Docker Hub
docker login

# 3. Push
docker push yourusername/project-name:latest

# 4. Sur votre VPS
docker run -d --name app \
  --env-file /path/to/.env \
  -p 8000:5000 \
  yourusername/project-name:latest
```

---

## 🔒 Variables d'environnement sensibles

**JAMAIS inclure dans Git:**
```
.env              ← Ajouter à .gitignore
.env.local        ← Ajouter à .gitignore
```

**Toujours inclure:**
```
.env.example      ← Copie sans valeurs (modèle)
```

**Sur plateformes cloud:**
- Heroku: `heroku config:set KEY=value`
- Railway: Interface web → Variables
- Docker: `-e KEY=value` ou `--env-file`
- Vercel: project settings → Environment Variables

---

## ✅ Checklist avant déploiement

- [ ] `.env.example` existe et est dans Git
- [ ] `.env` n'est PAS dans Git (.gitignore)
- [ ] Toutes les variables d'environnement sont définies
- [ ] `npm run build` fonctionne sans erreur
- [ ] Tests locaux réussis
- [ ] CORS configuré correctement
- [ ] Headers de sécurité (HTTPS, HSTS)
- [ ] Logs monitörés en production
- [ ] Sauvegarde de la table Airtable régulière

---

## 🔍 Monitoring en production

### Voir les logs

```bash
# Heroku
heroku logs --tail

# Railway
# Interface web → Logs

# VPS Docker
docker logs -f container-name

# VPS PM2
pm2 logs app-name
```

### Statistiques

```bash
# Heroku
heroku ps
heroku status

# Railway
# Interface web → Deployments

# Docker
docker stats

# VPS (système)
htop
free -h
```

---

## 🚨 Gestion des erreurs

### Application crash

```bash
# Si déployée avec Docker
docker restart container-name

# Si déployée avec PM2
pm2 restart app-name

# Si Heroku
git push heroku main  # Re-déploy
```

### Erreur Airtable

- Vérifier BASE_ID et TOKEN dans `.env`
- Vérifier permissions du token (data.records:read/write)
- Vérifier table existe et a le bon nom

### Erreur CORS

Ajouter dans `backend/index.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',  // Remplacer
  methods: ['GET', 'POST']
}))
```

---

## 📚 Ressources

- [Docker Documentation](https://docs.docker.com)
- [Railway Guide](https://docs.railway.app)
- [Heroku Docs](https://devcenter.heroku.com)
- [Vercel Docs](https://vercel.com/docs)

---

**Voir aussi:**
- [4-QUICK_START.md](4-QUICK_START.md) – Démarrage rapide local
- [INDEX.md](INDEX.md) – Vue d'ensemble des tous les fichiers

