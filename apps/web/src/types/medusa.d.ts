import "@medusajs/types"

export interface ProductCategoryImage {
  id: string
  url: string
  file_id: string
  type: "thumbnail" | "image"
  category_id: string
}

declare module "@medusajs/types" {
  interface StoreProductCategory {
    product_category_image?: ProductCategoryImage[]
  }
}
