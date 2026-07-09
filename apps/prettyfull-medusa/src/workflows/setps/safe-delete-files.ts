import type { MedusaContainer } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows"

export type SafeDeleteFilesStepInput = {
  ids: string[]
}

type SafeDeleteFilesStepOutput = {
  deleted: string[]
  /** IDs dont la suppression a échoué (fichiers potentiellement orphelins). */
  failed: string[]
}

export const safeDeleteFilesStep = createStep(
  "safe-delete-files-step",
  async (
    input: SafeDeleteFilesStepInput,
    { container }: { container: MedusaContainer }
  ) => {
    if (!input.ids?.length) {
      return new StepResponse<SafeDeleteFilesStepOutput>({
        deleted: [],
        failed: [],
      })
    }

    try {
      await deleteFilesWorkflow(container).run({
        input: {
          ids: input.ids,
        },
      })

      return new StepResponse<SafeDeleteFilesStepOutput>({
        deleted: input.ids,
        failed: [],
      })
    } catch (error) {
      // On ne fait pas échouer le workflow (étape terminale, non compensable),
      // mais on remonte les IDs en échec pour traçabilité / retry ultérieur
      // plutôt que de les perdre silencieusement.
      console.error("[safe-delete-files] Fichiers non supprimés du stockage", {
        ids: input.ids,
        error,
      })

      return new StepResponse<SafeDeleteFilesStepOutput>({
        deleted: [],
        failed: input.ids,
      })
    }
  }
)
