import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateSiteContentDto,
  UpdateSiteContentDto,
} from './dto/create-site-content.dto';
import {
  SiteContent,
  SiteContentDocument,
} from './schemas/site-content.schema';
// import {
//   CreateSiteContentDto,
//   UpdateSiteContentDto,
// } from '../dto/site-content.dto';
// import {
//   SiteContent,
//   SiteContentDocument,
// } from '../schemas/site-content.schema';

@Injectable()
export class SiteContentService {
  constructor(
    @InjectModel(SiteContent.name)
    private readonly siteContentModel: Model<SiteContentDocument>,
  ) {}

  /* -----------------------------------------------------------
   * 🧱 CREATE
   * ----------------------------------------------------------- */
  async create(createDto: CreateSiteContentDto): Promise<SiteContent> {
    const created = new this.siteContentModel(createDto);
    return created.save();
  }

  /* -----------------------------------------------------------
   * 📋 FIND ALL (option: filtrer par type, actif, etc.)
   * ----------------------------------------------------------- */
  async findAll(
    filters?: Partial<{ type: string; isActive: boolean }>,
  ): Promise<SiteContent[]> {
    const query: any = {};
    if (filters?.type) query.type = filters.type;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;

    return this.siteContentModel.find(query).sort({ sortOrder: 1 }).exec();
  }

  /* -----------------------------------------------------------
   * 🔍 FIND ONE BY ID
   * ----------------------------------------------------------- */
  async findOne(id: string): Promise<SiteContent> {
    const content = await this.siteContentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException(`SiteContent with ID "${id}" not found`);
    }
    return content;
  }

  /* -----------------------------------------------------------
   * 🔍 FIND ONE BY KEY
   * ----------------------------------------------------------- */
  async findByKey(key: string): Promise<SiteContent> {
    const content = await this.siteContentModel.findOne({ key }).exec();
    if (!content) {
      throw new NotFoundException(`SiteContent with key "${key}" not found`);
    }
    return content;
  }

  /* -----------------------------------------------------------
   * ✏️ UPDATE
   * ----------------------------------------------------------- */
  async update(
    id: string,
    updateDto: UpdateSiteContentDto,
  ): Promise<SiteContent> {
    const updated = await this.siteContentModel
      .findByIdAndUpdate(id, updateDto, { new: true, runValidators: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`SiteContent with ID "${id}" not found`);
    }

    return updated;
  }

  /* -----------------------------------------------------------
   * ❌ DELETE
   * ----------------------------------------------------------- */
  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.siteContentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`SiteContent with ID "${id}" not found`);
    }
    return { deleted: true };
  }

  /* -----------------------------------------------------------
   * ⚙️ ACTIVER / DÉSACTIVER
   * ----------------------------------------------------------- */
  async toggleActive(id: string, isActive: boolean): Promise<SiteContent> {
    const updated = await this.siteContentModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`SiteContent with ID "${id}" not found`);
    }

    return updated;
  }
}
