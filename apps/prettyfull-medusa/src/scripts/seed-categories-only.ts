import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows";

interface CategoryDef {
  name: string;
  handle: string;
  is_active: boolean;
  is_internal: boolean;
  parent_category_id?: string;
  description?: string;
}

export default async function seedCategoriesOnly({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve(Modules.PRODUCT);

  logger.info("Starting category seeding...");

  // Fetch all existing categories to avoid duplicates
  const existingCategories =
    await productService.listProductCategories(
      {},
      { select: ["id", "handle", "name"] }
    );

  const existingHandles = new Set(existingCategories.map((c) => c.handle));
  logger.info(`Found ${existingCategories.length} existing categories.`);

  // --- Parent categories ---
  const parentDefs: CategoryDef[] = [
    { name: "WOMEN", handle: "women", is_active: true, is_internal: false, description: "Women's fashion collection" },
    { name: "PLUS+CURVE", handle: "plus-curve", is_active: true, is_internal: false, description: "Plus size and curve fashion" },
    { name: "MEN", handle: "men", is_active: true, is_internal: false, description: "Men's fashion collection" },
    { name: "SPORT", handle: "sport", is_active: true, is_internal: false, description: "Sportswear and athletic clothing" },
    { name: "KIDS", handle: "kids", is_active: true, is_internal: false, description: "Kids fashion collection" },
    { name: "BEAUTY", handle: "beauty", is_active: true, is_internal: false, description: "Beauty products and accessories" },
  ];

  const parentsToCreate = parentDefs.filter((p) => !existingHandles.has(p.handle));

  let allParents: { id: string; handle: string; name: string }[] = [
    ...existingCategories.filter((c) =>
      parentDefs.some((p) => p.handle === c.handle)
    ),
  ];

  if (parentsToCreate.length > 0) {
    logger.info(`Creating ${parentsToCreate.length} new parent categories...`);
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: parentsToCreate },
    });
    allParents = [
      ...allParents,
      ...result.map((r) => ({ id: r.id, handle: r.handle!, name: r.name })),
    ];
    logger.info(`Created ${result.length} parent categories.`);
  } else {
    logger.info("All parent categories already exist. Skipping.");
  }

  // Helper to find parent id by handle
  const parentId = (handle: string) =>
    allParents.find((p) => p.handle === handle)?.id;

  // --- Child categories ---
  const childDefs: CategoryDef[] = [
    // WOMEN children
    { name: "New In", handle: "women-new-in", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Latest arrivals for women" },
    { name: "Clothing", handle: "women-clothing", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Women's clothing collection" },
    { name: "NovaDEALS", handle: "women-novadeals", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Special deals for women" },
    { name: "Dresses", handle: "women-dresses", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Women's dresses collection" },
    { name: "Matching Sets", handle: "women-matching-sets", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Coordinated matching sets" },
    { name: "Tops", handle: "women-tops", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Women's tops collection" },
    { name: "Graphics", handle: "women-graphics", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Graphic tees and printed clothing" },
    { name: "Jumpsuits & Rompers", handle: "women-jumpsuits-rompers", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Jumpsuits and rompers collection" },
    { name: "Bottoms", handle: "women-bottoms", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Women's bottoms: pants, skirts, shorts" },
    { name: "Shoes", handle: "women-shoes", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Women's footwear collection" },
    { name: "Accessories", handle: "women-accessories", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Women's accessories" },
    { name: "Swimwear", handle: "women-swimwear", is_active: true, is_internal: false, parent_category_id: parentId("women"), description: "Swimwear and beachwear" },
    // MEN children
    { name: "New In", handle: "men-new-in", is_active: true, is_internal: false, parent_category_id: parentId("men"), description: "Latest arrivals for men" },
    { name: "Clothing", handle: "men-clothing", is_active: true, is_internal: false, parent_category_id: parentId("men"), description: "Men's clothing collection" },
    { name: "Tops", handle: "men-tops", is_active: true, is_internal: false, parent_category_id: parentId("men"), description: "Men's tops collection" },
    { name: "Bottoms", handle: "men-bottoms", is_active: true, is_internal: false, parent_category_id: parentId("men"), description: "Men's bottoms: pants, jeans, shorts" },
    { name: "Shoes", handle: "men-shoes", is_active: true, is_internal: false, parent_category_id: parentId("men"), description: "Men's footwear collection" },
    { name: "Accessories", handle: "men-accessories", is_active: true, is_internal: false, parent_category_id: parentId("men"), description: "Men's accessories" },
    // SPORT children
    { name: "Activewear", handle: "sport-activewear", is_active: true, is_internal: false, parent_category_id: parentId("sport"), description: "Athletic and workout clothing" },
    { name: "Sports Tops", handle: "sport-tops", is_active: true, is_internal: false, parent_category_id: parentId("sport"), description: "Sports tops and t-shirts" },
    { name: "Sports Bottoms", handle: "sport-bottoms", is_active: true, is_internal: false, parent_category_id: parentId("sport"), description: "Sports pants and leggings" },
    { name: "Sports Shoes", handle: "sport-shoes", is_active: true, is_internal: false, parent_category_id: parentId("sport"), description: "Athletic footwear" },
    // KIDS children
    { name: "Girls", handle: "kids-girls", is_active: true, is_internal: false, parent_category_id: parentId("kids"), description: "Girls clothing collection" },
    { name: "Boys", handle: "kids-boys", is_active: true, is_internal: false, parent_category_id: parentId("kids"), description: "Boys clothing collection" },
    { name: "Baby", handle: "kids-baby", is_active: true, is_internal: false, parent_category_id: parentId("kids"), description: "Baby clothing and essentials" },
    // PLUS+CURVE children
    { name: "New In", handle: "plus-curve-new-in", is_active: true, is_internal: false, parent_category_id: parentId("plus-curve"), description: "Latest arrivals in plus sizes" },
    { name: "Dresses", handle: "plus-curve-dresses", is_active: true, is_internal: false, parent_category_id: parentId("plus-curve"), description: "Plus size dresses" },
    { name: "Tops", handle: "plus-curve-tops", is_active: true, is_internal: false, parent_category_id: parentId("plus-curve"), description: "Plus size tops" },
    { name: "Bottoms", handle: "plus-curve-bottoms", is_active: true, is_internal: false, parent_category_id: parentId("plus-curve"), description: "Plus size bottoms" },
    // BEAUTY children
    { name: "Makeup", handle: "beauty-makeup", is_active: true, is_internal: false, parent_category_id: parentId("beauty"), description: "Makeup products" },
    { name: "Skincare", handle: "beauty-skincare", is_active: true, is_internal: false, parent_category_id: parentId("beauty"), description: "Skincare products" },
    { name: "Hair Care", handle: "beauty-hair-care", is_active: true, is_internal: false, parent_category_id: parentId("beauty"), description: "Hair care products" },
    { name: "Fragrance", handle: "beauty-fragrance", is_active: true, is_internal: false, parent_category_id: parentId("beauty"), description: "Perfumes and fragrances" },
  ];

  // Filter out children whose parent doesn't exist or that already exist
  const childrenToCreate = childDefs.filter(
    (c) => c.parent_category_id && !existingHandles.has(c.handle)
  );

  if (childrenToCreate.length > 0) {
    logger.info(`Creating ${childrenToCreate.length} new child categories...`);
    const { result: childResult } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: { product_categories: childrenToCreate },
    });
    logger.info(`Created ${childResult.length} child categories.`);
  } else {
    logger.info("All child categories already exist. Skipping.");
  }

  const totalCreated = parentsToCreate.length + childrenToCreate.length;
  logger.info(
    `Category seeding completed! Created ${totalCreated} new categories (${parentsToCreate.length} parents + ${childrenToCreate.length} children).`
  );
}
