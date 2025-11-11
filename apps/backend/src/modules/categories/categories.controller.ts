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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AllowAnonymous, Roles, Session } from '@thallesp/nestjs-better-auth';
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
  @AllowAnonymous()
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

  @Get('/primary-category')
  @AllowAnonymous()
  async getPrimaryCategory(
    @Headers('accept-language') language: string = 'fr',
  ) {
    return await this.categoriesService.findPrimaryCategory(language);
  }

  @Get('/secondary-category')
  @AllowAnonymous()
  async getSecondaryCategory(
    @Headers('accept-language') language: string = 'fr',
  ) {
    return await this.categoriesService.findSecondaryCategory(language);
  }

  /**
   * GET /categories/:id - Public
   * Récupère une catégorie par son ID
   */
  @Get(':id')
  @AllowAnonymous()
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
  @AllowAnonymous()
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
  @AllowAnonymous()
  async findBySlug(
    @Param('slug') slug: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.findBySlug(slug, language);
  }

  //GET category
  @Get(':id/products')
  @AllowAnonymous()
  async getProductOfCategory(
    @Param('id') id: string,

    // @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.getProductOfCategory(id);
  }

  // //Get Prosucts of category by slug
  // @Get('slug/:slug/products')
  // @AllowAnonymous()
  // async getProductOfCategoryBySlug(
  //   @Param('slug') slug: string,
  //   // @Headers('accept-language') language: string = 'fr',
  // ) {
  //   return this.categoriesService.getProductOfCategoryBySlug(slug);
  // }

  /**
   * GET /categories/name/:name - Public
   * Récupère une catégorie par son nom
   */
  @Get('name/:name')
  @AllowAnonymous()
  async findByName(
    @Param('name') name: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.findByName(name, language);
  }

  //Get category children by slug
  @Get('slug/:slug/children')
  @AllowAnonymous()
  async findChildrenBySlug(
    @Param('slug') slug: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.categoriesService.findChildrenBySlug(slug, language);
  }

  /**
   * POST /categories - Admin only
   * Crée une nouvelle catégorie
   */
  @Post()
  @AllowAnonymous()
  // @Roles(['admin'])
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @Headers('accept-language') language: string = 'fr',
    // @Session() session: UserSession,
  ) {
    console.log('Creating category with data:', createCategoryDto.image);

    return this.categoriesService.create(createCategoryDto, language, image);
  }

  /**
   * PATCH /categories/:id - Admin only
   * Met à jour une catégorie
   */
  @Patch(':id')
  @Roles(['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: any,
    @Session() session: UserSession,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * DELETE /categories/:id - Admin only
   * Supprime une catégorie
   */
  @Delete(':id')
  @Roles(['admin'])
  async remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.categoriesService.remove(id);
  }
}
