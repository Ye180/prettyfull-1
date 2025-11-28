import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"

createProductCategoriesWorkflow.hooks.categoriesCreated(
  async ({ categories, additional_data }, { container }) => {
    // Ton code custom ici (log, sync CMS, etc.)
  }
)