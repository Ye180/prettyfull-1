import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { ProductsModule } from 'src/modules/products/products.module';
import { StorageModule } from 'src/modules/storage';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [CategoriesModule, ProductsModule, StorageModule],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
