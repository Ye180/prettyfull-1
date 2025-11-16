# Guide des Routes Progressives SiteContent

## 📖 Vue d'ensemble

Le module SiteContent propose désormais **3 routes progressives** pour créer du contenu en plusieurs étapes, évitant ainsi de surcharger le serveur avec un envoi massif de données (images incluses).

## 🚀 Workflow de création

### Étape 1 : Créer le document de base

**Route :** `POST /site-content/step-1`

**Données envoyées :**

- `key` : Identifiant unique (obligatoire)
- `type` : Type de contenu (enum: `SECTION`, `BANNER`, `CATEGORY`)
- `isActive` : État actif/inactif (optionnel, défaut: `true`)
- `sortOrder` : Ordre d'affichage (optionnel, défaut: `0`)
- `quote` : Citation i18n (fr/en)
- `first` : Première section (hero banner)
- `secondSection` : Deuxième section (catégories)
- `thirdSection` : Troisième section (image bannière)

**Réponse :**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "key": "homepage-2025",
  "type": "SECTION",
  "isActive": true,
  "sortOrder": 0,
  "quote": { "fr": "Citation", "en": "Quote" },
  "first": { ... },
  "secondSection": { ... },
  "thirdSection": { ... },
  "createdAt": "2025-11-12T10:00:00.000Z",
  "updatedAt": "2025-11-12T10:00:00.000Z"
}
```

**⚠️ Important :** Conservez l'`_id` retourné pour les étapes suivantes !

---

### Étape 2 : Ajouter les sections 4, 5 et 6

**Route :** `PATCH /site-content/:id/step-2`

**Paramètre URL :** `:id` = l'ID retourné à l'étape 1

**Données envoyées :**

- `fourthSection` : Section produits avec liste
- `fiveSection` : Section catégories/sous-catégories
- `sixSection` : Section image bannière

**Réponse :**
Le document complet mis à jour avec les nouvelles sections.

---

### Étape 3 : Finaliser avec les sections 7, 8, 9 et 10

**Route :** `PATCH /site-content/:id/step-3`

**Paramètre URL :** `:id` = l'ID retourné à l'étape 1

**Données envoyées :**

- `sevenSection` : Section produits + sous-catégorie
- `eightSection` : Section image bannière
- `nineSection` : Section catégories multiples
- `tenSection` : Section image finale

**Réponse :**
Le document complet et finalisé avec toutes les sections.

---

## 💡 Exemple d'utilisation Frontend

```javascript
// Étape 1
const step1Data = {
  key: "homepage-2025",
  type: "SECTION",
  isActive: true,
  sortOrder: 0,
  quote: { fr: "Bienvenue", en: "Welcome" },
  first: { ... },
  secondSection: { ... },
  thirdSection: { ... }
};

const response1 = await fetch('/api/site-content/step-1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(step1Data)
});

const { _id } = await response1.json();

// Étape 2
const step2Data = {
  fourthSection: { ... },
  fiveSection: { ... },
  sixSection: { ... }
};

await fetch(`/api/site-content/${_id}/step-2`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(step2Data)
});

// Étape 3
const step3Data = {
  sevenSection: { ... },
  eightSection: { ... },
  nineSection: { ... },
  tenSection: { ... }
};

await fetch(`/api/site-content/${_id}/step-3`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(step3Data)
});
```

## 🎯 Avantages

1. **Performance** : Envoi progressif des données, pas de timeout serveur
2. **UX** : L'utilisateur voit la progression avec le stepper
3. **Flexibilité** : Possibilité de sauvegarder partiellement et reprendre plus tard
4. **Résilience** : Si une étape échoue, pas besoin de tout recommencer

## 🔄 Routes existantes conservées

Les routes classiques restent disponibles :

- `POST /site-content` : Création complète en une seule fois
- `PATCH /site-content/:id` : Mise à jour complète
- `GET /site-content` : Liste tous les contenus
- `GET /site-content/:id` : Récupère un contenu par ID
- `GET /site-content/key/:key` : Récupère un contenu par clé
- `DELETE /site-content/:id` : Supprime un contenu

## 📋 Structure des DTOs

### CreateStep1Dto

- Champs obligatoires : `key`, `type`
- Champs optionnels : `isActive`, `sortOrder`, `quote`, `first`, `secondSection`, `thirdSection`

### UpdateStep2Dto

- Tous les champs optionnels : `fourthSection`, `fiveSection`, `sixSection`

### UpdateStep3Dto

- Tous les champs optionnels : `sevenSection`, `eightSection`, `nineSection`, `tenSection`

## 🔒 Validation

Chaque DTO utilise `class-validator` pour garantir l'intégrité des données :

- Validation des types (string, number, boolean, enum)
- Validation des structures imbriquées (`@ValidateNested`)
- Transformation automatique avec `class-transformer`

## 🛠️ Gestion des erreurs

- **404 Not Found** : Si l'ID fourni aux étapes 2 ou 3 n'existe pas
- **400 Bad Request** : Si les données ne respectent pas la validation
- **500 Internal Server Error** : Erreur base de données ou serveur
