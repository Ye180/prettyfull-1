# 🚀 Implémentation des Routes Progressives - Site Content

## ✅ Travail Effectué

### 1. Nouveaux DTOs (`dto/step-site-content.dto.ts`)

Création de 3 DTOs distincts pour chaque étape du formulaire :

- **`CreateStep1Dto`** : Champs de base + sections 1-3
  - `key`, `type`, `isActive`, `sortOrder`, `quote`
  - `first`, `secondSection`, `thirdSection`

- **`UpdateStep2Dto`** : Sections 4-6
  - `fourthSection`, `fiveSection`, `sixSection`

- **`UpdateStep3Dto`** : Sections 7-10
  - `sevenSection`, `eightSection`, `nineSection`, `tenSection`

### 2. Nouvelles Routes (`site-content.controller.ts`)

Ajout de 3 endpoints progressifs :

```typescript
POST   /site-content/step-1          // Crée le document
PATCH  /site-content/:id/step-2      // Ajoute sections 4-6
PATCH  /site-content/:id/step-3      // Finalise sections 7-10
```

### 3. Nouvelles Méthodes Service (`site-content.service.ts`)

- **`createStep1(dto)`** : Crée un nouveau document avec les données du step 1
- **`updateStep2(id, dto)`** : Met à jour le document avec les sections 4-6
- **`updateStep3(id, dto)`** : Finalise le document avec les sections 7-10

Utilisation de `$set` pour les mises à jour incrémentales MongoDB.

### 4. Correction du Schéma

Export du type `SiteContentDocument` dans `schemas/site-content.schema.ts` :

```typescript
export type SiteContentDocument = SiteContent & Document;
```

### 5. Documentation

- **`STEP_ROUTES_GUIDE.md`** : Guide complet d'utilisation
- **`test-step-routes.http`** : Exemples de requêtes REST pour tester

## 🎯 Workflow d'Utilisation

```
Frontend Step 1  →  POST /step-1         →  Retourne { _id, ... }
                                              ↓
Frontend Step 2  →  PATCH /:id/step-2    →  Met à jour le document
                                              ↓
Frontend Step 3  →  PATCH /:id/step-3    →  Finalise le document
```

## 💡 Avantages

1. **Performance** : Évite les timeouts en fractionnant les envois
2. **Flexibilité** : Possibilité de sauvegarder à chaque étape
3. **UX** : Synchronisation avec le stepper frontend
4. **Résilience** : Récupération facile en cas d'échec partiel

## 🔄 Compatibilité

Les routes existantes sont **conservées** :

- `POST /site-content` : Création complète en une fois
- `PATCH /site-content/:id` : Mise à jour complète
- Toutes les routes de lecture (GET)

## 📝 Prochaines Étapes (Frontend)

### 1. Adapter le formulaire `form-site-content.jsx`

```javascript
const [siteContentId, setSiteContentId] = useState(null);

// Dans handleNext après validation du step 0
if (step === 0) {
  const step1Data = {
    key: data.key,
    type: 'SECTION',
    isActive: data.isActive,
    sortOrder: data.sortOrder,
    quote: data.quote,
    first: data.first,
    secondSection: data.secondSection,
    thirdSection: data.thirdSection,
  };

  const response = await fetch('/api/site-content/step-1', {
    method: 'POST',
    body: JSON.stringify(step1Data),
  });

  const { _id } = await response.json();
  setSiteContentId(_id);
}
```

### 2. Créer les fonctions API

```javascript
// api/site-content.js
export const createStep1 = async (data) => {
  const res = await fetch('/api/site-content/step-1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateStep2 = async (id, data) => {
  const res = await fetch(`/api/site-content/${id}/step-2`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateStep3 = async (id, data) => {
  const res = await fetch(`/api/site-content/${id}/step-3`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
```

### 3. Gérer l'upload d'images

Pour les champs image (imageUrlDesktop, imageUrlMobile, etc.), il faudra :

1. Uploader les fichiers via `StorageService`
2. Récupérer les URLs
3. Les inclure dans les payloads des steps

## 🧪 Test

Utilisez le fichier `test-step-routes.http` avec l'extension REST Client de VS Code pour tester les routes.

## 📦 Fichiers Modifiés/Créés

```
apps/backend/src/modules/site-content/
├── dto/
│   └── step-site-content.dto.ts          (NOUVEAU)
├── schemas/
│   └── site-content.schema.ts            (MODIFIÉ - export ajouté)
├── site-content.controller.ts            (MODIFIÉ - 3 routes ajoutées)
├── site-content.service.ts               (MODIFIÉ - 3 méthodes ajoutées)
├── STEP_ROUTES_GUIDE.md                  (NOUVEAU)
└── test-step-routes.http                 (NOUVEAU)
```

## ✨ Résultat

Le backend est maintenant prêt à recevoir les données du formulaire en 3 étapes distinctes, évitant ainsi la surcharge serveur tout en offrant une expérience utilisateur fluide et progressive.
