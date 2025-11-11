import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { ProductsService } from 'src/modules/products/products.service';
import { PRODUCTS } from './constant/constant';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly productService: ProductsService,
    private readonly categoryService: CategoriesService,
  ) {}

  async bootstrapCategories(): Promise<void> {
    // try {
    //   for (const category of CATEGORY) {
    //     try {
    //       await this.categoryService.create(category, 'system-bootstrap');
    //       Logger.log(`🎉 Catégorie "${category.name.en}" créée avec succès !`);
    //       const existing = await this.categoryService.findBySlug(category.slug);
    //       if (existing) {
    //         Logger.log(
    //           `✅ Catégorie "${category.name.en}" déjà existante, aucune création nécessaire.`,
    //         );
    //         continue;
    //       }
    //     } catch (err) {
    //       Logger.error(`Failed to create category: ${category.name.en}`, err);
    //     }
    //   }
    // } catch (error: any) {
    //   Logger.error(
    //     `❌ Erreur lors de la vérification de la catégorie: ${error.message}`,
    //   );
    // }
    // Sinon, la créer
  }

  async bootstrapProducts(): Promise<void> {
    try {
      for (const product of PRODUCTS) {
        try {
          await this.productService.create(product as any);
          Logger.log(`🎉 Produit "${product.name.en}" créé avec succès !`);

          const existing = await this.productService.findOneBySlug(
            product.slug,
          );
          if (existing) {
            Logger.log(
              `✅ Produit "${product.name.en}" déjà existant, aucune création nécessaire.`,
            );
            continue;
          }
        } catch (err) {
          Logger.error(`Failed to create product: ${product.name.en}`, err);
        }
      }
    } catch (error: any) {
      Logger.error(
        `❌ Erreur lors de la vérification de la catégorie: ${error.message}`,
      );
    }
    // Exemple : à implémenter plus tard
  }

  async bootstrapUsers(): Promise<void> {
    // Exemple : à implémenter plus tard
  }

  async run(): Promise<void> {
    await this.bootstrapCategories();
    // await this.bootstrapProducts();
    await this.bootstrapUsers();
  }

  async onApplicationBootstrap() {
    Logger.log('🚀 Bootstrap en cours...');
    await this.run();
    Logger.log('✅ Bootstrap terminé !');
  }
}
