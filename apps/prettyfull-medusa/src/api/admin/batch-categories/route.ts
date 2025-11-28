import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createManyCategoriesWorkflow } from "../../../workflows/create-many-categories"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as {
    product_categories: {
      name: string
      handle?: string
      description?: string
      parent_category_id?: string | null
    }[]
  }

  const { result } = await createManyCategoriesWorkflow(req.scope).run({
    input: {
      product_categories: [{
      "name": "Clothing",
      "description": "Women collection",
      "is_active": true
    },
    {
      "name": "Formal Shop",
      "parent_category_id": "cat_shoes"
    }
],
    },
  })

  res.json(result)
}