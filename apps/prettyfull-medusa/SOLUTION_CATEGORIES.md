# Solution : Seeding des Catégories

## 🔍 Problème Identifié

Le loader automatique ne s'exécutait pas au démarrage. J'ai intégré le seeding de catégories directement dans le script principal `seed.ts`.

## ✅ Solution Implémentée

### Modification du fichier `src/scripts/seed.ts`

J'ai ajouté le code de seeding de catégories **avant** le seeding des produits (ligne 358) :

**Structure créée :**
- 6 catégories parentes : WOMEN, PLUS+CURVE, MEN, SPORT, KIDS, BEAUTY
- 37 sous-catégories avec relations parent-enfant

## 🚀 Comment Utiliser

### Option 1 : Seeding Complet (Recommandé)

Cette commande va créer :
- Régions et devises
- Canaux de vente
- Catégories (parentes + enfants)
- Produits de démonstration
- Niveaux d'inventaire

```bash
pnpm run seed
```

### Option 2 : Seeding Manuel des Catégories Uniquement

Si vous voulez juste les catégories sans les produits de démo, vous pouvez :

1. Commenter temporairement la section produits dans `seed.ts`
2. Ou créer un script séparé

## 📋 Vérification

Après avoir exécuté `pnpm run seed`, vérifiez :

1. **Via l'Admin Medusa** :
   ```
   http://localhost:9000/app/categories
   ```

2. **Via l'API** :
   ```bash
   curl http://localhost:9000/admin/product-categories
   ```

3. **Vérifier la hiérarchie** :
   ```bash
   curl 'http://localhost:9000/admin/product-categories?include_descendants_tree=true&parent_category_id=null'
   ```

## 📊 Structure des Catégories

### WOMEN (12 sous-catégories)
- women-new-in
- women-clothing
- women-novadeals
- women-dresses
- women-matching-sets
- women-tops
- women-graphics
- women-jumpsuits-rompers
- women-bottoms
- women-shoes
- women-accessories
- women-swimwear

### MEN (6 sous-catégories)
- men-new-in
- men-clothing
- men-tops
- men-bottoms
- men-shoes
- men-accessories

### SPORT (4 sous-catégories)
- sport-activewear
- sport-tops
- sport-bottoms
- sport-shoes

### KIDS (3 sous-catégories)
- kids-girls
- kids-boys
- kids-baby

### PLUS+CURVE (4 sous-catégories)
- plus-curve-new-in
- plus-curve-dresses
- plus-curve-tops
- plus-curve-bottoms

### BEAUTY (4 sous-catégories)
- beauty-makeup
- beauty-skincare
- beauty-hair-care
- beauty-fragrance

## 🔧 Dépannage

### Si le seeding échoue

1. **Vérifier la base de données** :
   ```bash
   # Assurez-vous que la DB est accessible
   pnpm run migrate
   ```

2. **Nettoyer la base de données** :
   Si vous avez des données existantes qui causent des conflits :
   - Via l'admin : supprimez les catégories existantes
   - Ou réinitialisez la DB complètement

3. **Vérifier les logs** :
   ```bash
   pnpm run seed 2>&1 | tee seed.log
   ```

4. **Exécuter en mode développement** :
   ```bash
   pnpm run dev
   ```
   Puis dans un autre terminal :
   ```bash
   pnpm run seed
   ```

## 📝 Notes Importantes

1. **Pas de duplication automatique** : Le script ne vérifie pas les doublons. Si vous exécutez `pnpm run seed` plusieurs fois, vous aurez des catégories dupliquées.

2. **Ordre d'exécution** : Les catégories parentes sont créées en premier, puis les enfants. Cet ordre est crucial pour les relations parent-enfant.

3. **Produits de démo** : Les 4 produits de démo (T-Shirt, Sweatshirt, Sweatpants, Shorts) sont assignés aux catégories WOMEN et MEN.

## 🎯 Prochaines Étapes

1. Exécutez `pnpm run seed`
2. Vérifiez dans l'admin que les catégories sont créées
3. Commencez à ajouter vos propres produits
4. Assignez les produits aux catégories appropriées

## 💡 Personnalisation

Pour ajouter ou modifier des catégories, éditez le fichier :
```
src/scripts/seed.ts
```

Cherchez la section "Seeding product categories..." (ligne ~358) et modifiez les tableaux `parentCategories` et `childCategories`.
