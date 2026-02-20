# Guide Complet : Seeding des Catégories

## 🔍 Problème Identifié

Le script `pnpm run seed` échoue car vous avez **déjà des données** dans votre base de données (régions, pays, etc.). Le script essaie de créer des régions avec des pays déjà assignés, ce qui cause l'erreur :

```
Countries with codes: "dk, fr, it" are already assigned to a region
```

## ✅ Solutions Disponibles

### Solution 1 : Utiliser l'Admin Medusa (RECOMMANDÉ)

C'est la méthode la plus simple et la plus sûre.

#### Étapes :

1. **Démarrez le serveur** (si pas déjà démarré) :
   ```bash
   pnpm run dev
   ```

2. **Accédez à l'admin** :
   ```
   http://localhost:9000/app
   ```

3. **Créez les catégories manuellement** :
   - Allez dans **Products → Categories**
   - Cliquez sur **Create Category**
   - Créez les 6 catégories parentes :

   **Catégorie 1 : WOMEN**
   - Name: `WOMEN`
   - Handle: `women`
   - Description: `Women's fashion collection`
   - Active: ✓

   **Catégorie 2 : PLUS+CURVE**
   - Name: `PLUS+CURVE`
   - Handle: `plus-curve`
   - Description: `Plus size and curve fashion`
   - Active: ✓

   **Catégorie 3 : MEN**
   - Name: `MEN`
   - Handle: `men`
   - Description: `Men's fashion collection`
   - Active: ✓

   **Catégorie 4 : SPORT**
   - Name: `SPORT`
   - Handle: `sport`
   - Description: `Sportswear and athletic clothing`
   - Active: ✓

   **Catégorie 5 : KIDS**
   - Name: `KIDS`
   - Handle: `kids`
   - Description: `Kids fashion collection`
   - Active: ✓

   **Catégorie 6 : BEAUTY**
   - Name: `BEAUTY`
   - Handle: `beauty`
   - Description: `Beauty products and accessories`
   - Active: ✓

4. **Créez les sous-catégories** :
   Pour chaque catégorie parente, créez les sous-catégories en sélectionnant la catégorie parente dans le champ "Parent Category".

   **Pour WOMEN (12 sous-catégories)** :
   - New In (`women-new-in`)
   - Clothing (`women-clothing`)
   - NovaDEALS (`women-novadeals`)
   - Dresses (`women-dresses`)
   - Matching Sets (`women-matching-sets`)
   - Tops (`women-tops`)
   - Graphics (`women-graphics`)
   - Jumpsuits & Rompers (`women-jumpsuits-rompers`)
   - Bottoms (`women-bottoms`)
   - Shoes (`women-shoes`)
   - Accessories (`women-accessories`)
   - Swimwear (`women-swimwear`)

   **Pour MEN (6 sous-catégories)** :
   - New In (`men-new-in`)
   - Clothing (`men-clothing`)
   - Tops (`men-tops`)
   - Bottoms (`men-bottoms`)
   - Shoes (`men-shoes`)
   - Accessories (`men-accessories`)

   **Pour SPORT (4 sous-catégories)** :
   - Activewear (`sport-activewear`)
   - Sports Tops (`sport-tops`)
   - Sports Bottoms (`sport-bottoms`)
   - Sports Shoes (`sport-shoes`)

   **Pour KIDS (3 sous-catégories)** :
   - Girls (`kids-girls`)
   - Boys (`kids-boys`)
   - Baby (`kids-baby`)

   **Pour PLUS+CURVE (4 sous-catégories)** :
   - New In (`plus-curve-new-in`)
   - Dresses (`plus-curve-dresses`)
   - Tops (`plus-curve-tops`)
   - Bottoms (`plus-curve-bottoms`)

   **Pour BEAUTY (4 sous-catégories)** :
   - Makeup (`beauty-makeup`)
   - Skincare (`beauty-skincare`)
   - Hair Care (`beauty-hair-care`)
   - Fragrance (`beauty-fragrance`)

### Solution 2 : Utiliser l'API Directement

Si vous préférez utiliser l'API, voici un exemple avec curl :

```bash
# 1. Créer une catégorie parente
curl -X POST http://localhost:9000/admin/product-categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "WOMEN",
    "handle": "women",
    "is_active": true,
    "is_internal": false,
    "description": "Women'\''s fashion collection"
  }'

# 2. Créer une sous-catégorie (remplacez PARENT_ID par l'ID de la catégorie parente)
curl -X POST http://localhost:9000/admin/product-categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dresses",
    "handle": "women-dresses",
    "is_active": true,
    "is_internal": false,
    "parent_category_id": "PARENT_ID",
    "description": "Women'\''s dresses collection"
  }'
```

### Solution 3 : Réinitialiser la Base de Données (ATTENTION)

⚠️ **CETTE OPTION SUPPRIMERA TOUTES VOS DONNÉES !**

Si vous voulez repartir de zéro :

```bash
# 1. Arrêtez le serveur
# Ctrl+C dans le terminal où tourne le serveur

# 2. Supprimez et recréez la base de données
# (Adaptez selon votre configuration PostgreSQL)
psql -U votre_user -c "DROP DATABASE prettyfull;"
psql -U votre_user -c "CREATE DATABASE prettyfull;"

# 3. Exécutez les migrations
pnpm run migrate

# 4. Exécutez le seeding complet
pnpm run seed
```

## 📊 Structure Complète des Catégories

### Résumé
- **6 catégories parentes**
- **37 sous-catégories**
- **43 catégories au total**

### Hiérarchie Complète

```
WOMEN (women)
├── New In (women-new-in)
├── Clothing (women-clothing)
├── NovaDEALS (women-novadeals)
├── Dresses (women-dresses)
├── Matching Sets (women-matching-sets)
├── Tops (women-tops)
├── Graphics (women-graphics)
├── Jumpsuits & Rompers (women-jumpsuits-rompers)
├── Bottoms (women-bottoms)
├── Shoes (women-shoes)
├── Accessories (women-accessories)
└── Swimwear (women-swimwear)

PLUS+CURVE (plus-curve)
├── New In (plus-curve-new-in)
├── Dresses (plus-curve-dresses)
├── Tops (plus-curve-tops)
└── Bottoms (plus-curve-bottoms)

MEN (men)
├── New In (men-new-in)
├── Clothing (men-clothing)
├── Tops (men-tops)
├── Bottoms (men-bottoms)
├── Shoes (men-shoes)
└── Accessories (men-accessories)

SPORT (sport)
├── Activewear (sport-activewear)
├── Sports Tops (sport-tops)
├── Sports Bottoms (sport-bottoms)
└── Sports Shoes (sport-shoes)

KIDS (kids)
├── Girls (kids-girls)
├── Boys (kids-boys)
└── Baby (kids-baby)

BEAUTY (beauty)
├── Makeup (beauty-makeup)
├── Skincare (beauty-skincare)
├── Hair Care (beauty-hair-care)
└── Fragrance (beauty-fragrance)
```

## 🔧 Fichiers Créés/Modifiés

1. **`src/scripts/seed.ts`** - Script principal avec seeding de catégories intégré
2. **`src/scripts/seed-categories-only.ts`** - Script dédié uniquement aux catégories
3. **`package.json`** - Commande `seed:categories` ajoutée

## 💡 Recommandation

**Je recommande la Solution 1 (Admin Medusa)** car :
- ✅ Pas de risque de conflit avec les données existantes
- ✅ Interface visuelle simple
- ✅ Contrôle total sur chaque catégorie
- ✅ Pas besoin de réinitialiser la base de données

Une fois les catégories créées manuellement, elles seront disponibles pour tous vos produits et votre frontend.

## 📝 Vérification

Après avoir créé les catégories, vérifiez :

1. **Dans l'admin** : `http://localhost:9000/app/categories`
2. **Via l'API** : 
   ```bash
   curl http://localhost:9000/admin/product-categories?include_descendants_tree=true
   ```

## ❓ Questions Fréquentes

**Q : Pourquoi le script de seeding échoue ?**
R : Parce que vous avez déjà des données (régions, pays) dans votre base de données. Le script essaie de créer des doublons.

**Q : Puis-je utiliser le script après avoir créé les catégories manuellement ?**
R : Oui, mais il faut d'abord supprimer les catégories existantes ou le script créera des doublons.

**Q : Les catégories seront-elles conservées après un redémarrage ?**
R : Oui, elles sont stockées dans la base de données PostgreSQL.

**Q : Comment supprimer toutes les catégories ?**
R : Via l'admin, sélectionnez toutes les catégories et supprimez-les, ou utilisez l'API.
