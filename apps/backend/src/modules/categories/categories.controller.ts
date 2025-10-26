import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /categories - Public
   * Liste toutes les catégories
   */
  @Get()
  async findAll(
    @Headers('accept-language') language: string = 'fr',
    @Query('includeHidden') includeHidden: boolean = false,
  ) {
    return this.categoriesService.findAll(language, includeHidden);
  }

  /**
   * GET /categories/:id - Public
   * Récupère une catégorie par son ID
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.findOne(id, language);
  }

  /**
   * GET /categories/:id/children - Public
   * Récupère les sous-catégories d'une catégorie
   */
  @Get(':id/children')
  async findChildren(
    @Param('id') id: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.findChildren(id, language);
  }

  /**
   * GET /categories/slug/:slug - Public
   * Récupère une catégorie par son slug
   */
  @Get('slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.findBySlug(slug, language);
  }

  /**
   * POST /categories - Admin only
   * Crée une nouvelle catégorie
   */
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * PATCH /categories/:id - Admin only
   * Met à jour une catégorie
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * DELETE /categories/:id - Admin only
   * Supprime une catégorie
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
