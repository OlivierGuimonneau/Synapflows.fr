---
name: github-actions-deployment
description: Guide complet de déploiement automatique GitHub Actions vers VPS avec Docker et Traefik.
---

# GitHub Actions Deployment Guide

## Table des matières
1. [Prérequis](#prérequis)
2. [Setup SSH](#setup-ssh)
3. [Configuration GitHub Secrets](#configuration-github-secrets)
4. [Workflow Déploiement](#workflow-déploiement)
5. [Monitoring](#monitoring)
6. [Troubleshooting](#troubleshooting)

---

## Prérequis

- ✅ VPS avec Docker et Docker Compose installés
- ✅ Git versionné sur le VPS
- ✅ `.env` présent sur le VPS (pas dans Git)
- ✅ Traefik ou autre reverse proxy en place
- ✅ Accès SSH root au VPS

---

## Setup SSH

### Étape 1: Générer une clé SSH sur ton ordi

**Option A: PowerShell (Windows)**
```powershell
cd ~/.ssh
ssh-keygen -t ed25519 -f deploy_key
# Appuie sur Entrée quand on demande le password
```

**Option B: Git Bash (Windows)**
```bash
ssh-keygen -t ed25519 -f deploy_key -N ""
```

**Option C: Linux/macOS**
```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
```

### Étape 2: Voir la clé publique

```bash
# Windows PowerShell
type $env:USERPROFILE\.ssh\deploy_key.pub

# Linux/macOS/Git Bash
cat ~/.ssh/deploy_key.pub
```

Copie tout (ex: `ssh-ed25519 AAAA...xyz`).

### Étape 3: Ajouter la clé publique au VPS

```bash
ssh root@your-vps.com

# Sur le VPS, tape:
echo "ssh-ed25519 AAAA...xyz" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

### Étape 4: Voir la clé privée

```bash
# Windows PowerShell
type $env:USERPROFILE\.ssh\deploy_key

# Linux/macOS/Git Bash
cat ~/.ssh/deploy_key
```

Copie **TOUT** incluant `-----BEGIN OPENSSH PRIVATE KEY-----` et `-----END OPENSSH PRIVATE KEY-----`.

### Étape 5: Tester SSH manuellement

```bash
# Windows PowerShell
ssh -i $env:USERPROFILE\.ssh\deploy_key root@your-vps.com "echo 'OK'"

# Linux/macOS/Git Bash
ssh -i ~/.ssh/deploy_key root@your-vps.com "echo 'OK'"
```

Si tu vois `OK`, la connexion SSH fonctionne! ✓

---

## Configuration GitHub Secrets

### Va sur GitHub
1. Repo → **Settings** → **Secrets and variables** → **Actions**
2. Clique **New repository secret**

### Ajoute ces secrets

| Name | Value | Exemple |
|------|-------|---------|
| `SSH_PRIVATE_KEY` | Clé privée complète (étape 4) | `-----BEGIN OPENSSH...` |
| `VPS_HOST` | Domaine/IP du VPS | `project.synapflows.fr` |
| `VPS_USER` | Utilisateur SSH | `root` |
| `VPS_PATH` | Chemin app sur VPS | `/root/synap-ratings` |

### ✅ Vérification

Va dans **Settings → Secrets** et assure-toi que:
- ✓ `SSH_PRIVATE_KEY` existe et a du contenu
- ✓ `VPS_HOST` = ton domaine/IP exact
- ✓ `VPS_USER` = `root` ou l'utilisateur SSH
- ✓ `VPS_PATH` = chemin exact de ton app

---

## Workflow Déploiement

### Fichier: `.github/workflows/deploy.yml`

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to VPS
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
          VPS_PATH: ${{ secrets.VPS_PATH }}
        run: |
          # Setup SSH with proper key formatting
          mkdir -p ~/.ssh
          
          # Write SSH key with proper handling of newlines
          cat > ~/.ssh/deploy_key << 'SSH_KEY_EOF'
          ${{ secrets.SSH_PRIVATE_KEY }}
          SSH_KEY_EOF
          
          chmod 600 ~/.ssh/deploy_key
          
          # Add VPS to known hosts
          ssh-keyscan -H ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts 2>/dev/null || true
          
          # Test SSH connection first
          echo "🔐 Testing SSH connection..."
          ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} "echo '✓ SSH connection successful'" || exit 1
          
          # Deploy script
          echo "🚀 Starting deployment..."
          ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} << 'DEPLOY_SCRIPT'
          set -e
          
          cd ${{ secrets.VPS_PATH }}
          
          echo "📥 Pulling latest code..."
          git pull origin main
          
          echo "🔧 Loading environment variables..."
          export $(cat .env | xargs)
          
          echo "🏗️  Building Docker image..."
          docker compose -f deploy/docker-compose.synap-ratings.yml build --no-cache
          
          echo "⏹️  Stopping old container..."
          docker compose -f deploy/docker-compose.synap-ratings.yml down || true
          
          echo "▶️  Starting new container..."
          docker compose -f deploy/docker-compose.synap-ratings.yml up -d
          
          echo "✅ Waiting for service to be ready..."
          sleep 5
          
          echo "🔍 Checking container status..."
          docker compose -f deploy/docker-compose.synap-ratings.yml ps
          
          DEPLOY_SCRIPT

      - name: Deployment Status
        if: success()
        run: |
          echo "✅ Deployment completed successfully!"
          echo "🌐 Check https://www.synap-ratings.com"

      - name: Deployment Failed
        if: failure()
        run: |
          echo "❌ Deployment failed!"
          echo "Check GitHub Actions logs for details"
```

### Utilisation

```bash
# Fais des changements
git add .
git commit -m "feat: add new feature"
git push origin main  # ← Déclenche le workflow automatiquement!
```

---

## Monitoring

### Sur GitHub
1. Repo → **Actions**
2. Clique sur le dernier workflow pour voir les logs en temps réel

### Sur le VPS
```bash
# Voir les logs du dernier déploiement
docker logs <container-name> --tail 50

# Vérifier le status du container
docker ps | grep <app-name>

# Vérifier les données dans Airtable (si app capte des leads, etc.)
```

---

## Troubleshooting

### ❌ "Permission denied (publickey)"

**Cause**: Clé SSH non reconnue ou `.ssh/authorized_keys` mal configuré

**Solutions**:
```bash
# Test SSH directement depuis ton ordi
ssh -i ~/.ssh/deploy_key root@your-vps.com

# Sur le VPS, vérifie permissions
ls -la ~/.ssh/authorized_keys  # Doit être 600

# Ajoute la clé publique à nouveau
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### ❌ "error in libcrypto"

**Cause**: Clé SSH mal formatée (newlines perdues)

**Solutions**:
- Regénère la clé: `ssh-keygen -t ed25519 -f deploy_key`
- Copie la **clé privée complète** avec les `-----BEGIN/END-----`
- Mets à jour le secret GitHub

### ❌ "fatal: not a git repository"

**Cause**: Le chemin VPS n'a pas `.git` ou n'existe pas

**Solutions**:
```bash
ssh root@your-vps.com
cd /root/synap-ratings  # Ou ton VPS_PATH
git status  # Doit montrer le repo
```

### ❌ "docker compose: command not found"

**Cause**: Docker Compose pas installé

**Solutions**:
```bash
# Sur le VPS, installe Docker Compose v2
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### ❌ Container se lance mais app ne répond pas

```bash
# Affiche les logs
docker logs <container-name> --tail 100

# Vérifie les variables d'environnement
docker exec <container-name> env | grep -i recaptcha

# Redémarre
docker compose -f deploy/docker-compose.yml restart
```

---

## Rollback en cas de problème

```bash
# Sur le VPS
cd /root/synap-ratings

# Revenir au commit précédent
git revert HEAD
git push

# Ou arrêter le nouveau déploiement et restaurer le précédent
docker compose down
docker images | grep <image-name>  # Voir l'historique
docker run -d <ancien-image-id>
```

---

## Sécurité

- ✅ Clé SSH dédiée pour GitHub (pas ta clé personnelle)
- ✅ Secrets chiffrés chez GitHub
- ✅ `.env` du VPS jamais dans Git
- ✅ Logs masquent les secrets sensibles automatiquement
- ✅ SSH avec `StrictHostKeyChecking=no` pour automation (sûr dans ce contexte)

---

## Réutilisation dans nouveaux projets

1. Copie `.github/workflows/deploy.yml`
2. Module les noms de fichiers/services:
   - `docker-compose.synap-ratings.yml` → ton fichier compose
   - `<container-name>` → ton conteneur
3. Crée les 4 secrets GitHub (`SSH_PRIVATE_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_PATH`)
4. Push vers `main` et teste!

