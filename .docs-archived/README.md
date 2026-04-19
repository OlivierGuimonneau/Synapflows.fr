# 📦 Archives – Fichiers hérités (www.synapflows.fr)

Ce dossier contient les fichiers de documentation archivés du projet. Ils ne sont **plus utilisés** pour www.synapflows.fr mais conservés pour l'historique.

---

## 📋 Ce qui a été archivé

### 🔴 **Spécifiques à project.synapflows.fr** (VPS legacy)
Obsolètes – concernent l'ancien site projet (domain séparé)
- `PHASE2_DEPLOYMENT_VALIDATION.md` – Validation déploiement proj.synapflows.fr
- `PHASE3_TLS_HARDENING.md` – TLS hardening pour proj.synapflows.fr
- `CRON_ALERTING_SETUP.md` – Monitoring custom
- `CRON_AND_ALERTS_COMPLETE.md` – Monitoring custom
- `setup-cron.sh`, `monitor-*.sh`, `monitor-config.conf` – Scripts monitoring

### 🟡 **Templates génériques** (remplacés par `.github/`)
Utiles comme référence mais dépassés – utilisez `.github/` à la place
- `1-DESIGN_SYSTEM.md` → `.github/skills/ui-patterns/SKILL.md` + `src/frontend/styles/variables.css`
- `2-FRONTEND_REACT_TEMPLATE.md` → `.github/prompts/create-react-component.prompt.md`
- `3-BACKEND_NODE_EXPRESS_TEMPLATE.md` → `.github/prompts/create-endpoint.prompt.md`
- `4-QUICK_START.md` → `README.md` (version moderne) + `.github/copilot-instructions.md`
- `5-DEPLOYMENT_DOCKER.md` → `.github/skills/docker-vps-traefik/SKILL.md`
- `PROJECT_TEMPLATE.md` → `.github/prompts/` (tous)
- `INDEX.md` → Structure en `.github/` (source de vérité)

### 📊 **Historique & rapports** (référence/contexte)
Archivés pour traçabilité mais ne sont plus à jour
- `MIGRATION_NOTES.md` – Notes migration project.synapflows.fr → www.synapflows.fr
- `MIGRATION_WWW_SYNAPFLOWS.md` – Historique migration
- `SECURITY_SCAN_REPORT.md` – Rapport scan initial
- `SECURITY_REMEDIATION_FINAL_REPORT.md` – Corrections sécurité
- `SECURITY_HARDENING_COMPLETE_GUIDE.md` – Guide sécurité (voir `.github/skills/security-hardening/`)
- `POST_REMEDIATION_ACTION_PLAN.md` – Plan d'action post-fix
- `IMMEDIATE_PRIORITIES.md` – Priorités anciennes (obsolète)

---

## ✅ Points de référence actuels

| Besoin | Référence |
|--------|-----------|
| **Architecture globale** | `.github/copilot-instructions.md` |
| **Stack & démarrage** | `README.md` (nouveau) |
| **Design system** | `src/frontend/styles/variables.css` |
| **Composants UI** | `.github/skills/ui-patterns/SKILL.md` |
| **Backend** | `.github/instructions/backend-*.instructions.md` |
| **Sécurité** | `.github/skills/security-hardening/SKILL.md` |
| **Déploiement** | `.github/workflows/deploy.yml` |
| **Airtable** | `.github/skills/api-airtable/SKILL.md` |
| **Docker/Traefik** | `.github/skills/docker-vps-traefik/SKILL.md` |
| **Prompts Copilot** | `.github/prompts/` |

---

## 🔍 Consulter l'historique

```bash
# Voir tous les commits d'un fichier archivé
git log --follow -- .docs-archived/FILENAME

# Voir le contenu à une date antérieure
git show HEAD~5:.docs-archived/FILENAME
```

---

## 📝 Liste complète archivée

```
.docs-archived/
├── 📄 1-DESIGN_SYSTEM.md
├── 📄 2-FRONTEND_REACT_TEMPLATE.md
├── 📄 3-BACKEND_NODE_EXPRESS_TEMPLATE.md
├── 📄 4-QUICK_START.md
├── 📄 5-DEPLOYMENT_DOCKER.md
├── 📄 CRON_ALERTING_SETUP.md
├── 📄 CRON_AND_ALERTS_COMPLETE.md
├── 📄 INDEX.md
├── 📄 IMMEDIATE_PRIORITIES.md
├── 📄 MIGRATION_NOTES.md
├── 📄 MIGRATION_WWW_SYNAPFLOWS.md
├── 📄 PHASE2_DEPLOYMENT_VALIDATION.md
├── 📄 PHASE3_TLS_HARDENING.md
├── 📄 POST_REMEDIATION_ACTION_PLAN.md
├── 📄 PROJECT_TEMPLATE.md
├── 📄 SECURITY_HARDENING_COMPLETE_GUIDE.md
├── 📄 SECURITY_REMEDIATION_FINAL_REPORT.md
├── 📄 SECURITY_SCAN_REPORT.md
├── 🔧 monitor-config.conf
├── 🔧 monitor-security.sh
├── 🔧 monitor-with-alerts.sh
└── 🔧 setup-cron.sh
```

---

**Status:** ✅ Archivés le 19 avril 2026 – Source de vérité maintenant en `.github/`
