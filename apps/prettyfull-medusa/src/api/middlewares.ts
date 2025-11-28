import { 
  defineMiddlewares, 
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { 
  CreateCategoryImagesSchema,
} from "./admin/categories/[category_id]/images/route"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/categories/:category_id/images",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(CreateCategoryImagesSchema),
      ],
    },
  ],
})