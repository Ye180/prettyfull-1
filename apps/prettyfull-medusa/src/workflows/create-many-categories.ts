import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"

type CreateManyCategoriesInput = {
  product_categories: {
    name: string
    handle?: string
    description?: string
    is_active?: boolean
    is_internal?: boolean
    parent_category_id?: string | null
    rank?: number
    metadata?: Record<string, unknown>
  }[]
}

export const createManyCategoriesWorkflow = createWorkflow(
  "create-many-categories",
  (input: CreateManyCategoriesInput) => {
    // On réutilise directement le workflow core de Medusa
    const categories = createProductCategoriesWorkflow.runAsStep({
      input: {
        product_categories: input.product_categories,
      },
    })

    return new WorkflowResponse(categories)
  }
)