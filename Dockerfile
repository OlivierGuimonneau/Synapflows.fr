# Utiliser une image Node.js officielle et légère
FROM node:20-alpine

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# 1. Installer TOUTES les dépendances (y compris Vite pour le build)
RUN npm install --legacy-peer-deps

# Copier tout le code source
COPY . .

# Variable de build pour le frontend (clé publique reCAPTCHA embarquée par Vite)
ARG VITE_RECAPTCHA_SITE_KEY
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

# 2. Construire l'application (Vite va générer les fichiers statiques)
RUN npm run build

# Exposer le port que ton app utilise
EXPOSE 5000

# 3. Lancer UNIQUEMENT le serveur (adapte si "server:dev" est la seule commande de run)
CMD ["npm", "run", "server:dev"]