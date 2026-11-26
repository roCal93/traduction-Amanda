# Template Next.js – Hakuna Mataweb

Template de base pour tous les projets frontend.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- React 19

## Prérequis

- Node.js 22.23.2 ou une version ultérieure. Utilisez `nvm install` puis
  `nvm use` dans `nextjs-base` pour sélectionner la version de `.nvmrc`.
- pnpm 10, conformément au champ `packageManager` de `package.json`.

La CI utilise `.nvmrc` ; configurez également Node.js 22 ou une version
ultérieure pour le build sur Vercel.

## CSS et rendu initial

Le CSS est intégré au HTML en production avec l'option expérimentale
`inlineCss` de Next.js afin de supprimer la requête CSS bloquante au premier
chargement. Next.js ne recommande pas encore cette option pour la production :
les styles sont répétés dans le HTML et ne bénéficient pas d'un cache séparé.
Pour revenir aux feuilles de style externes, définissez `NEXT_INLINE_CSS=false`
au moment du build et redéployez. Vérifiez le LCP et le rendu sur les pages
concernées après chaque changement. Si une CSP est activée, elle doit autoriser
les styles intégrés par un nonce transmis à Next.js dans les en-têtes de la
requête.

Les images de carrousel hébergées sur Cloudinary sont redimensionnées par le
proxy `/api/carousel-image` selon la taille de la carte et la densité de
l'écran. Les autres hébergements continuent de servir l'image d'origine. Le
proxy conserve l'en-tête `X-Robots-Tag` pour éviter l'indexation des images.

## Déploiement

- Prévu pour Vercel
- Variables d'environnement via `.env.local`

### Découverte des ressources agentiques

Les manifestes publics `/.well-known/ard.json` et
`/.well-known/ai-catalog.json` (ancien chemin) contiennent actuellement une
liste `entries` vide : le site ne publie pas de service ou d'outil agentique.
Si une telle ressource est ajoutée, renseignez les deux fichiers de façon
identique selon la [spécification ARD](https://agenticresourcediscovery.org/spec/).
Le contenu éditorial public reste décrit dans `/llms.txt` et le sitemap.

**Contrôle du mode sombre**: Vous pouvez désactiver le mode sombre globalement pour ce projet en ajoutant dans `.env.local` :

```env
# Désactive le mode sombre pour ce site (forcé en clair)
NEXT_PUBLIC_DISABLE_DARK=true
```

Quand cette variable est définie (`true` ou `1`), le projet ajoute un attribut `data-disable-dark` sur la balise `<html>` pour empêcher l'application des règles CSS `@media (prefers-color-scheme: dark)`.

## Utilisation

### 1. Initialisation

```bash
# Copier ce template
cp -r templates/nextjs-base projects/clients/mon-projet-frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
```

### 2. Configuration Strapi

Ajoutez dans `.env.local` :

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=votre-token-api
```

### 3. Configuration ISR (Revalidation)

Le template inclut la configuration ISR (Incremental Static Regeneration) pour régénérer automatiquement les pages quand le contenu Strapi change.

#### ⚡ Mode de base (Recommandé - Fonctionne immédiatement)

**Pas besoin de webhook !** L'ISR fonctionne avec une revalidation temporelle :

- Les pages se régénèrent automatiquement toutes les heures
- Configuration minimale, fonctionne out-of-the-box
- Suffisant pour la plupart des sites web

#### 🚀 Mode avancé (Revalidation instantanée - Optionnel)

Pour des mises à jour instantanées quand le contenu change dans Strapi :

#### Variables d'environnement

Ajoutez dans `.env.local` (optionnel - seulement si vous voulez la revalidation instantanée) :

```env
REVALIDATE_SECRET=Brnb60gSKW3YOOWwZmWXX425mxv5fRpT1QKYCgk6e88=
```

#### Configuration dans Strapi

1. Allez dans **Settings > Webhooks** dans Strapi
2. Créez un nouveau webhook :
   - **Name**: `Next.js Revalidation`
   - **URL**: `https://votre-domaine.com/api/revalidate`
   - **Headers**: `x-webhook-secret: Brnb60gSKW3YOOWwZmWXX425mxv5fRpT1QKYCgk6e88=`
   - **Events**: Cochez `Entry publish`, `Entry update`, `Entry delete` pour le Content-Type `page`

#### Comment ça marche

- **Revalidation temporelle** (toujours active) : Les pages se régénèrent automatiquement toutes les heures
- **Revalidation à la demande** (optionnel) : Quand Strapi détecte un changement, il appelle le webhook qui invalide le cache immédiatement
- **Cache intelligent** : Utilise `unstable_cache` avec des tags pour une invalidation précise

### 4. Types TypeScript Strapi

#### Synchronisation des types

Les types sont générés côté Strapi et synchronisés automatiquement.

```bash
# Synchroniser les types depuis Strapi
npm run sync:types
```

#### Utilisation dans le code

Les types sont maintenant disponibles avec autocomplétion complète :

```tsx
import { createStrapiClient } from '@/lib/strapi-client'
import type { Page, PageEntity, PageCollectionResponse } from '@/types/strapi'

// Créer le client
const strapi = createStrapiClient({
  apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL!,
  apiToken: process.env.STRAPI_API_TOKEN,
})

// Récupérer des données avec types complets
export async function getPages(): Promise<PageEntity[]> {
  const response: PageCollectionResponse = await strapi.findMany<Page>(
    'pages',
    {
      sort: ['createdAt:desc'],
      pagination: { pageSize: 100 },
    }
  )

  return response.data
}

// Utilisation dans un Server Component
export default async function PagesPage() {
  const pages = await getPages()

  return (
    <div>
      {pages.map((page) => (
        <article key={page.id}>
          {/* TypeScript connaît la structure exacte */}
          <h2>{page.attributes.title}</h2>
          {/* Autocomplétion sur page.attributes.* */}
        </article>
      ))}
    </div>
  )
}
```

#### Quand synchroniser ?

- Après chaque modification de Content-Type dans Strapi
- Après un `git pull` qui modifie les schemas Strapi
- Au début d'un nouveau sprint de développement

#### Structure des fichiers

```
nextjs-base/
├── src/
│   ├── types/
│   │   └── strapi/
│   │       └── index.ts           # Types synchronisés (NE PAS MODIFIER)
│   ├── lib/
│   │   ├── strapi-client.ts       # Client Strapi typé
│   │   └── strapi-usage-example.tsx  # Exemples d'utilisation
│   └── app/                       # Vos pages et composants
└── scripts/
    └── sync-types-from-strapi.js  # Script de synchronisation
```

### 4. Développement

```bash
# Lancer le serveur de développement
npm run dev

# Le site est accessible sur http://localhost:3000
```

### 5. Build et déploiement

```bash
# Build de production
npm run build

# Tester le build localement
npm start

# Déployer sur Vercel
vercel
```

## Client Strapi typé

Le template inclut un client Strapi complet avec support TypeScript.

### Méthodes disponibles

```typescript
// Récupérer une collection
strapi.findMany<T>(contentType, options)

// Récupérer une entrée par ID
strapi.findOne<T>(contentType, id, options)

// Créer une entrée
strapi.create<T>(contentType, data)

// Mettre à jour
strapi.update<T>(contentType, id, data)

// Supprimer
strapi.delete<T>(contentType, id)
```

### Options de requête

```typescript
{
  populate: '*',                    // ou ['author', 'image']
  filters: { title: { $eq: 'Hello' } },
  sort: ['createdAt:desc'],
  pagination: { page: 1, pageSize: 10 },
  fields: ['title', 'content'],
  locale: 'fr',
  publicationState: 'live'
}
```

### Exemples complets

Consultez [src/lib/strapi-usage-example.tsx](src/lib/strapi-usage-example.tsx) pour des exemples détaillés.

## Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Démarrer en production
npm run lint         # Linter
npm run sync:types   # Synchroniser les types Strapi
```

## Configuration TypeScript

Le projet est configuré avec des options strictes pour une sécurité maximale :

- Types Strapi auto-générés
- Autocomplétion complète
- Détection des erreurs à la compilation

## Bonnes pratiques

### Types Strapi

- ✅ Utilisez toujours les types générés
- ✅ Synchronisez régulièrement avec `npm run sync:types`
- ❌ Ne modifiez jamais `src/types/strapi/index.ts`
- ✅ Utilisez le client Strapi typé pour les requêtes

### Structure des données

```typescript
// ❌ Mauvais : accès direct sans types
const title = data.attributes.title // Pas d'autocomplétion

// ✅ Bon : avec types
const response: PageResponse = await strapi.findOne<Page>('pages', id)
const title = response.data?.attributes.title // Autocomplétion !
```

### Gestion des erreurs

```typescript
try {
  const pages = await strapi.findMany<Page>('pages')
  return pages.data
} catch (error) {
  console.error('Erreur Strapi:', error)
  return []
}
```

## Troubleshooting

### Types non trouvés

```bash
# Vérifier que les types existent
ls -la src/types/strapi/

# Synchroniser depuis Strapi
npm run sync:types
```

### Types obsolètes

```bash
# Depuis le projet Strapi
cd ../strapi-base
npm run types

# Revenir sur Next.js et synchroniser
cd ../nextjs-base
npm run sync:types
```

### Erreurs TypeScript

Si TypeScript ne trouve pas les types :

1. Vérifiez que `src/types/strapi/index.ts` existe
2. Relancez le serveur de développement
3. Rechargez VS Code (Cmd+Shift+P > "Reload Window")

## Variables d'environnement

### Configuration complète

#### Variables obligatoires

| Variable                 | Description                                               | Exemple                                               |
| ------------------------ | --------------------------------------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | URL publique du site (pour metadata, sitemap, robots.txt) | `https://amandatraduction.com`                        |
| `NEXT_PUBLIC_STRAPI_URL` | URL du backend Strapi                                     | `https://traduction-amanda-production.up.railway.app` |
| `STRAPI_API_TOKEN`       | Token d'API Strapi pour les requêtes serveur              | Token long de 200+ caractères                         |

#### Variables optionnelles

| Variable                   | Description                                 | Valeur par défaut             |
| -------------------------- | ------------------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_DISABLE_DARK` | Désactiver le mode sombre                   | `false`                       |
| `PREVIEW_SECRET`           | Secret pour le mode preview Strapi          | Généré aléatoirement          |
| `STRAPI_PREVIEW_TOKEN`     | Token pour accéder au contenu draft         | Token long de 200+ caractères |
| `USE_DRAFT_MODE`           | Activer le mode draft/preview               | `false`                       |
| `REVALIDATE_SECRET`        | Secret pour la revalidation ISR via webhook | Généré aléatoirement          |

#### Variables de contact (formulaire)

| Variable            | Description                            | Exemple                             |
| ------------------- | -------------------------------------- | ----------------------------------- |
| `RESEND_API_KEY`    | Clé API Resend pour l'envoi d'emails   | `re_XXXXXX...`                      |
| `RESEND_FROM_EMAIL` | Email expéditeur (vérifié dans Resend) | `contact@mail.amandatraduction.com` |
| `CONTACT_EMAIL`     | Email destinataire des formulaires     | `amanda.fontannaz@gmail.com`        |

#### Variables système (Vercel)

| Variable            | Description                  | Note                         |
| ------------------- | ---------------------------- | ---------------------------- |
| `VERCEL_OIDC_TOKEN` | Token OIDC généré par Vercel | Auto-généré, ne pas modifier |

### Exemple `.env.local`

```env
# Site configuration
NEXT_PUBLIC_SITE_URL="https://amandatraduction.com"
NEXT_PUBLIC_DISABLE_DARK="true"

# Strapi connection
NEXT_PUBLIC_STRAPI_URL="https://traduction-amanda-production.up.railway.app"
STRAPI_API_TOKEN="votre-token-api-de-200-caracteres..."

# Preview mode (optionnel)
PREVIEW_SECRET="secret-aleatoire-32-caracteres"
STRAPI_PREVIEW_TOKEN="votre-token-preview-de-200-caracteres..."
USE_DRAFT_MODE="true"

# ISR Revalidation (optionnel)
REVALIDATE_SECRET="secret-aleatoire-pour-webhook"

# Email (Resend)
RESEND_API_KEY="re_XXXXXX..."
RESEND_FROM_EMAIL="contact@mail.amandatraduction.com"
CONTACT_EMAIL="amanda.fontannaz@gmail.com"
```

### Configuration en production (Vercel)

1. Accédez aux **Settings > Environment Variables** dans Vercel
2. Ajoutez toutes les variables nécessaires
3. Sélectionnez les environnements : Production, Preview, Development
4. Redéployez pour appliquer les changements

### Génération des secrets

```bash
# Générer un secret aléatoire (32 caractères base64)
openssl rand -base64 32

# Exemples d'utilisation :
# - PREVIEW_SECRET
# - REVALIDATE_SECRET
```

### Sécurité

⚠️ **Important :**

- Les variables préfixées par `NEXT_PUBLIC_` sont exposées côté client
- Ne jamais exposer les tokens d'API dans le code frontend
- Vérifier que `.env.local` est bien dans `.gitignore`
- Utiliser des secrets différents entre développement et production

⚠️ **Ne jamais modifier ce template directement**  
Pour un nouveau projet : copiez le dossier complet dans `/projects/clients/`

# Build cache clear
