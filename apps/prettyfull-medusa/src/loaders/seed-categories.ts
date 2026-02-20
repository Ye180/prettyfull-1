import { LoaderOptions } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import seedCategories from "../scripts/seed-categories";

export default async function categorySeedLoader({
  container,
}: LoaderOptions): Promise<void> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  try {
    logger.info("Running category seed loader...");
    await seedCategories({ container, args: [] });
  } catch (error) {
    logger.error("Error during category seeding:", error);
  }
}
