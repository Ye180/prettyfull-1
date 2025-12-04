// src/modules/category-media/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import ProductCategoryVideo from "./models/product-category-video"

class CategoryVideoModuleService extends MedusaService({
  ProductCategoryVideo,
}) {}

export default CategoryVideoModuleService