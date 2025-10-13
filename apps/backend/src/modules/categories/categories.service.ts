import {  BadRequestException,  Injectable,  NotFoundException,} from '@nestjs/common';import { InjectModel } from '@nestjs/mongoose';import { Model, Types } from 'mongoose';import {  CategorySchema,  CategoryDocument,} from '../../shared/schemas/category.schema';import type { CreateCategoryDto } from './dto/create-category.dto';import type { UpdateCategoryDto } from './dto/update-category.dto';/** * Interface pour une catégorie transformée avec i18n */export interface TransformedCategory {  id: string;  name: string;  slug: string;  description: string;  parentId: string | null;  level: number;  path: string[];  countries: string[];  isActive: boolean;  isVisible: boolean;  displayOrder: number;  icon?: string;  image?: string;  productCount: number;  children?: TransformedCategory[];  seoMeta?: {    title?: string;    description?: string;    keywords?: string[];  };  metadata?: any;}@Injectable()export class CategoriesService {  constructor(    @InjectModel(CategorySchema.name)    private categoryModel: Model<CategoryDocument>,  ) {}  /**   * Créer une nouvelle catégorie   */  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {    // Vérifier que le slug est unique    const existing = await this.categoryModel.findOne({      slug: createCategoryDto.slug,    });    if (existing) {      throw new BadRequestException(        `Une catégorie avec le slug "${createCategoryDto.slug}" existe déjà`,      );    }    let level = 0;    const path: string[] = [];    let parent: CategoryDocument | null = null;    // Si une catégorie parente est spécifiée    if (createCategoryDto.parentId) {      if (!Types.ObjectId.isValid(createCategoryDto.parentId)) {        throw new BadRequestException('ID de catégorie parente invalide');      }      parent = await this.categoryModel.findById(createCategoryDto.parentId);      if (!parent) {        throw new NotFoundException('Catégorie parente non trouvée');      }      const parentData = parent as any;      level = (parentData.level || 0) + 1;      path.push(...(parentData.path || []), createCategoryDto.slug);    } else {      path.push(createCategoryDto.slug);    }    const categoryData = {      ...createCategoryDto,      parent: createCategoryDto.parentId        ? new Types.ObjectId(createCategoryDto.parentId)        : null,      level,      path,      productCount: 0,    };    const category = new this.categoryModel(categoryData);    return await category.save();  }  /**   * Récupérer toutes les catégories racines (level 0) pour un pays   */  async findRoots(    language: 'fr' | 'en' = 'fr',    country?: string,  ): Promise<TransformedCategory[]> {    const query: any = {      parent: null,      isActive: true,      isVisible: true,    };    // Filtrer par pays si spécifié    if (country) {      query.$or = [{ countries: country }, { countries: { $size: 0 } }];    }    const categories = await this.categoryModel      .find(query)      .sort({ displayOrder: 1, 'name.fr': 1 })      .lean()      .exec();    return categories.map((cat) => this.transformCategory(cat, language));  }  /**   * Récupérer les sous-catégories d'une catégorie parente   */  async findChildren(    parentId: string,    language: 'fr' | 'en' = 'fr',    country?: string,  ): Promise<TransformedCategory[]> {    if (!Types.ObjectId.isValid(parentId)) {      throw new BadRequestException('ID de catégorie invalide');    }    const query: any = {      parent: new Types.ObjectId(parentId),      isActive: true,      isVisible: true,    };    if (country) {      query.$or = [{ countries: country }, { countries: { $size: 0 } }];    }    const categories = await this.categoryModel      .find(query)      .sort({ displayOrder: 1, 'name.fr': 1 })      .lean()      .exec();    return categories.map((cat) => this.transformCategory(cat, language));  }  /**   * Récupérer l'arbre complet des catégories pour un pays   */  async findTree(    language: 'fr' | 'en' = 'fr',    country?: string,    maxDepth = 3,  ): Promise<TransformedCategory[]> {    const query: any = {      isActive: true,      isVisible: true,    };    if (country) {      query.$or = [{ countries: country }, { countries: { $size: 0 } }];    }    const allCategories = await this.categoryModel      .find(query)      .sort({ level: 1, displayOrder: 1 })      .lean()      .exec();    // Construire l'arbre hiérarchique    return this.buildTree(allCategories, null, language, 0, maxDepth);  }  /**   * Récupérer une catégorie par son ID   */  async findOne(    id: string,    language: 'fr' | 'en' = 'fr',  ): Promise<TransformedCategory> {    if (!Types.ObjectId.isValid(id)) {      throw new BadRequestException('ID de catégorie invalide');    }    const category = await this.categoryModel.findById(id).lean().exec();    if (!category) {      throw new NotFoundException('Catégorie non trouvée');    }    return this.transformCategory(category, language);  }  /**   * Récupérer une catégorie par son slug   */  async findBySlug(    slug: string,    language: 'fr' | 'en' = 'fr',  ): Promise<TransformedCategory> {    const category = await this.categoryModel      .findOne({ slug, isActive: true })      .lean()      .exec();    if (!category) {      throw new NotFoundException(`Catégorie "${slug}" non trouvée`);    }    return this.transformCategory(category, language);  }  /**   * Mettre à jour une catégorie
   */
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

    // Vérifier l'unicité du slug si modifié
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
      updateCategoryDto.parentId !== undefined &&
      updateCategoryDto.parentId !== (category as any).parent?.toString()
    ) {
      const { level, path } = await this.calculateLevelAndPath(
        updateCategoryDto.parentId,
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
  async remove(id: string): Promise<void> {
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
  async findAll(country?: string): Promise<CategoryDocument[]> {
    const query: any = {};

    if (country) {
      query.$or = [{ countries: country }, { countries: { $size: 0 } }];
    }

    return await this.categoryModel
      .find(query)
      .sort({ level: 1, displayOrder: 1 })
      .exec();
  }

  /**
   * Mettre à jour le compteur de produits
   */
  async updateProductCount(categoryId: string, increment: number): Promise<void> {
    await this.categoryModel.findByIdAndUpdate(categoryId, {
      $inc: { productCount: increment },
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
      id: category._id.toString(),
      name: category.name[language] || category.name.fr,
      slug: category.slug,
      description: category.description[language] || category.description.fr,
      parentId: category.parent?.toString() || null,
      level: category.level || 0,
      path: category.path || [],
      countries: category.countries || [],
      isActive: category.isActive,
      isVisible: category.isVisible,
      displayOrder: category.displayOrder,
      icon: category.icon,
      image: category.image,
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
      const catParent = cat.parent?.toString() || null;
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
