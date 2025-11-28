import { container } from "@medusajs/framework";

const seedCategories = async () => {
  console.log("Starting category seeding...");

  try {
    const categoryService = container.resolve("categoryService") as any;
    console.log("Category service resolved successfully.");

    try {
      // Check if "women" category exists
      const womenCategory = await categoryService.retrieveByHandle("women");

      if (!womenCategory) {
        console.log("Category 'women' does not exist. Creating...");
        const newCategory = await categoryService.create({
          name: "Women",
          handle: "women",
        });

        console.log(`Created category 'women' with ID: ${newCategory.id}`);
      }

      // Add subcategories to "women"
      const subcategories = [
        { name: "Dresses", handle: "dresses" },
        { name: "Tops", handle: "tops" },
        { name: "Bottoms", handle: "bottoms" },
        { name: "Shoes", handle: "shoes" },
      ];

      for (const subcategory of subcategories) {
        const existingSubcategory = await categoryService.retrieveByHandle(
          subcategory.handle
        );

        if (!existingSubcategory) {
          await categoryService.create({
            name: subcategory.name,
            handle: subcategory.handle,
            parent_id: womenCategory.id,
          });
          console.log(`Created subcategory '${subcategory.name}' under 'women'.`);
        } else {
          console.log(`Subcategory '${subcategory.name}' already exists.`);
        }
      }
    } catch (error) {
      console.error("Error seeding categories:", error);
    }
  } catch (error) {
    console.error("Error resolving category service or seeding categories:", error);
  }
};

seedCategories();