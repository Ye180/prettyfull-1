import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: any): Promise<CategoryDocument> {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      return await createdCategory.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Une catégorie avec ce slug existe déjà');
      }
      throw new BadRequestException(
        'Erreur lors de la création de la catégorie',
      );
    }
  }

  async findAll(
    language: string = 'fr',
    includeHidden: boolean = false,
  ): Promise<any[]> {
    const query: any = { isActive: true };

    if (!includeHidden) {
      query.isVisible = true;
    }

    const categories = await this.categoryModel
      .find(query)
      .populate('parent', 'name slug')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();

    // Transformation avec projection i18n
    return categories.map((category: any) => ({
      id: category._id,
      name: category.name?.[language] || '',
      description: category.description?.[language] || '',
      slug: category.slug,
      image: category.image,
      icon: category.icon,
      parent: category.parent
        ? {
            id: category.parent._id,
            name: category.parent.name?.[language] || '',
            slug: category.parent.slug,
          }
        : null,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      isVisible: category.isVisible,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }

  async findOne(id: string, language: string = 'fr'): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    const category = await this.categoryModel
      .findById(id)
      .populate('parent', 'name slug')
      .exec();

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return {
      id: category._id,
      name: (category as any).name?.[language] || '',
      description: (category as any).description?.[language] || '',
      slug: (category as any).slug,
      image: (category as any).image,
      icon: (category as any).icon,
      parent: (category as any).parent
        ? {
            id: (category as any).parent._id,
            name: (category as any).parent.name?.[language] || '',
            slug: (category as any).parent.slug,
          }
        : null,
      sortOrder: (category as any).sortOrder,
      isActive: (category as any).isActive,
      isVisible: (category as any).isVisible,
      seoMeta: (category as any).seoMeta
        ? {
            title: (category as any).seoMeta.title?.[language] || '',
            description:
              (category as any).seoMeta.description?.[language] || '',
            keywords: (category as any).seoMeta.keywords || [],
          }
        : null,
      createdAt: (category as any).createdAt,
      updatedAt: (category as any).updatedAt,
    };
  }

  async findBySlug(slug: string, language: string = 'fr'): Promise<any> {
    const category = await this.categoryModel
      .findOne({ slug, isActive: true, isVisible: true })
      .populate('parent', 'name slug')
      .exec();

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return this.findOne((category._id as any).toString(), language);
  }

  async update(id: string, updateCategoryDto: any): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    try {
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException('Catégorie non trouvée');
      }

      return updatedCategory;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Une catégorie avec ce slug existe déjà');
      }
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la catégorie',
      );
    }
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    // Vérifier s'il y a des sous-catégories
    const hasChildren = await this.categoryModel
      .countDocuments({ parent: new Types.ObjectId(id) })
      .exec();

    if (hasChildren > 0) {
      throw new BadRequestException(
        'Impossible de supprimer une catégorie qui a des sous-catégories',
      );
    }

    const result = await this.categoryModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Catégorie non trouvée');
    }
  }

  async findChildren(
    parentId: string,
    language: string = 'fr',
  ): Promise<any[]> {
    if (!Types.ObjectId.isValid(parentId)) {
      throw new BadRequestException('ID de catégorie parent invalide');
    }

    const children = await this.categoryModel
      .find({
        parent: new Types.ObjectId(parentId),
        isActive: true,
        isVisible: true,
      })
      .sort({ sortOrder: 1 })
      .exec();

    return children.map((category: any) => ({
      id: category._id,
      name: category.name?.[language] || '',
      description: category.description?.[language] || '',
      slug: category.slug,
      image: category.image,
      icon: category.icon,
      sortOrder: category.sortOrder,
    }));
  }

  async findRootCategories(language: string = 'fr'): Promise<any[]> {
    const rootCategories = await this.categoryModel
      .find({
        parent: null,
        isActive: true,
        isVisible: true,
      })
      .sort({ sortOrder: 1 })
      .exec();

    return rootCategories.map((category: any) => ({
      id: category._id,
      name: category.name?.[language] || '',
      description: category.description?.[language] || '',
      slug: category.slug,
      image: category.image,
      icon: category.icon,
      sortOrder: category.sortOrder,
    }));
  }
}
