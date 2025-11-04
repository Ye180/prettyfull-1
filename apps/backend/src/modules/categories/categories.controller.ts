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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /categories - Public
   * Liste toutes les catégories
   */
  @Get('')
  async findAll(
    @Headers('accept-language') language: string = 'fr',
    @Query('includeHidden') includeHidden: boolean = false,
    @Query('first') first?: string,
    @Query('second') second?: string,
  ) {
    const firstFilter =
      first === 'true' ? true : first === 'false' ? false : undefined;
    const secondFilter =
      second === 'true' ? true : second === 'false' ? false : undefined;

    return this.categoriesService.findAll(
      language,
      includeHidden,
      firstFilter,
      secondFilter,
    );
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

  //GET category
  @Get(':id/products')
  async getProductOfCategory(
    @Param('id') id: string,

    // @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.getProductOfCategory(id);
  }

  //Get Prosucts of category by slug
  @Get('slug/:slug/products')
  async getProductOfCategoryBySlug(
    @Param('slug') slug: string,
    // @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.getProductOfCategoryBySlug(slug);
  }

  /**
   * GET /categories/name/:name - Public
   * Récupère une catégorie par son nom
   */
  @Get('name/:name')
  async findByName(
    @Param('name') name: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.findByName(name, language);
  }

  /**
   * POST /categories - Admin only
   * Crée une nouvelle catégorie
   */
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.create(createCategoryDto, language);
  }

  /**
   * PATCH /categories/:id - Admin only
   * Met à jour une catégorie
   */
  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * DELETE /categories/:id - Admin only
   * Supprime une catégorie
   */
  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
