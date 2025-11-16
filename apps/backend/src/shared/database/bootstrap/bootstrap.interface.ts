export abstract class Bootstrap {
  abstract bootstrapCategories(): Promise<void>;
  abstract bootstrapProducts(): Promise<void>;
  abstract bootstrapUsers(): Promise<void>;
  abstract run(): Promise<void>;
}
