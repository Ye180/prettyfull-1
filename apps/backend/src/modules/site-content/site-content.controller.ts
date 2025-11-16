import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CreateSiteContentDto } from './dto/create-site-content.dto';
import {
  CreateStep1Dto,
  UpdateStep2Dto,
  UpdateStep3Dto,
} from './dto/step-site-content.dto';
import { SiteContentService } from './site-content.service';

@Controller('site-content')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Post()
  @AllowAnonymous()
  create(@Body() dto: CreateSiteContentDto) {
    return this.siteContentService.create(dto);
  }

  /* -----------------------------------------------------------
   * 🚀 ROUTES PROGRESSIVES PAR STEP
   * ----------------------------------------------------------- */

  /**
   * Step 1: Créer le document avec les informations de base + sections 1-3
   * @returns Le document créé avec son ID
   */
  @Post('step-1')
  @UseInterceptors(AnyFilesInterceptor())
  @AllowAnonymous()
  createStep1(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Parser les champs JSON stringifiés du FormData
    const sortOrderValue = body.sortOrder
      ? Number(body.sortOrder)
      : body.sortOrder === 0
        ? 0
        : 0;

    const dto: CreateStep1Dto = {
      key: body.key,
      type: body.type || 'SECTION',
      isActive: body.isActive === 'true' || body.isActive === true,
      sortOrder: isNaN(sortOrderValue) ? 0 : sortOrderValue,
      quote: body.quote ? JSON.parse(body.quote) : undefined,
      first: body.first ? JSON.parse(body.first) : undefined,
      secondSection: body.secondSection
        ? JSON.parse(body.secondSection)
        : undefined,
      thirdSection: body.thirdSection
        ? JSON.parse(body.thirdSection)
        : undefined,
    };

    return this.siteContentService.createStep1(dto, files);
  }

  /**
   * Step 2: Mettre à jour avec les sections 4, 5 et 6
   * @param id L'ID du document créé au step 1
   */
  @Patch(':id/step-2')
  @UseInterceptors(AnyFilesInterceptor())
  @AllowAnonymous()
  updateStep2(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Parser les champs JSON stringifiés du FormData
    const dto: UpdateStep2Dto = {
      fourthSection: body.fourthSection
        ? JSON.parse(body.fourthSection)
        : undefined,
      fiveSection: body.fiveSection ? JSON.parse(body.fiveSection) : undefined,
      sixSection: body.sixSection ? JSON.parse(body.sixSection) : undefined,
    };

    return this.siteContentService.updateStep2(id, dto, files);
  }

  /**
   * Step 3: Finaliser avec les sections 7, 8, 9 et 10
   * @param id L'ID du document créé au step 1
   */
  @Patch(':id/step-3')
  @UseInterceptors(AnyFilesInterceptor())
  @AllowAnonymous()
  updateStep3(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Parser les champs JSON stringifiés du FormData
    const dto: UpdateStep3Dto = {
      sevenSection: body.sevenSection
        ? JSON.parse(body.sevenSection)
        : undefined,
      eightSection: body.eightSection
        ? JSON.parse(body.eightSection)
        : undefined,
      nineSection: body.nineSection ? JSON.parse(body.nineSection) : undefined,
      tenSection: body.tenSection ? JSON.parse(body.tenSection) : undefined,
    };

    return this.siteContentService.updateStep3(id, dto, files);
  }

  /* -----------------------------------------------------------
   * 🔍 ROUTES DE LECTURE
   * ----------------------------------------------------------- */

  /**
   * Route publique: récupère uniquement les contenus visibles (isActive: true)
   * avec population des catégories
   */
  @Get('visible')
  @AllowAnonymous()
  findAllVisible(@Query('type') type?: string) {
    return this.siteContentService.findAllVisible(type);
  }

  /**
   * Route admin: récupère tous les contenus avec population des catégories
   */
  @Get('all')
  @AllowAnonymous()
  findAll(@Query('type') type?: string, @Query('isActive') isActive?: boolean) {
    return this.siteContentService.findAll({ type, isActive });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteContentService.findOne(id);
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.siteContentService.findByKey(key);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateSiteContentDto) {
  //   return this.siteContentService.update(id, dto);
  // }

  //Route pour activer ou désactiver un site-content
  @Patch(':id/toggle-active')
  @AllowAnonymous()
  toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.siteContentService.toggleActive(id, isActive);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.siteContentService.remove(id);
  // }

  /**
   * Récupère les catégories primaires utilisées comme `key` dans site-content
   * Renvoie les objets complets des catégories (uniques)
   */
  @Get('keys/categories')
  @AllowAnonymous()
  findPrimaryCategories() {
    return this.siteContentService.findKeyVisibleCategories();
  }

  //Recuperer by slugName

  @Get('keys/category-slug/:slugName')
  @AllowAnonymous()
  findByCategorySlugName(@Param('slugName') slugName: string) {
    return this.siteContentService.findKeyCategoriesSlugname(slugName);
  }

  @Get('key-categories/:slugname')
  @AllowAnonymous()
  async findKeyCategoriesSlugname(
    @Param('slugname') slugname: string,
    @Headers('accept-language') language?: string,
  ) {
    const lang = language === 'en' ? 'en' : 'fr';
    return this.siteContentService.findKeyCategoriesSlugname(slugname, lang);
  }
}
