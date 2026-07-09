import { MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows"
import { PRODUCT_MEDIA_MODULE } from "../../modules/product-media"
import ProductMediaModuleService from "../../modules/product-media/service"

export type CreateCategoryImagesStepInput = {
  category_images: {
    category_id: string
    type: "thumbnail" | "image"
    url: string
    file_id: string
  }[]
}

export const createCategoryImagesStep = createStep(
  "create-category-images-step",
  async (input: CreateCategoryImagesStepInput, { container }) => {
    const productMediaService: ProductMediaModuleService =
      container.resolve(PRODUCT_MEDIA_MODULE)

    // Group images by category to handle thumbnails efficiently
    const imagesByCategory = input.category_images.reduce((acc, img) => {
      if (!acc[img.category_id]) {
        acc[img.category_id] = []
      }
      acc[img.category_id].push(img)
      return acc
    }, {} as Record<string, typeof input.category_images>)

    // Process each category
    for (const [_, images] of Object.entries(imagesByCategory)) {
      const thumbnailImages = images.filter((img) => img.type === "thumbnail")
      
      // If there are new thumbnails for this category, convert existing ones to "image"
      if (thumbnailImages.length > 1) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Only one thumbnail is allowed per category"
        )
      }
    }

    // Create all category images
    const createdImages = await productMediaService.createProductCategoryImages(
      Object.values(imagesByCategory).flat()
    )

    return new StepResponse(createdImages, createdImages)
  },
  async (compensationData, { container }) => {
    if (!compensationData?.length) {
      return
    }

    const productMediaService: ProductMediaModuleService =
      container.resolve(PRODUCT_MEDIA_MODULE)

    // 1. Supprimer les lignes créées en base
    await productMediaService.deleteProductCategoryImages(
      compensationData.map((img) => img.id)
    )

    // 2. Nettoyer les fichiers S3 uploadés en amont, sinon ils restent orphelins
    //    lorsque le workflow échoue. On avale l'erreur pour ne pas faire échouer
    //    la compensation elle-même.
    const fileIds = compensationData
      .map((img) => img.file_id)
      .filter(Boolean)

    if (fileIds.length) {
      try {
        await deleteFilesWorkflow(container).run({
          input: { ids: fileIds },
        })
      } catch (error) {
        console.warn(
          "[create-category-images] Échec du nettoyage des fichiers S3 lors de la compensation",
          { fileIds, error }
        )
      }
    }
  }
)