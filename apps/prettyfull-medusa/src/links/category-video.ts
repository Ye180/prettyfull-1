// src/links/category-video.ts
import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import CategoryVideoModule from "../modules/category-video"

export default defineLink(
  ProductModule.linkable.productCategory,   // nom exact à vérifier dans la doc Product
  CategoryVideoModule.linkable.productCategoryVideo
)