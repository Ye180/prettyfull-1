import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateSiteContentDto,
  UpdateSiteContentDto,
} from './dto/create-site-content.dto';
import { SiteContentService } from './site-content.service';

@Controller('site-content')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Post()
  create(@Body() dto: CreateSiteContentDto) {
    return this.siteContentService.create(dto);
  }

  @Get()
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSiteContentDto) {
    return this.siteContentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteContentService.remove(id);
  }
}
