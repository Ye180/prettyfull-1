import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';
import {
  ContentType,
  SiteContent,
  SiteContentDocument,
} from './schemas/site-content.schema';

@Injectable()
export class SiteContentService {
  constructor(
    @InjectModel(SiteContent.name)
    private siteContentModel: Model<SiteContentDocument>,
  ) {}

  // async create(
  //   createSiteContentDto: CreateSiteContentDto,
  // ): Promise<SiteContent> {
  //   try {
  //     const createdContent = new this.siteContentModel(createSiteContentDto);
  //     return await createdContent.save();
  //   } catch (error) {
  //     // if (error.code === 11000) {
  //     //   throw new ConflictException('Site content with this key already exists');
  //     // }
  //     throw error;
  //   }
  // }

  async findAll(
    category?: string,
    type?: ContentType,
    isActive?: boolean,
  ): Promise<SiteContent[]> {
    const filter: any = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive;

    return this.siteContentModel
      .find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<SiteContent> {
    const content = await this.siteContentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException(`Site content with ID ${id} not found`);
    }
    return content;
  }

  async findByKey(key: string): Promise<SiteContent> {
    const content = await this.siteContentModel.findOne({ key }).exec();
    if (!content) {
      throw new NotFoundException(`Site content with key ${key} not found`);
    }
    return content;
  }

  async update(
    id: string,
    updateSiteContentDto: UpdateSiteContentDto,
  ): Promise<SiteContent> {
    const updatedContent = await this.siteContentModel
      .findByIdAndUpdate(id, updateSiteContentDto, { new: true })
      .exec();

    if (!updatedContent) {
      throw new NotFoundException(`Site content with ID ${id} not found`);
    }
    return updatedContent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.siteContentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Site content with ID ${id} not found`);
    }
  }

  async findByCategory(category: string): Promise<SiteContent[]> {
    return this.siteContentModel
      .find({ category, isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findByType(type: ContentType): Promise<SiteContent[]> {
    return this.siteContentModel
      .find({ type, isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }
}
// import { NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import {
//   SiteContentDocument,
//   SiteContentSchema,
// } from '../../shared/schemas/site-content.schema';
// import { CreateSiteContentDto } from './dto/create-site-content.dto';
// import { UpdateSiteContentDto } from './dto/update-site-content.dto';
// @Injectable()
// export class SiteContentService {
//   constructor(
//     @InjectModel(SiteContentSchema.name)
//     private siteContentModel: Model<SiteContentDocument>,
//   ) {}

//   /**
//    * Récupère un contenu par sa clé (public, avec transformation i18n)
//    */
//   async getByKey(key: string, language: string = 'fr'): Promise<any> {
//     const content = await this.siteContentModel
//       .findOne({ key, isActive: true })
//       .lean()
//       .exec();

//     if (!content) {
//       throw new NotFoundException(`Contenu introuvable: ${key}`);
//     }

//     return this.transformContent(content, language);
//   }

//   /**
//    * Liste tous les contenus d'un type (admin)
//    */
//   async findAll(
//     type?: string,
//     includeInactive: boolean = false,
//   ): Promise<SiteContentDocument[]> {
//     const query: any = {};

//     if (type) {
//       query.type = type;
//     }

//     if (!includeInactive) {
//       query.isActive = true;
//     }

//     return this.siteContentModel.find(query).sort({ createdAt: -1 }).exec();
//   }

//   /**
//    * Récupère un contenu par son ID (admin)
//    */
//   async findOne(id: string): Promise<SiteContentDocument> {
//     const content = await this.siteContentModel.findById(id).exec();

//     if (!content) {
//       throw new NotFoundException(`Contenu introuvable: ${id}`);
//     }

//     return content;
//   }

//   /**
//    * Crée un nouveau contenu (admin)
//    */
//   async create(createDto: CreateSiteContentDto): Promise<SiteContentDocument> {
//     const content = new this.siteContentModel(createDto);
//     return content.save();
//   }

//   /**
//    * Met à jour un contenu (admin)
//    */
//   async update(
//     key: string,
//     updateDto: UpdateSiteContentDto,
//   ): Promise<SiteContentDocument> {
//     const content = await this.siteContentModel
//       .findOneAndUpdate(
//         { key },
//         {
//           ...updateDto,
//           $inc: { 'metadata.version': 1 }, // Increment version
//         },
//         { new: true },
//       )
//       .exec();

//     if (!content) {
//       throw new NotFoundException(`Contenu introuvable: ${key}`);
//     }

//     return content;
//   }

//   /**
//    * Publie un contenu (admin)
//    */
//   async publish(
//     key: string,
//     publishedBy: string,
//   ): Promise<SiteContentDocument> {
//     const content = await this.siteContentModel
//       .findOneAndUpdate(
//         { key },
//         {
//           isActive: true,
//           publishedAt: new Date(),
//           publishedBy,
//         },
//         { new: true },
//       )
//       .exec();

//     if (!content) {
//       throw new NotFoundException(`Contenu introuvable: ${key}`);
//     }

//     return content;
//   }

//   /**
//    * Dépublie un contenu (admin)
//    */
//   async unpublish(key: string): Promise<SiteContentDocument> {
//     const content = await this.siteContentModel
//       .findOneAndUpdate({ key }, { isActive: false }, { new: true })
//       .exec();

//     if (!content) {
//       throw new NotFoundException(`Contenu introuvable: ${key}`);
//     }

//     return content;
//   }

//   /**
//    * Supprime un contenu (admin)
//    */
//   async delete(key: string): Promise<void> {
//     const result = await this.siteContentModel.deleteOne({ key }).exec();

//     if (result.deletedCount === 0) {
//       throw new NotFoundException(`Contenu introuvable: ${key}`);
//     }
//   }

//   /**
//    * Transforme le contenu pour ne retourner que la langue demandée
//    */
//   private transformContent(content: any, language: string): any {
//     const transformed = {
//       key: content.key,
//       type: content.type,
//       content: this.translateFields(content.content, language),
//       publishedAt: content.publishedAt,
//     };

//     return transformed;
//   }

//   /**
//    * Traduit récursivement les champs multilingues
//    * Si un objet a les clés {fr: "...", en: "..."}, retourne la langue demandée
//    */
//   private translateFields(obj: any, language: string): any {
//     if (typeof obj !== 'object' || obj === null) {
//       return obj;
//     }

//     // Si c'est un objet de traduction {fr: "...", en: "..."}
//     if (obj.fr !== undefined || obj.en !== undefined) {
//       return obj[language] || obj.fr || obj.en;
//     }

//     // Si c'est un tableau
//     if (Array.isArray(obj)) {
//       return obj.map((item) => this.translateFields(item, language));
//     }

//     // Si c'est un objet, traduire récursivement
//     const translated: any = {};
//     for (const key in obj) {
//       translated[key] = this.translateFields(obj[key], language);
//     }

//     return translated;
//   }
// }
