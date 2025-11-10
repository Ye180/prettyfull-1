import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AllowAnonymous, Roles, Session } from '@thallesp/nestjs-better-auth';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /products - Public
   * Liste tous les produits avec pagination
   */
  @Get()
  @AllowAnonymous()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.productsService.findAll(page, limit, language);
  }

  /**
   * GET /products/:id - Public
   * Récupère un produit par son ID
   */
  @Get(':id')
  @AllowAnonymous()
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.productsService.findOne(id, language);
  }

  @Get('slugname/:slug')
  @AllowAnonymous()
  async findOneBySlug(
    @Param('slug') slug: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.productsService.findOneBySlug(slug, language);
  }

  /**
   * POST /products - Admin only
   * Crée un nouveau produit
   */
  @Post()
  @Roles(['admin'])
  async create(
    @Body() createProductDto: CreateProductDto,
    @Session() session: UserSession,
  ) {
    return this.productsService.create(createProductDto);
  }

  /**
   * PATCH /products/:id - Admin only
   * Met à jour un produit
   */
  @Patch(':id')
  @Roles(['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Session() session: UserSession,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /products/:id - Admin only
   * Supprime un produit (soft delete)
   */
  @Delete(':id')
  @Roles(['admin'])
  async remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.productsService.remove(id);
  }
}
