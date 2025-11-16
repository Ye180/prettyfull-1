# 📊 Architecture des Routes Progressives

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND ADMIN                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│  │   STEP 1     │   │   STEP 2     │   │   STEP 3     │       │
│  │              │   │              │   │              │       │
│  │ • key        │   │ • section 4  │   │ • section 7  │       │
│  │ • quote      │   │ • section 5  │   │ • section 8  │       │
│  │ • section 1  │   │ • section 6  │   │ • section 9  │       │
│  │ • section 2  │   │              │   │ • section 10 │       │
│  │ • section 3  │   │              │   │              │       │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘       │
│         │                  │                  │                │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          │ POST             │ PATCH            │ PATCH
          │ /step-1          │ /:id/step-2      │ /:id/step-3
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SiteContentController                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  @Post('step-1')                                         │  │
│  │  createStep1(dto: CreateStep1Dto)                        │  │
│  │      ↓                                                    │  │
│  │  Retourne: { _id: "...", ...data }                       │  │
│  │                                                           │  │
│  │  @Patch(':id/step-2')                                    │  │
│  │  updateStep2(id, dto: UpdateStep2Dto)                    │  │
│  │      ↓                                                    │  │
│  │  Met à jour les sections 4-6                             │  │
│  │                                                           │  │
│  │  @Patch(':id/step-3')                                    │  │
│  │  updateStep3(id, dto: UpdateStep3Dto)                    │  │
│  │      ↓                                                    │  │
│  │  Finalise les sections 7-10                              │  │
│  │                                                           │  │
│  └───────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SiteContentService                           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  createStep1(dto)                                        │  │
│  │      → new SiteContentModel(dto).save()                  │  │
│  │                                                           │  │
│  │  updateStep2(id, dto)                                    │  │
│  │      → findByIdAndUpdate(id, { $set: {...} })           │  │
│  │                                                           │  │
│  │  updateStep3(id, dto)                                    │  │
│  │      → findByIdAndUpdate(id, { $set: {...} })           │  │
│  │                                                           │  │
│  └───────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   MongoDB    │
                    │              │
                    │ SiteContent  │
                    │  Collection  │
                    └──────────────┘
```

## 📋 Mapping des Données

### Step 1 → CreateStep1Dto

```typescript
{
  key: string,              // Identifiant unique
  type: ContentType,        // SECTION | BANNER | CATEGORY
  isActive?: boolean,       // État actif/inactif
  sortOrder?: number,       // Ordre d'affichage
  quote?: I18nString,       // Citation multilingue
  first?: FirstSection,     // Hero banner
  secondSection?: SecondSection,  // Catégories
  thirdSection?: ThirdSection     // Image bannière
}
```

### Step 2 → UpdateStep2Dto

```typescript
{
  fourthSection?: FourthSection,  // Produits + image
  fiveSection?: FiveSection,      // Catégories/sous-catégories
  sixSection?: SixSection         // Image bannière
}
```

### Step 3 → UpdateStep3Dto

```typescript
{
  sevenSection?: SevenSection,   // Produits + sous-catégorie
  eightSection?: EightSection,   // Image bannière
  nineSection?: NineSection,     // Catégories multiples
  tenSection?: TenSection        // Image finale
}
```

## 🔄 Flux de Données

```
1. Frontend envoie Step 1
   ↓
2. Backend crée document avec _id
   ↓
3. Frontend reçoit _id et l'utilise pour Step 2
   ↓
4. Backend met à jour document avec sections 4-6
   ↓
5. Frontend utilise même _id pour Step 3
   ↓
6. Backend finalise document avec sections 7-10
   ↓
7. Document complet sauvegardé ✅
```

## 💾 Structure MongoDB Finale

```json
{
  "_id": ObjectId("..."),
  "key": "homepage-2025",
  "type": "SECTION",
  "isActive": true,
  "sortOrder": 0,
  "quote": { "fr": "...", "en": "..." },
  "first": { ... },           // ← Step 1
  "secondSection": { ... },   // ← Step 1
  "thirdSection": { ... },    // ← Step 1
  "fourthSection": { ... },   // ← Step 2
  "fiveSection": { ... },     // ← Step 2
  "sixSection": { ... },      // ← Step 2
  "sevenSection": { ... },    // ← Step 3
  "eightSection": { ... },    // ← Step 3
  "nineSection": { ... },     // ← Step 3
  "tenSection": { ... },      // ← Step 3
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## 🎯 Avantages de cette Architecture

| Aspect                     | Avant                 | Après               |
| -------------------------- | --------------------- | ------------------- |
| **Taille des requêtes**    | ~5MB+ en une fois     | ~1-2MB par étape    |
| **Timeout serveur**        | Risque élevé          | Risque minimal      |
| **Expérience utilisateur** | Attente longue        | Feedback progressif |
| **Récupération d'erreur**  | Tout recommencer      | Reprendre à l'étape |
| **Performance**            | Goulot d'étranglement | Flux optimisé       |
