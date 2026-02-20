# Guide d'Implémentation du Seeding de Catégories

## 📋 Vue d'ensemble

J'ai implémenté un système complet de seeding automatique de catégories pour votre backend Medusa. Le système crée automatiquement une hiérarchie de catégories (parents et enfants) au démarrage du serveur.

## 🎯 Catégories Créées

### Catégories Parentes (6)
1. **WOMEN** - Collection mode femme
2. **PLUS+CURVE** - Mode grande taille
3. **MEN** - Collection mode homme
4. **SPORT** - Vêtements de sport
5. **KIDS** - Mode enfants
6. **BEAUTY** - Produits de beauté

### Catégories Enfants (Total: 37)

**WOMEN (12 sous-catégories)**
- New In, Clothing, NovaDEALS, Dresses, Matching Sets, Tops, Graphics, Jumpsuits & Rompers, Bottoms, Shoes, Accessories, Swimwear

**MEN (6 sous-catégories)**
- New In, Clothing, Tops, Bottoms, Shoes, Accessories

**SPORT (4 sous-catégories)**
- Activewear, Sports Tops, Sports Bottoms, Sports Shoes

**KIDS (3 sous-catégories)**
- Girls, Boys, Baby

**PLUS+CURVE (4 sous-catégories)**
- New In, Dresses, Tops, Bottoms

**BEAUTY (4 sous-catégories)**
- Makeup, Skincare, Hair Care, Fragrance

## 📁 Fichiers Créés

1. **`src/scripts/seed-categories.ts`**
   - Script principal de seeding
   - Contient toute la logique de création des catégories
   - Peut être exécuté manuellement

2. **`src/loaders/seed-categories.ts`**
   - Loader automatique
   - S'exécute au démarrage du serveur
   - Gère les erreurs gracieusement

3. **`package.json`** (modifié)
   - Ajout de la commande `seed:categories`

## 🚀 Utilisation

### Méthode 1: Automatique (Recommandé)

Le seeding s'exécute **automatiquement** au démarrage du serveur:

```bash
npm run dev
# ou
npm start
```

Le loader vérifie si des catégories existent déjà. Si oui, il saute le seeding pour éviter les doublons.

### Méthode 2: Manuelle

Pour exécuter le seeding manuellement:

```bash
npm run seed:categories
```

## 🔧 Fonctionnalités Clés

### ✅ Prévention des Doublons

Le script vérifie automatiquement l'existence de catégories:

```typescript
const existingCategories = await productCategoryModuleService.listProductCategories();

if (existingCategories.length > 0) {
  logger.info("Catégories existantes trouvées. Seeding ignoré.");
  return;
}
```

### 🌳 Structure Hiérarchique

- **Phase 1**: Création des catégories parentes
- **Phase 2**: Création des catégories enfants avec références `parent_category_id`

### 🛡️ Gestion d'Erreurs

Le loader inclut une gestion d'erreurs complète pour ne pas bloquer le démarrage du serveur.

### 📝 Logging Détaillé

Tous les événements sont loggés:
- Début du seeding
- Nombre de catégories créées
- Erreurs éventuelles
- Fin du processus

## 🔍 Vérification

### Via l'Admin Medusa

1. Démarrez le serveur: `npm run dev`
2. Accédez à l'admin: `http://localhost:9000/app`
3. Naviguez vers **Products → Categories**
4. Vous devriez voir toutes les catégories créées

### Via l'API

```bash
# Liste toutes les catégories
curl http://localhost:9000/admin/product-categories

# Obtenir une catégorie avec ses enfants
curl http://localhost:9000/admin/product-categories/{id}?fields=*category_children
```

## 🎨 Personnalisation

### Ajouter de Nouvelles Catégories

Éditez `src/scripts/seed-categories.ts`:

```typescript
// Ajouter une catégorie parente
const parentCategories: CategoryData[] = [
  // ... catégories existantes
  {
    name: "NOUVELLE_CATEGORIE",
    handle: "nouvelle-categorie",
    is_active: true,
    is_internal: false,
    description: "Description ici",
  },
];

// Ajouter des sous-catégories
if (nouvelleCategorieParent) {
  childCategories.push({
    name: "Sous-catégorie",
    handle: "nouvelle-categorie-sous",
    is_active: true,
    is_internal: false,
    parent_category_id: nouvelleCategorieParent.id,
    description: "Description",
  });
}
```

### Modifier des Catégories Existantes

1. Éditez les définitions dans `src/scripts/seed-categories.ts`
2. Supprimez les catégories existantes via l'admin ou la base de données
3. Relancez le seeding: `npm run seed:categories`

### Désactiver le Seeding Automatique

Si vous ne voulez pas que le seeding s'exécute automatiquement:

```bash
# Renommer ou supprimer le loader
mv src/loaders/seed-categories.ts src/loaders/seed-categories.ts.disabled
```

## 🔄 Workflow de Développement

### Première Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/prettyfull

# 3. Exécuter les migrations
npm run migrate

# 4. Démarrer le serveur (seeding automatique)
npm run dev
```

### Réinitialisation de la Base de Données

```bash
# 1. Supprimer et recréer la base de données
# 2. Exécuter les migrations
npm run migrate

# 3. Seeding complet (produits + catégories)
npm run seed

# Ou seulement les catégories
npm run seed:categories
```

## 🐛 Dépannage

### Les Catégories ne sont pas Créées

**Vérifiez les logs du serveur:**
```bash
npm run dev
# Cherchez les messages:
# "Running category seed loader..."
# "Starting category seeding..."
# "Created X parent categories."
```

**Vérifiez la connexion à la base de données:**
- Assurez-vous que `DATABASE_URL` est correctement configuré dans `.env`
- Testez la connexion: `npm run migrate`

### Erreur de Type TypeScript

Si vous voyez des erreurs TypeScript, vérifiez que:
- Toutes les dépendances sont installées: `npm install`
- Le build est à jour: `npm run build`

### Le Loader ne s'Exécute pas

**Vérifiez l'emplacement du fichier:**
- Le loader doit être dans `src/loaders/`
- Le nom doit se terminer par `.ts`

**Vérifiez les logs de démarrage:**
```bash
npm run dev 2>&1 | grep -i "category"
```

## 📊 Structure de Données

Chaque catégorie contient:

```typescript
{
  name: string;           // Nom d'affichage
  handle: string;         // Identifiant URL (slug)
  is_active: boolean;     // Catégorie active
  is_internal: boolean;   // Usage interne uniquement
  parent_category_id?: string;  // ID de la catégorie parente
  description?: string;   // Description
}
```

## 🔗 Utilisation avec les Produits

### Assigner un Produit à une Catégorie

```typescript
await createProductsWorkflow(container).run({
  input: {
    products: [{
      title: "Robe d'été",
      category_ids: [categoryId],  // ID de la catégorie
      // ... autres champs
    }]
  }
});
```

### Exemple dans seed.ts

```typescript
const womenDressesCategory = categoryResult.find(
  (cat) => cat.handle === "women-dresses"
);

await createProductsWorkflow(container).run({
  input: {
    products: [{
      title: "Robe élégante",
      category_ids: [womenDressesCategory.id],
      // ...
    }]
  }
});
```

## 📚 Ressources

- **Documentation Medusa**: https://docs.medusajs.com
- **Custom CLI Scripts**: https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts/seed-data
- **Product Categories**: https://docs.medusajs.com/resources/commerce-modules/product/product-categories
- **Loaders**: https://docs.medusajs.com/learn/fundamentals/modules/loaders

## ✅ Checklist de Déploiement

Avant de déployer en production:

- [ ] Tester le seeding en développement
- [ ] Vérifier que toutes les catégories sont créées correctement
- [ ] Tester l'assignation de produits aux catégories
- [ ] Vérifier les logs pour les erreurs
- [ ] Sauvegarder la base de données avant le déploiement
- [ ] Tester le seeding sur une base de données de staging
- [ ] Documenter les catégories personnalisées ajoutées

## 🎉 Résumé

Vous disposez maintenant d'un système complet de seeding de catégories qui:

✅ S'exécute automatiquement au démarrage du serveur
✅ Crée 6 catégories parentes et 37 sous-catégories
✅ Évite les doublons automatiquement
✅ Gère les erreurs gracieusement
✅ Peut être exécuté manuellement si nécessaire
✅ Est entièrement personnalisable
✅ Suit les meilleures pratiques Medusa

**Commandes principales:**
```bash
npm run dev              # Démarrage avec seeding automatique
npm run seed:categories  # Seeding manuel des catégories
npm run seed            # Seeding complet (produits + catégories)
```
