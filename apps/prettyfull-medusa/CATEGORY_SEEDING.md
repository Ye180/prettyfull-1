# Category Seeding Documentation

## Overview

This document explains the automatic category seeding implementation for the Prettyfull Medusa backend. The system automatically populates the database with predefined fashion categories at server startup.

## Architecture

### Components

1. **Seed Script** (`src/scripts/seed-categories.ts`)
   - Contains the category seeding logic
   - Defines parent and child category hierarchies
   - Can be run manually or automatically

2. **Loader** (`src/loaders/seed-categories.ts`)
   - Automatically executes at server startup
   - Calls the seed script with proper error handling
   - Logs seeding progress

3. **NPM Script** (`package.json`)
   - `npm run seed:categories` - Manual execution command

## Category Structure

### Parent Categories

The system creates the following top-level categories:

- **WOMEN** - Women's fashion collection
- **PLUS+CURVE** - Plus size and curve fashion
- **MEN** - Men's fashion collection
- **SPORT** - Sportswear and athletic clothing
- **KIDS** - Kids fashion collection
- **BEAUTY** - Beauty products and accessories

### Child Categories

Each parent category has associated subcategories:

#### WOMEN
- New In
- Clothing
- NovaDEALS
- Dresses
- Matching Sets
- Tops
- Graphics
- Jumpsuits & Rompers
- Bottoms
- Shoes
- Accessories
- Swimwear

#### MEN
- New In
- Clothing
- Tops
- Bottoms
- Shoes
- Accessories

#### SPORT
- Activewear
- Sports Tops
- Sports Bottoms
- Sports Shoes

#### KIDS
- Girls
- Boys
- Baby

#### PLUS+CURVE
- New In
- Dresses
- Tops
- Bottoms

#### BEAUTY
- Makeup
- Skincare
- Hair Care
- Fragrance

## How It Works

### Automatic Seeding (Server Startup)

1. When the Medusa server starts, the loader (`src/loaders/seed-categories.ts`) is automatically executed
2. The loader calls the seed script with the container
3. The seed script checks if categories already exist
4. If no categories exist, it creates:
   - First, all parent categories
   - Then, all child categories with proper parent relationships
5. Duplicate prevention: If categories already exist, seeding is skipped

### Manual Seeding

You can manually trigger category seeding using:

```bash
npm run seed:categories
```

Or using the Medusa CLI:

```bash
npx medusa exec ./src/scripts/seed-categories.ts
```

## Features

### Duplicate Prevention

The seed script checks for existing categories before creating new ones:

```typescript
const existingCategories = await productCategoryModuleService.listProductCategories();

if (existingCategories.length > 0) {
  logger.info(`Found ${existingCategories.length} existing categories. Skipping seeding to avoid duplicates.`);
  return;
}
```

### Hierarchical Structure

Categories are created in two phases:

1. **Parent Categories**: Created first to obtain their IDs
2. **Child Categories**: Created with `parent_category_id` references

### Error Handling

The loader includes try-catch error handling to prevent server startup failures:

```typescript
try {
  await seedCategories({ container, args: [] });
} catch (error) {
  logger.error("Error during category seeding:", error);
}
```

## Database Schema

Each category includes:

- `name`: Display name
- `handle`: URL-friendly identifier (slug)
- `is_active`: Whether the category is active (true)
- `is_internal`: Whether it's internal only (false)
- `parent_category_id`: Reference to parent category (for child categories)
- `description`: Category description

## Customization

### Adding New Categories

To add new categories, edit `src/scripts/seed-categories.ts`:

1. **Add Parent Category**:
```typescript
const parentCategories: CategoryData[] = [
  // ... existing categories
  {
    name: "NEW_CATEGORY",
    handle: "new-category",
    is_active: true,
    is_internal: false,
    description: "Description here",
  },
];
```

2. **Add Child Categories**:
```typescript
const newCategory = createdParentCategories.find(
  (cat) => cat.handle === "new-category"
);

if (newCategory) {
  childCategories.push({
    name: "Subcategory Name",
    handle: "new-category-subcategory",
    is_active: true,
    is_internal: false,
    parent_category_id: newCategory.id,
    description: "Subcategory description",
  });
}
```

### Modifying Existing Categories

Edit the category definitions in `src/scripts/seed-categories.ts` and re-run the seed script. Note that you may need to clear existing categories first.

### Disabling Automatic Seeding

To disable automatic seeding at startup, delete or rename the loader file:

```bash
rm src/loaders/seed-categories.ts
```

Or move it to a different location outside the `loaders` directory.

## Workflow Integration

### Development Workflow

1. **Initial Setup**: Categories are automatically seeded on first server start
2. **Database Reset**: Run `npm run seed:categories` after database migrations
3. **Testing**: Categories are available immediately for product assignment

### Production Deployment

1. Run database migrations: `npm run migrate`
2. Start the server: `npm start`
3. Categories are automatically seeded if database is empty
4. Verify in admin panel: `/app/categories`

## Troubleshooting

### Categories Not Created

**Check logs**: Look for seeding messages in server logs
```
Running category seed loader...
Starting category seeding...
Created X parent categories.
Created Y child categories.
```

**Verify database connection**: Ensure `DATABASE_URL` is correctly configured in `.env`

### Duplicate Categories

The script prevents duplicates automatically. If you need to re-seed:

1. Delete existing categories via admin panel or database
2. Restart server or run `npm run seed:categories`

### Loader Not Executing

**Verify file location**: Loader must be in `src/loaders/` directory

**Check file naming**: File should end with `.ts` extension

**Review logs**: Check for loader execution errors in startup logs

## Best Practices

1. **Version Control**: Keep category definitions in version control
2. **Documentation**: Update this file when adding new categories
3. **Testing**: Test category seeding in development before production
4. **Backup**: Backup database before re-seeding in production
5. **Idempotency**: The script is idempotent - safe to run multiple times

## API Usage

After seeding, categories are available via Medusa's Product Category API:

### List Categories
```bash
GET /admin/product-categories
```

### Get Category with Children
```bash
GET /admin/product-categories/:id?fields=*category_children
```

### Assign Product to Category
```typescript
await createProductsWorkflow(container).run({
  input: {
    products: [{
      title: "Product Name",
      category_ids: [categoryId],
      // ... other fields
    }]
  }
});
```

## Related Files

- `src/scripts/seed-categories.ts` - Main seeding logic
- `src/loaders/seed-categories.ts` - Automatic loader
- `package.json` - NPM scripts configuration
- `src/scripts/seed.ts` - Main data seeding script (products, regions, etc.)

## Support

For issues or questions:
1. Check Medusa documentation: https://docs.medusajs.com
2. Review server logs for error messages
3. Verify database connectivity and permissions
