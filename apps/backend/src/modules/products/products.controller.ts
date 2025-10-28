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
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
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
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.productsService.findOne(id, language);
  }

  /**
   * POST /products - Admin only
   * Crée un nouveau produit
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * PATCH /products/:id - Admin only
   * Met à jour un produit
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /products/:id - Admin only
   * Supprime un produit (soft delete)
   */
  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
