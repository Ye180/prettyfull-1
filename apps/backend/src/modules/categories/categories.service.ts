import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FormatResponse,
  formatResponse,
} from 'src/shared/utils/format-response';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { StorageService } from '../storage/storage.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
export interface TransformedCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId: string | null;
  isVisible: boolean;
  icon?: string;
  image?: string;
  productCount: number;
  sortOrder: number;
  children?: TransformedCategory[];
  isActive: boolean;
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  metadata?: any;
}
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Créer une nouvelle catégorie
   */

  async findAll(
    language: string = 'fr',
    includeHidden: boolean = false,
    first?: boolean,
    second?: boolean,
  ): Promise<TransformedCategory[]> {
    const query: any = {};

    if (!includeHidden) {
      query.isVisible = true;
    }

    if (first !== undefined) {
      query.first = first;
    }

    if (second !== undefined) {
      query.second = second;
    }

    const categories = await this.categoryModel.find(query).lean().exec();

    return categories.map((category) =>
      this.transformCategory(category, language as 'fr' | 'en'),
    );
  }

  async findOne(
    id: string,
    language: string = 'fr',
  ): Promise<TransformedCategory> {
    const category = await this.categoryModel.findById(id).lean().exec();

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return this.transformCategory(category, language as 'fr' | 'en');
  }

  async findChildren(
    id: string,
    language: string = 'fr',
  ): Promise<TransformedCategory[]> {
    const category = await this.categoryModel.findById(id).lean().exec();

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return (
      this.transformCategory(category, language as 'fr' | 'en').children || []
    );
  }

  async findPrimaryCategory(
    language: string = 'fr',
  ): Promise<TransformedCategory[]> {
    const categories = await this.categoryModel
      .find({ first: true })
      .lean()
      .exec();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Aucune catégorie principale trouvée');
    }

    return categories.map((category) =>
      this.transformCategory(category, language as 'fr' | 'en'),
    );
  }

  async findSecondaryCategory(
    language: string = 'fr',
  ): Promise<TransformedCategory[]> {
    const categories = await this.categoryModel
      .find({ second: true })
      .lean()
      .exec();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Aucune catégorie principale trouvée');
    }

    return categories.map((category) =>
      this.transformCategory(category, language as 'fr' | 'en'),
    );
  }

  async findByName(
    name: string,
    language: string = 'fr',
  ): Promise<TransformedCategory> {
    const category = await this.categoryModel
      .findOne({ name: name })
      .lean()
      .exec();

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return this.transformCategory(category, language as 'fr' | 'en');
  }

  async findBySlug(
    slug: string,
    language: string = 'fr',
  ): Promise<TransformedCategory> {
    const category = await this.categoryModel.findOne({ slug }).lean().exec();

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return this.transformCategory(category, language as 'fr' | 'en');
  }

  /**
   * Créer une nouvelle catégorie
   */

  async create(
    createCategoryDto: CreateCategoryDto,
    language: string,
    image?: Express.Multer.File,
  ): Promise<CategoryDocument> {
    // Vérifier l'unicité du slug
    const existing = await this.categoryModel.findOne({
      slug: createCategoryDto.slug,
    });

    if (existing) {
      throw new BadRequestException(
        `Une catégorie avec le slug "${createCategoryDto.slug}" existe déjà`,
      );
    }

    const existingName = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (existingName) {
      throw new BadRequestException(
        `Une catégorie avec le nom "${createCategoryDto.name[language]}" existe déjà`,
      );
    }

    // Calculer le niveau et le chemin
    const { level, path } = await this.calculateLevelAndPath(
      createCategoryDto.parent,
      createCategoryDto.slug,
    );

    const newCategoryData: any = {
      ...createCategoryDto,
      level,
      path,
    };

    if (image) {
      const uploadedImage = await this.storageService.uploadFile(
        image,
        'categories',
      );
      newCategoryData.image = uploadedImage.url;
    }

    const category = new this.categoryModel(newCategoryData);

    return await category.save();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    // Vérifier l'unicité du slug si modifiée
    if (
      updateCategoryDto.slug &&
      updateCategoryDto.slug !== (category as any).slug
    ) {
      const existing = await this.categoryModel.findOne({
        slug: updateCategoryDto.slug,
        _id: { $ne: id },
      });

      if (existing) {
        throw new BadRequestException(
          `Une catégorie avec le slug "${updateCategoryDto.slug}" existe déjà`,
        );
      }
    }

    // Si le parent change, recalculer level et path
    if (
      updateCategoryDto.parent !== undefined &&
      updateCategoryDto.parent !== (category as any).parent
    ) {
      const { level, path } = await this.calculateLevelAndPath(
        updateCategoryDto.parent,
        updateCategoryDto.slug || (category as any).slug,
      );

      Object.assign(category, updateCategoryDto, { level, path });
    } else {
      Object.assign(category, updateCategoryDto);
    }

    return await category.save();
  }

  /**
   * Supprimer une catégorie (soft delete)
   */
  async remove(id: string): Promise<FormatResponse<void>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    // Vérifier si la catégorie a des enfants
    const childrenCount = await this.categoryModel.countDocuments({
      parent: new Types.ObjectId(id),
    });

    if (childrenCount > 0) {
      throw new BadRequestException(
        'Impossible de supprimer une catégorie ayant des sous-catégories',
      );
    }

    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    // Soft delete : désactiver au lieu de supprimer
    (category as any).isActive = false;
    (category as any).isVisible = false;
    await category.save();
    return formatResponse({
      message: 'La catégorie a été supprimée avec succès',
    });
  }

  /**
   * Supprimer définitivement une catégorie
   */
  async hardDelete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    const childrenCount = await this.categoryModel.countDocuments({
      parent: new Types.ObjectId(id),
    });

    if (childrenCount > 0) {
      throw new BadRequestException(
        'Impossible de supprimer une catégorie ayant des sous-catégories',
      );
    }

    const result = await this.categoryModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Catégorie non trouvée');
    }
  }

  /**
   * Récupérer toutes les catégories d'un pays (admin)
   */
  async findAllCategories(country?: string): Promise<CategoryDocument[]> {
    const query: any = {};

    if (country) {
      query.$or = [{ countries: country }, { countries: { $size: 0 } }];
    }

    return await this.categoryModel
      .find(query)
      .sort({ level: 1, displayOrder: 1 })
      .exec();
  }

  //Get all product of the categories

  async getProductOfCategory(
    categoryId: string,
  ): Promise<FormatResponse<ProductDocument>> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    const category = await this.categoryModel.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    const product = await this.productModel
      .find({ category: categoryId })
      .exec();

    return formatResponse({
      data: product,
      message: 'Produits de la catégorie récupérés avec succès',
    });
  }

  async getProductOfCategoryBySlug(slug: string): Promise<TransformedCategory> {
    const category = await this.categoryModel.findOne({ slug: slug });

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    const products = await this.productModel
      .find({ category: category._id })
      .lean()
      .exec();

    return {
      products: products.map((product) => transformProduct(product, 'fr')),
      message: 'Produits de la catégorie récupérés avec succès',
    };
  }

  async findChildrenCategories(
    parent: string,
    language: string = 'fr',
  ): Promise<TransformedCategory[]> {
    if (!Types.ObjectId.isValid(parent)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    const categories = await this.categoryModel
      .find({ parent: parent })
      .lean()
      .exec();

    const transformedCategories = categories.map((category) =>
      this.transformCategory(category, language as 'fr' | 'en'),
    );

    return transformedCategories;
  }

  async findChildrenBySlug(slug: string, language: string = 'fr') {
    const parentCategory = await this.categoryModel
      .findOne({ slug: slug })
      .lean()
      .exec();

    if (!parentCategory) {
      throw new NotFoundException('Catégorie parente non trouvée');
    }

    return this.findChildrenCategories(parentCategory._id.toString(), language);
  }

  /**
   * Mettre à jour le compteur de produits
   */
  async updateProductCount(
    categoryId: string,
    increment: number,
  ): Promise<void> {
    await this.categoryModel.findByIdAndUpdate(categoryId, {
      $inc: { productCount: increment },
      $set: { updatedAt: new Date() },
    });
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  /**
   * Transformer une catégorie MongoDB en objet i18n
   */
  private transformCategory(
    category: any,
    language: 'fr' | 'en',
  ): TransformedCategory {
    return {
      id: category._id,
      name: category.name[language] || category.name.fr,
      slug: category.slug,
      description: category.description[language] || category.description.fr,
      parentId: category.parent || null,
      isActive: category.isActive,
      isVisible: category.isVisible,
      children: category.children || [],
      icon: category.icon,
      image: category.image,
      sortOrder: category.sortOrder,
      productCount: category.productCount || 0,
      seoMeta: category.seoMeta
        ? {
            title: category.seoMeta.title?.[language],
            description: category.seoMeta.description?.[language],
            keywords: category.seoMeta.keywords,
          }
        : undefined,
      metadata: category.metadata,
    };
  }

  /**
   * Construire l'arbre hiérarchique récursivement
   */
  private buildTree(
    categories: any[],
    parentId: Types.ObjectId | null,
    language: 'fr' | 'en',
    currentDepth: number,
    maxDepth: number,
  ): TransformedCategory[] {
    if (currentDepth >= maxDepth) {
      return [];
    }

    const children = categories.filter((cat) => {
      const catParent = cat.parent || null;
      const targetParent = parentId?.toString() || null;
      return catParent === targetParent;
    });

    return children.map((cat) => {
      const transformed = this.transformCategory(cat, language);
      transformed.children = this.buildTree(
        categories,
        cat._id,
        language,
        currentDepth + 1,
        maxDepth,
      );
      return transformed;
    });
  }

  /**
   * Calculer le niveau et le chemin d'une catégorie
   */
  private async calculateLevelAndPath(
    parentId: string | null | undefined,
    slug: string,
  ): Promise<{ level: number; path: string[] }> {
    if (!parentId) {
      return { level: 0, path: [slug] };
    }

    if (!Types.ObjectId.isValid(parentId)) {
      throw new BadRequestException('ID de catégorie parente invalide');
    }

    const parent = await this.categoryModel.findById(parentId).lean().exec();

    if (!parent) {
      throw new NotFoundException('Catégorie parente non trouvée');
    }

    const parentData = parent as any;
    return {
      level: (parentData.level || 0) + 1,
      path: [...(parentData.path || []), slug],
    };
  }
}
