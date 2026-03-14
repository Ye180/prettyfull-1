import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows"

export type SafeDeleteFilesStepInput = {
  ids: string[]
}

type SafeDeleteFilesStepOutput = {
  deleted: string[]
}

export const safeDeleteFilesStep = createStep(
  "safe-delete-files-step",
  async (
    input: SafeDeleteFilesStepInput,
    { container }: { container: any }
  ) => {
    if (!input.ids?.length) {
      return new StepResponse<SafeDeleteFilesStepOutput>({ deleted: [] })
    }

    try {
      await deleteFilesWorkflow(container).run({
        input: {
          ids: input.ids,
        },
      })

      return new StepResponse<SafeDeleteFilesStepOutput>({ deleted: input.ids })
    } catch (error) {
      console.warn("Failed to delete files from storage", {
        ids: input.ids,
        error,
      })

      return new StepResponse<SafeDeleteFilesStepOutput>({ deleted: [] })
    }
  }
)
