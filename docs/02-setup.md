# ⚙️ 02 - Installation et configuration

**Temps de lecture** : 15-20 minutes  
**Public cible** : Développeurs, DevOps  
**Dernière mise à jour** : 21 Avril 2026

---

## 📋 Prérequis système

### Obligatoires

```powershell
# Vérifier les versions
node --version      # v20.x ou v22.x (LTS recommandé)
npm --version       # v10.x ou supérieur
pnpm --version      # v9.x ou supérieur (recommandé)
git --version       # v2.x
```

### Versions minimales requises

| Outil | Version Min | Version Recommandée | Pourquoi |
|-------|------------|---------------------|----------|
| **Node.js** | 18.17.0 | 20.x LTS | Support ES2022 |
| **npm/pnpm** | 9.x | 10.x | Dépendances modernes |
| **Git** | 2.30 | 2.45+ | Opérations standard |
| **TypeScript** | 5.0 | 5.x | Type checking strict |

### Optionnels mais utiles

```bash
# VSCode Extensions recommandées
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Thunder Client / REST Client
- GitLens
- Prettier - Code formatter
- ESLint
```

---

## 🚀 Installation - Étape par étape

### 1️⃣ Cloner le repository

```powershell
# Clone HTTPS
git clone https://github.com/cesizen/cesizen_web.git

# OU Clone SSH (si clé SSH configurée)
git clone git@github.com:cesizen/cesizen_web.git

# Entrer dans le dossier
cd cesizen_web
```

### 2️⃣ Installer les dépendances

#### Option A : Avec pnpm (recommandé)

```powershell
# Installer pnpm globalement (une fois)
npm install -g pnpm

# Installer les dépendances du projet
pnpm install

# Vérifier installation
pnpm list --depth=0
```

#### Option B : Avec npm

```powershell
# Installer les dépendances
npm install

# Vérifier installation
npm list --depth=0
```

#### Option C : Avec yarn (legacy)

```powershell
npm install -g yarn
yarn install
yarn list --depth=0
```

**⚠️ Important** : Une seule option ! Ne mélangez pas pnpm, npm, et yarn.

### 3️⃣ Configurer les variables d'environnement

```powershell
# Copier le template
cp .env.example .env.local

# Éditer le fichier
notepad .env.local
```

Ou créer manuellement `.env.local` à la racine:

```bash
# 📌 REQUIRED - API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# 📌 Development
NODE_ENV=development
DEBUG=true

# 📌 Optional - Analytics (si utilisé)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=

# 📌 Optional - Features flags
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE=false
```

### 4️⃣ Vérifier la configuration

```powershell
# Le fichier doit être à la racine du projet
ls -la .env.local

# Vérifier que Next.js le lit
cat .env.local
```

### 5️⃣ Construire les assets Tailwind (optionnel)

```powershell
# Normalement automatique, mais si nécessaire:
pnpm build:css

# ou directement dans dev/build
```

---

## 🎮 Lancement en développement

### Démarrer le serveur de développement

```powershell
# Option 1: Utiliser pnpm
pnpm dev

# Option 2: Utiliser npm
npm run dev

# Option 3: Démarrer avec port personnalisé
pnpm dev -- -p 3001
```

### Vérifier que tout fonctionne

```powershell
# Le serveur démarre sur:
# http://localhost:3000

# Ou si port personnalisé:
# http://localhost:3001
```

**Output attendu** :

```
> cesizen_web@0.1.0 dev
> next dev

  ▲ Next.js 16.2.2
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### Accès à l'application

| URL | Description |
|-----|-------------|
| http://localhost:3000 | **Accueil** |
| http://localhost:3000/respiration | Module respiration |
| http://localhost:3000/prevention | Articles |
| http://localhost:3000/auth/connexion | Login |
| http://localhost:3000/admin | Admin panel |

---

## 🏗️ Build pour production

### Étape 1 : Vérifier que tout compile

```powershell
# Vérification TypeScript
pnpm type-check

# OU directement:
npx tsc --noEmit
```

### Étape 2 : Build optimisé

```powershell
# Build production
pnpm build

# Cela génère:
# - .next/   (app bundle)
# - Optimisations CSS/JS
# - Preload assets
```

### Étape 3 : Tester le build localement

```powershell
# Démarrer la version production
pnpm start

# Accès sur http://localhost:3000
# Beaucoup plus rapide que le mode dev!
```

### Étape 4 : Analyser la taille du build

```powershell
# Voir la taille des bundles
ls -lah .next/

# Analyser avec Bundle Analyzer (optionnel)
pnpm add -D @next/bundle-analyzer
# Puis ajouter au next.config.ts et relancer build
```

---

## 🔧 Scripts disponibles

```json
{
  "scripts": {
    "dev": "next dev",              // Démarrage dev
    "build": "next build",          // Build prod
    "start": "next start",          // Démarrage prod
    "lint": "eslint",               // Lint le code
    "type-check": "tsc --noEmit",   // Vérify TypeScript
    "format": "prettier --write .", // Formater le code
    "clean": "rm -rf .next"         // Nettoyer cache
  }
}
```

**Utilisation** :

```powershell
pnpm dev         # Développement
pnpm build       # Builder
pnpm start       # Production local
pnpm lint        # Vérifier code quality
pnpm type-check  # Vérifier types TypeScript
```

---

## 🐛 Troubleshooting - Problèmes courants

### ❌ "Module not found"

**Symptôme** :
```
Error: Cannot find module 'react'
```

**Solution** :
```powershell
# Réinstaller les dépendances
rm -r node_modules
rm pnpm-lock.yaml  # ou package-lock.json si npm

pnpm install       # ou npm install
```

### ❌ "Port 3000 already in use"

**Symptôme** :
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution - Option A** : Utiliser un autre port
```powershell
pnpm dev -- -p 3001
```

**Solution - Option B** : Tuer le processus
```powershell
# Trouver le PID
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### ❌ "API_BASE_URL not defined"

**Symptôme** :
```
Error: process.env.NEXT_PUBLIC_API_BASE_URL is undefined
```

**Solution** :
```bash
# Vérifier .env.local existe
ls -la .env.local

# Ajouter la variable:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Redémarrer le serveur
# (Next.js lit les .env au démarrage)
pnpm dev
```

### ❌ "Cannot GET /page-inexistante"

**Symptôme** :
```
404 | This page could not be found.
```

**Solution** :
```
C'est normal! Créer la page dans app/:

app/
├── nouvelle-page/
│   └── page.tsx

Puis accès: http://localhost:3000/nouvelle-page
```

### ❌ "TypeScript errors in IDE"

**Symptôme** :
```
Property 'x' does not exist on type 'y'
```

**Solutions** :
```powershell
# Option 1: Rebuild TypeScript
pnpm type-check

# Option 2: Redémarrer VSCode
# (Cmd+Shift+P → Restart TS Server)

# Option 3: Regénérer next-env.d.ts
rm -r .next
pnpm dev
```

### ❌ "Styles Tailwind non appliqués"

**Symptôme** :
```
Classes Tailwind n'apparaissent pas
```

**Solution** :
```bash
# Vérifier que tailwind.config.ts existe
# et contient les patterns corrects:

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}

# Puis redémarrer:
pnpm dev
```

### ❌ "Build fails avec erreur TypeScript"

**Symptôme** :
```
error TS2307: Cannot find module
```

**Solution** :
```powershell
# Vérifier tsconfig.json
# Notamment la section paths:

{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# Puis nettoyer et rebuilder:
pnpm clean
pnpm build
```

---

## 📁 Structure locale après installation

```
cesizen_web/
├── .next/              # Cache de build (auto-généré)
├── node_modules/       # Dépendances (auto-généré)
├── app/                # Pages et layouts
├── components/         # Composants React
├── lib/                # Utilitaires et logique
├── public/             # Assets statiques
├── docs/               # Documentation (cette doc!)
├── .env.local          # Variables d'env (⚠️ NE PAS COMMIT)
├── .env.example        # Template variables
├── .gitignore          # Fichiers ignorés
├── next.config.ts      # Config Next.js
├── tailwind.config.ts  # Config Tailwind CSS
├── tsconfig.json       # Config TypeScript
├── package.json        # Métadonnées et scripts
├── pnpm-lock.yaml      # Lock file (commit)
└── README.md           # Guide rapide
```

---

## 🔐 .gitignore - Ne pas commiter

```bash
# ⚠️ IMPORTANT: Ne JAMAIS commiter ces fichiers:

.env.local           # Variables sensibles
.env.*.local         # Autres fichiers env
node_modules/        # Dépendances (reproduisibles)
.next/               # Cache (auto-généré)
dist/                # Build output
*.log                # Logs

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## 🌐 Configuration par environnement

### Développement

```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
DEBUG=true
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=true
```

### Staging

```bash
# .env.staging (si utilisé)
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api-staging.cesizen.com
DEBUG=false
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=true
```

### Production

```bash
# Défini dans Vercel/deployment
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.cesizen.com
DEBUG=false
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=false
```

---

## ✅ Checklist première installation

```
☐ Node.js 20.x+ installé
☐ pnpm/npm installé
☐ Repository cloné
☐ dépendances installées (pnpm install)
☐ .env.local créé
☐ NEXT_PUBLIC_API_BASE_URL configuré
☐ pnpm dev démarre sans erreur
☐ http://localhost:3000 accessible
☐ Page d'accueil charge correctement
☐ Pas d'erreurs TypeScript
☐ Tailwind CSS styles appliqués
```

---

## 📞 Aide & Support

**Problème non listé?**

1. Vérifier les logs : `pnpm dev` (bottom terminal)
2. Consulter [NAVIGATION.md](./NAVIGATION.md) (FAQ)
3. Ouvrir une issue GitHub
4. Demander à l'équipe

---

## 🎯 Prochaines étapes

Une fois installé:

1. **[03-security.md](./03-security.md)** - Comprendre l'authentification
2. **[05-accueil.md](./05-accueil.md)** - Découvrir le design
3. **[12-composants.md](./12-composants.md)** - Système de composants
4. **[13-exemples-integration.md](./13-exemples-integration.md)** - API examples

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Avril 2026

