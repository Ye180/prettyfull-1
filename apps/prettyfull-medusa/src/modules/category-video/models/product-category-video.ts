// src/modules/category-media/models/product-category-video.ts
import { model } from "@medusajs/framework/utils"

const ProductCategoryVideo = model.define("product_category_video", {
  id: model.id().primaryKey(),
  url: model.text(),
  file_id: model.text(),
  category_id: model.text(),
})

export default ProductCategoryVideo