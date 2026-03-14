import {
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { deleteCategoryImagesStep } from "./setps/delete-category-images"
import { safeDeleteFilesStep } from "./setps/safe-delete-files"


export type DeleteCategoryImagesInput = {
  ids: string[]
}

export const deleteCategoryImagesWorkflow = createWorkflow(
  "delete-category-images",
  (input: DeleteCategoryImagesInput) => {
    // First, get the category images to retrieve the file_ids
    const { data: categoryImages } = useQueryGraphStep({
      entity: "product_category_image",
      fields: ["id", "file_id", "url", "type", "category_id"],
      filters: {
        id: input.ids,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    })

    // Transform the category images to extract file IDs
    const fileIds = transform(
      { categoryImages },
      (data) => data.categoryImages.map((img) => img.file_id)
    )

    safeDeleteFilesStep({ ids: fileIds })

    // Then delete the category image records
    const result = deleteCategoryImagesStep({ ids: input.ids })

    return new WorkflowResponse(result)
  }
)