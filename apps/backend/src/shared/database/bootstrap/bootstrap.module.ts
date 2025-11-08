import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { ProductsModule } from 'src/modules/products/products.module';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [CategoriesModule, ProductsModule],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
