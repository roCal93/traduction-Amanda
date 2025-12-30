# 🏗️ Hakuna Mataweb Starter

Starter officiel pour créer des sites multilingues performants avec Next.js App Router + Strapi v5.

## 🌟 Fonctionnalités

- **Frontend** : Next.js App Router avec TypeScript
- **Backend** : Strapi v5 headless CMS
- **SEO dynamique** : metadata, OpenGraph, Twitter Cards, robots.txt, sitemap.xml
- **i18n** : Support FR/EN avec routing `[locale]`
- **Preview mode** : Pour les drafts en développement
- **Sections modulaires** : Hero, Card, SectionGeneric, Header, Footer
- **Performance** : Images optimisées, headers HTTP, CSP
- **Sécurité** : Headers de sécurité, validation des inputs

## 📂 Structure

```
hakuna-mataweb-starter/
├── strapi-base/           # Backend Strapi v5
│   ├── api/               # APIs personnalisées
│   ├── config/            # Configuration Strapi
│   ├── database/          # Migrations
│   ├── public/            # Assets publics
│   ├── scripts/           # Scripts utilitaires
│   ├── src/               # Code source
│   └── types/             # Types TypeScript
├── nextjs-base/           # Frontend Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── [slug]/page.tsx  # Pages dynamiques
│   │   │   │   ├── layout.tsx       # Layout principal
│   │   │   │   ├── not-found.tsx    # Page 404
│   │   │   │   └── loading.tsx      # Loading states
│   │   ├── components/     # Composants UI réutilisables
│   │   ├── lib/           # Helpers (fetchAPI, SEO, Strapi)
│   │   └── types/         # Types TypeScript générés
│   ├── public/            # Assets statiques
│   ├── next.config.ts     # Configuration Next.js
│   └── package.json       # Dépendances
├── .env.example           # Variables d'environnement
├── README.md              # Ce fichier
└── LICENSE                # Licence MIT
```

## 🚀 Démarrage rapide (5 minutes)

### 1. Cloner le repo
```bash
git clone https://github.com/roCal93/hakuna-mataweb-starter.git my-new-project
cd my-new-project
```

### 2. Configurer les variables d'environnement

#### Next.js (Frontend)
Copiez et configurez les variables dans `nextjs-base/.env.example` :
```bash
cd nextjs-base
cp .env.example .env.local
```

Variables principales :
- `NEXT_PUBLIC_SITE_URL` : URL de votre site (localhost en dev)
- `NEXT_PUBLIC_STRAPI_URL` : URL de votre instance Strapi
- `STRAPI_API_TOKEN` : Token API de Strapi
- `PREVIEW_SECRET` : Secret pour le mode preview

#### Strapi (Backend)
Copiez et configurez les variables dans `strapi-base/.env.example` :
```bash
cd strapi-base
cp .env.example .env
```

Variables principales :
- `DATABASE_HOST`, `DATABASE_PORT`, etc. : Configuration base de données
- `PREVIEW_SECRET` : Même valeur que dans Next.js pour le preview

### 3. Installer les dépendances
```bash
# Frontend
cd nextjs-base
pnpm install

# Backend
cd ../strapi-base
pnpm install
```

### 4. Lancer Strapi
```bash
cd strapi-base
pnpm develop
# Accéder à http://localhost:1337/admin
# Créer un admin et configurer les content types
```

### 5. Lancer Next.js
```bash
cd nextjs-base
pnpm dev
# Accéder à http://localhost:3000
```

### 6. Créer du contenu dans Strapi
- Ajouter des pages avec sections
- Configurer les langues FR/EN
- Uploader des images

### 7. Vérifier et déployer
- Tester SEO et langues (/fr & /en)
- Build : `pnpm build`
- Déployer sur Vercel (frontend) et Railway (backend)

## 📋 Checklist déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données PostgreSQL sur Railway
- [ ] Strapi déployé et accessible
- [ ] Content types créés dans Strapi
- [ ] Pages et sections ajoutées
- [ ] Images uploadées
- [ ] SEO configuré (titres, descriptions, images)
- [ ] Langues FR/EN testées
- [ ] Build Next.js réussi
- [ ] Déploiement Vercel configuré
- [ ] Domaines pointés
- [ ] Tests fonctionnels passés

## 🔧 Configuration avancée

### Variables d'environnement

Voir `.env.example` pour toutes les variables nécessaires.

### Scripts disponibles

```bash
# Frontend
pnpm dev          # Développement
pnpm build        # Build production
pnpm start        # Serveur production
pnpm lint         # Linting
pnpm test         # Tests

# Backend
pnpm develop      # Développement Strapi
pnpm build        # Build Strapi
pnpm start        # Serveur Strapi
```

### Personnalisation

- **Composants** : Ajouter dans `nextjs-base/src/components/`
- **APIs Strapi** : Modifier dans `strapi-base/src/api/`
- **Types** : Régénérer avec `pnpm generate-types` dans Strapi

## 📖 Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Strapi v5](https://docs.strapi.io/)
- [TypeScript](https://www.typescriptlang.org/)

## 🤝 Contribution

Issues et PRs bienvenues !

## 📄 Licence

MIT - Voir [LICENSE](LICENSE)