import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import { CreateSiteContentDto } from './dto/create-site-content.dto';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';
import { SiteContentService } from './site-content.service';

@Controller('site-content')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  /**
   * GET /site-content/:key - Public
   * Récupère un contenu publié par sa clé
   */
  // @Get(':key')
  // @AllowAnonymous()
  // async getByKey(
  //   @Param('key') key: string,
  //   @Headers('accept-language') language: string = 'fr',
  // ) {
  //   return this.siteContentService.getByKey(key, language);
  // }

  // /**
  //  * GET /site-content - Admin only
  //  * Liste tous les contenus
  //  */
  // @Get()
  // @Roles(['admin'])
  // async findAll(
  //   @Query('type') type?: string,
  //   @Query('includeInactive') includeInactive?: boolean,
  //   @Session() session: UserSession,
  // ) {
  //   return this.siteContentService.findAll(type, includeInactive);
  // }

  /**
   * POST /site-content - Admin only
   * Crée un nouveau contenu
   */
  @Post()
  @Roles(['admin'])
  async create(
    @Body() createDto: CreateSiteContentDto,
    @Session() session: UserSession,
  ) {
    // return this.siteContentService.create(createDto);
  }

  /**
   * PATCH /site-content/:key - Admin only
   * Met à jour un contenu
   */
  @Patch(':key')
  @Roles(['admin'])
  async update(
    @Param('key') key: string,
    @Body() updateDto: UpdateSiteContentDto,
    @Session() session: UserSession,
  ) {
    return this.siteContentService.update(key, updateDto);
  }

  /**
   * POST /site-content/:key/publish - Admin only
   * Publie un contenu
   */
  // @Post(':key/publish')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async publish(
  //   @Param('key') key: string,
  //   @Body('publishedBy') publishedBy: string,
  // ) {
  //   return this.siteContentService.publish(key, publishedBy);
  // }

  // /**
  //  * POST /site-content/:key/unpublish - Admin only
  //  * Dépublie un contenu
  //  */
  // @Post(':key/unpublish')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async unpublish(@Param('key') key: string) {
  //   return this.siteContentService.unpublish(key);
  // }

  // /**
  //  * DELETE /site-content/:key - Admin only
  //  * Supprime un contenu
  //  */
  // @Delete(':key')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async delete(@Param('key') key: string) {
  //   return this.siteContentService.delete(key);
  // }
}
