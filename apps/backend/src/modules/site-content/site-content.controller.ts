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
  @Get(':key')
  async getByKey(
    @Param('key') key: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.siteContentService.getByKey(key, language);
  }

  /**
   * GET /site-content - Admin only
   * Liste tous les contenus
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('type') type?: string,
    @Query('includeInactive') includeInactive?: boolean,
  ) {
    return this.siteContentService.findAll(type, includeInactive);
  }

  /**
   * POST /site-content - Admin only
   * Crée un nouveau contenu
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createDto: CreateSiteContentDto) {
    return this.siteContentService.create(createDto);
  }

  /**
   * PATCH /site-content/:key - Admin only
   * Met à jour un contenu
   */
  @Patch(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('key') key: string,
    @Body() updateDto: UpdateSiteContentDto,
  ) {
    return this.siteContentService.update(key, updateDto);
  }

  /**
   * POST /site-content/:key/publish - Admin only
   * Publie un contenu
   */
  @Post(':key/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async publish(
    @Param('key') key: string,
    @Body('publishedBy') publishedBy: string,
  ) {
    return this.siteContentService.publish(key, publishedBy);
  }

  /**
   * POST /site-content/:key/unpublish - Admin only
   * Dépublie un contenu
   */
  @Post(':key/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async unpublish(@Param('key') key: string) {
    return this.siteContentService.unpublish(key);
  }

  /**
   * DELETE /site-content/:key - Admin only
   * Supprime un contenu
   */
  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('key') key: string) {
    return this.siteContentService.delete(key);
  }
}
