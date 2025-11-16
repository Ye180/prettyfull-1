import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransformedCategory } from '../categories/categories.service';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';
import { TransformedProduct } from '../products/products.service';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { StorageService } from '../storage/storage.service';
import { CreateSiteContentDto } from './dto/create-site-content.dto';
import {
  CreateStep1Dto,
  UpdateStep2Dto,
  UpdateStep3Dto,
} from './dto/step-site-content.dto';
import {
  SiteContent,
  SiteContentDocument,
} from './schemas/site-content.schema';

@Injectable()
export class SiteContentService {
  private readonly logger = new Logger(SiteContentService.name);

  constructor(
    @InjectModel(SiteContent.name)
    private readonly siteContentModel: Model<SiteContentDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    private readonly storageService: StorageService,
  ) {}

  /* -----------------------------------------------------------
   * 🧱 CREATE
   * ----------------------------------------------------------- */
  async create(createDto: CreateSiteContentDto): Promise<SiteContent> {
    const created = new this.siteContentModel(createDto);
    return created.save();
  }

  /* -----------------------------------------------------------
   * � CREATE STEP BY STEP
   * ----------------------------------------------------------- */

  /**
   * Step 1: Créer le document avec les informations de base + sections 1-3
   * Retourne le document créé avec son ID pour les prochains steps
   * Gère l'upload des images pour first et thirdSection
   */
  async createStep1(
    dto: CreateStep1Dto,
    files?: Express.Multer.File[],
  ): Promise<SiteContent> {
    // Préparer les données à sauvegarder
    const dataToSave: any = { ...dto };

    // Upload des images si des fichiers sont fournis
    if (files && files.length > 0) {
      this.logger.log(`Uploading ${files.length} files for site-content step1`);

      // Grouper les fichiers par leur fieldname
      const filesByField: Record<string, Express.Multer.File> = {};
      files.forEach((file) => {
        filesByField[file.fieldname] = file;
      });

      // Upload first.imageUrlDesktop
      if (filesByField['first.imageUrlDesktop']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['first.imageUrlDesktop'],
          'site-content',
        );
        if (!dataToSave.first) dataToSave.first = {};
        dataToSave.first.imageUrlDesktop = uploaded.url;
        this.logger.log(`Uploaded first.imageUrlDesktop: ${uploaded.url}`);
      }

      // Upload first.imageUrlMobile
      if (filesByField['first.imageUrlMobile']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['first.imageUrlMobile'],
          'site-content',
        );
        if (!dataToSave.first) dataToSave.first = {};
        dataToSave.first.imageUrlMobile = uploaded.url;
        this.logger.log(`Uploaded first.imageUrlMobile: ${uploaded.url}`);
      }

      // Upload first.video
      if (filesByField['first.video']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['first.video'],
          'site-content',
        );
        if (!dataToSave.first) dataToSave.first = {};
        dataToSave.first.video = uploaded.url;
        this.logger.log(`Uploaded first.video: ${uploaded.url}`);
      }

      // Upload thirdSection.imageUrlDesktop
      if (filesByField['thirdSection.imageUrlDesktop']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['thirdSection.imageUrlDesktop'],
          'site-content',
        );
        if (!dataToSave.thirdSection) dataToSave.thirdSection = {};
        dataToSave.thirdSection.imageUrlDesktop = uploaded.url;
        this.logger.log(
          `Uploaded thirdSection.imageUrlDesktop: ${uploaded.url}`,
        );
      }

      // Upload thirdSection.imageUrlMobile
      if (filesByField['thirdSection.imageUrlMobile']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['thirdSection.imageUrlMobile'],
          'site-content',
        );
        if (!dataToSave.thirdSection) dataToSave.thirdSection = {};
        dataToSave.thirdSection.imageUrlMobile = uploaded.url;
        this.logger.log(
          `Uploaded thirdSection.imageUrlMobile: ${uploaded.url}`,
        );
      }
    }

    const created = new this.siteContentModel(dataToSave);
    return created.save();
  }

  /**
   * Step 2: Mettre à jour avec les sections 4, 5 et 6
   * Gère l'upload des images pour fourthSection et sixSection
   */
  async updateStep2(
    id: string,
    dto: UpdateStep2Dto,
    files?: Express.Multer.File[],
  ): Promise<SiteContent> {
    const dataToUpdate: any = { ...dto };

    // Upload des images si des fichiers sont fournis
    if (files && files.length > 0) {
      this.logger.log(`Uploading ${files.length} files for site-content step2`);

      const filesByField: Record<string, Express.Multer.File> = {};
      files.forEach((file) => {
        filesByField[file.fieldname] = file;
      });

      // Upload fourthSection.imageUrl
      if (filesByField['fourthSection.imageUrl']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['fourthSection.imageUrl'],
          'site-content',
        );
        if (!dataToUpdate.fourthSection) dataToUpdate.fourthSection = {};
        dataToUpdate.fourthSection.imageUrl = uploaded.url;
        this.logger.log(`Uploaded fourthSection.imageUrl: ${uploaded.url}`);
      }

      // Upload sixSection.imageUrlDesktop
      if (filesByField['sixSection.imageUrlDesktop']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['sixSection.imageUrlDesktop'],
          'site-content',
        );
        if (!dataToUpdate.sixSection) dataToUpdate.sixSection = {};
        dataToUpdate.sixSection.imageUrlDesktop = uploaded.url;
        this.logger.log(`Uploaded sixSection.imageUrlDesktop: ${uploaded.url}`);
      }

      // Upload sixSection.imageUrlMobile
      if (filesByField['sixSection.imageUrlMobile']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['sixSection.imageUrlMobile'],
          'site-content',
        );
        if (!dataToUpdate.sixSection) dataToUpdate.sixSection = {};
        dataToUpdate.sixSection.imageUrlMobile = uploaded.url;
        this.logger.log(`Uploaded sixSection.imageUrlMobile: ${uploaded.url}`);
      }
    }

    const updated = await this.siteContentModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            fourthSection: dataToUpdate.fourthSection,
            fiveSection: dataToUpdate.fiveSection,
            sixSection: dataToUpdate.sixSection,
          },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`SiteContent avec ID "${id}" non trouvé`);
    }

    return updated;
  }

  /**
   * Step 3: Finaliser avec les sections 7, 8, 9 et 10
   * Gère l'upload des images pour eightSection et tenSection
   */
  async updateStep3(
    id: string,
    dto: UpdateStep3Dto,
    files?: Express.Multer.File[],
  ): Promise<SiteContent> {
    const dataToUpdate: any = { ...dto };

    // Upload des images si des fichiers sont fournis
    if (files && files.length > 0) {
      this.logger.log(`Uploading ${files.length} files for site-content step3`);

      const filesByField: Record<string, Express.Multer.File> = {};
      files.forEach((file) => {
        filesByField[file.fieldname] = file;
      });

      // Upload eightSection.imageUrlDesktop
      if (filesByField['eightSection.imageUrlDesktop']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['eightSection.imageUrlDesktop'],
          'site-content',
        );
        if (!dataToUpdate.eightSection) dataToUpdate.eightSection = {};
        dataToUpdate.eightSection.imageUrlDesktop = uploaded.url;
        this.logger.log(
          `Uploaded eightSection.imageUrlDesktop: ${uploaded.url}`,
        );
      }

      // Upload eightSection.imageUrlMobile
      if (filesByField['eightSection.imageUrlMobile']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['eightSection.imageUrlMobile'],
          'site-content',
        );
        if (!dataToUpdate.eightSection) dataToUpdate.eightSection = {};
        dataToUpdate.eightSection.imageUrlMobile = uploaded.url;
        this.logger.log(
          `Uploaded eightSection.imageUrlMobile: ${uploaded.url}`,
        );
      }

      // Upload tenSection.imageUrlDesktop
      if (filesByField['tenSection.imageUrlDesktop']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['tenSection.imageUrlDesktop'],
          'site-content',
        );
        if (!dataToUpdate.tenSection) dataToUpdate.tenSection = {};
        dataToUpdate.tenSection.imageUrlDesktop = uploaded.url;
        this.logger.log(`Uploaded tenSection.imageUrlDesktop: ${uploaded.url}`);
      }

      // Upload tenSection.imageUrlMobile
      if (filesByField['tenSection.imageUrlMobile']) {
        const uploaded = await this.storageService.uploadFile(
          filesByField['tenSection.imageUrlMobile'],
          'site-content',
        );
        if (!dataToUpdate.tenSection) dataToUpdate.tenSection = {};
        dataToUpdate.tenSection.imageUrlMobile = uploaded.url;
        this.logger.log(`Uploaded tenSection.imageUrlMobile: ${uploaded.url}`);
      }
    }

    const updated = await this.siteContentModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            sevenSection: dataToUpdate.sevenSection,
            eightSection: dataToUpdate.eightSection,
            nineSection: dataToUpdate.nineSection,
            tenSection: dataToUpdate.tenSection,
          },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`SiteContent avec ID "${id}" non trouvé`);
    }

    return updated;
  }

  /* -----------------------------------------------------------
   * 📋 FIND ALL (option: filtrer par type, actif, etc.)
   * Avec population des catégories
   * ----------------------------------------------------------- */
  async findAll(
    filters?: Partial<{ type: string; isActive: boolean }>,
  ): Promise<SiteContent[]> {
    const query: any = {};
    if (filters?.type) query.type = filters.type;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;

    return this.siteContentModel
      .find(query)
      .sort({ sortOrder: 1 })
      .populate('key', 'name slug imageUrl')
      .populate('first.category', 'name slug imageUrl')
      .populate('secondSection.category', 'name slug imageUrl')
      .populate('secondSection.parentCategory', 'name slug imageUrl')
      .populate('thirdSection.category', 'name slug imageUrl')
      .exec();
  }

  /* -----------------------------------------------------------
   * 👁️ FIND ALL VISIBLE (isActive: true uniquement)
   * Route publique avec population des catégories
   * ----------------------------------------------------------- */
  async findAllVisible(type?: string): Promise<SiteContent[]> {
    const query: any = { isActive: true };
    if (type) query.type = type;

    return this.siteContentModel
      .find(query)
      .sort({ sortOrder: 1 })
      .populate('key', 'name slug imageUrl')
      .populate('first.category', 'name slug imageUrl')
      .populate('secondSection.category', 'name slug imageUrl')
      .populate('secondSection.parentCategory', 'name slug imageUrl')
      .populate('thirdSection.category', 'name slug imageUrl')
      .exec();
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

  //find key visible des site content
  // return les categorie
  //  used

  async findKeyVisibleCategories() {
    const keysOfSiteContent = await this.siteContentModel
      .find({
        isActive: true,
      })
      .lean()
      .exec();

    // Extraire les IDs de catégories depuis le champ 'key'
    const categoryIds = keysOfSiteContent
      .map((content) => content.key)
      .filter((key) => key); // Filtrer les valeurs null/undefined

    const findyCategories = await this.categoryModel
      .find({
        _id: { $in: categoryIds },
        isActive: true,
      })
      .lean()
      .exec();

    const transformedCategories = findyCategories.map((category) =>
      this.transformCategory(category, 'fr'),
    );

    return transformedCategories;
  }

  // Extraire les IDs de products
  async findKeyVisibleProducts() {
    const keysOfSiteContent = await this.siteContentModel
      .find({
        isActive: true,
      })
      .lean()
      .exec();

    // Extraire les IDs de produits depuis le champ 'key'
    const productIds = keysOfSiteContent
      .map((content) => content.key)
      .filter((key) => key); // Filtrer les valeurs null/undefined

    const findyProducts = await this.productModel
      .find({
        _id: { $in: productIds },
        isActive: true,
      })
      .lean()
      .exec();

    const transformedProducts = findyProducts.map((product) =>
      this.transformProduct(product, 'fr'),
    );

    return transformedProducts;
  }

  /* -----------------------------------------------------------
   * ✏️ FIND SLUGNAME OF KEY CATEGORIES
   * ----------------------------------------------------------- */

  /**
   * Récupère les catégories primaires utilisées comme `key` dans site-content
   * Renvoie les objets complets des catégories (uniques)
   */

  async findPrimaryCategoriesFromCategoryModel(): Promise<Category[]> {
    return this.categoryModel.find({ isPrimary: true }).lean().exec();
  }

  async findKeyCategoriesSlugname(
    slugname: string,
    language: 'fr' | 'en' = 'fr',
  ) {
    // Trouver la catégorie par slug
    const category = await this.categoryModel
      .findOne({ slug: slugname, isActive: true })
      .lean()
      .exec();

    if (!category) {
      throw new NotFoundException(
        `Catégorie avec slug "${slugname}" non trouvée`,
      );
    }

    // Récupérer le site-content avec toutes les catégories peuplées
    const content = await this.siteContentModel
      .findOne({ key: category._id })
      .populate('key')
      .populate('first.category')
      .populate('secondSection.category')
      .populate('secondSection.parentCategory')
      .populate('thirdSection.category')
      .populate('nineSection.category')
      .lean()
      .exec();

    if (!content) {
      throw new NotFoundException(
        `SiteContent avec key "${category._id}" non trouvé`,
      );
    }

    // ✨ Enrichir manuellement TOUTES les clés étrangères (catégories + produits) de toutes les sections

    // Transformer le site-content et ses catégories selon la langue
    const transformed = this.transformSiteContent(content, language);

    Logger.log('Content found for key category slugname:', transformed);
    return transformed;
  }

  async toggleActive(id: string, isActive: boolean): Promise<SiteContent> {
    const content = await this.siteContentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException(`SiteContent with ID "${id}" not found`);
    }
    content.isActive = isActive;
    return content.save();
  }

  /* -----------------------------------------------------------

  /**
   * Transforme un site-content selon la langue demandée
   * Inclut la transformation de toutes les catégories référencées
   */
  private transformSiteContent(content: any, language: 'fr' | 'en') {
    return {
      _id: content._id,
      type: content.type,
      isActive: content.isActive,
      sortOrder: content.sortOrder,
      key: content.key ? this.transformCategory(content.key, language) : null,
      first: content.first
        ? {
            imageUrlDesktop: content.first.imageUrlDesktop,
            imageUrlMobile: content.first.imageUrlMobile,
            video: content.first.video,
            title:
              content.first.title?.[language] || content.first.title?.fr || '',
            description:
              content.first.description?.[language] ||
              content.first.description?.fr ||
              '',
            button:
              content.first.ctaText?.[language] ||
              content.first.ctaText?.fr ||
              '',
            category: content.first.category
              ? this.transformCategory(content.first.category, language)
              : null,
          }
        : null,
      secondSection: content.secondSection
        ? {
            title:
              content.secondSection.title?.[language] ||
              content.secondSection.title?.fr ||
              '',
            description:
              content.secondSection.description?.[language] ||
              content.secondSection.description?.fr ||
              '',

            button:
              content.secondSection.ctaText?.[language] ||
              content.secondSection.ctaText?.fr ||
              '',
            category: Array.isArray(content.secondSection.category)
              ? (content.secondSection.category as any[]).map((c: any) =>
                  this.transformCategory(c, language),
                )
              : content.secondSection.category
                ? this.transformCategory(
                    content.secondSection.category,
                    language,
                  )
                : null,
            parentCategory: content.secondSection.parentCategory
              ? this.transformCategory(
                  content.secondSection.parentCategory,
                  language,
                )
              : null,
          }
        : null,
      thirdSection: content.thirdSection
        ? {
            imageUrlDesktop: content.thirdSection.imageUrlDesktop,
            imageUrlMobile: content.thirdSection.imageUrlMobile,
            title:
              content.thirdSection.title?.[language] ||
              content.thirdSection.title?.fr ||
              '',
            description:
              content.thirdSection.description?.[language] ||
              content.thirdSection.description?.fr ||
              '',
            category: content.thirdSection.category
              ? this.transformCategory(content.thirdSection.category, language)
              : null,
          }
        : null,
      fourthSection: content.fourthSection
        ? {
            imageUrl: content.fourthSection.imageUrl,
            title:
              content.fourthSection.title?.[language] ||
              content.fourthSection.title?.fr ||
              '',
            description:
              content.fourthSection.description?.[language] ||
              content.fourthSection.description?.fr ||
              '',
            products: (() => {
              const list = content.fourthSection?.products;
              if (!Array.isArray(list)) return [];
              const result: TransformedProduct[] = [];
              for (const prod of list) {
                result.push(this.transformProduct(prod, language));
              }
              return result;
            })(),
          }
        : null,
      fiveSection: content.fiveSection
        ? {
            title:
              content.fiveSection.title?.[language] ||
              content.fiveSection.title?.fr ||
              '',
            button:
              content.fiveSection.ctaText?.[language] ||
              content.fiveSection.ctaText?.fr ||
              '',
            items: content.fiveSection.subCategory,
          }
        : null,
      sixSection: content.sixSection
        ? {
            imageUrlDesktop: content.sixSection.imageUrlDesktop,
            imageUrlMobile: content.sixSection.imageUrlMobile,
            title:
              content.sixSection.title?.[language] ||
              content.sixSection.title?.fr ||
              '',
            description:
              content.sixSection.description?.[language] ||
              content.sixSection.description?.fr ||
              '',
          }
        : null,
      sevenSection: content.sevenSection
        ? {
            title:
              content.sevenSection.title?.[language] ||
              content.sevenSection.title?.fr ||
              '',
            items: content.sevenSection.items,
          }
        : null,
      eightSection: content.eightSection
        ? {
            imageUrlDesktop: content.eightSection.imageUrlDesktop,
            imageUrlMobile: content.eightSection.imageUrlMobile,
            title:
              content.eightSection.title?.[language] ||
              content.eightSection.title?.fr ||
              '',
            description:
              content.eightSection.description?.[language] ||
              content.eightSection.description?.fr ||
              '',
          }
        : null,
      nineSection: content.nineSection
        ? {
            title:
              content.nineSection.title?.[language] ||
              content.nineSection.title?.fr ||
              '',
            items: content.nineSection.subCategory
              ? this.transformCategory(
                  content.nineSection.subCategory,
                  language,
                )
              : null,
          }
        : null,
      tenSection: content.tenSection
        ? {
            imageUrlDesktop: content.tenSection.imageUrlDesktop,
            imageUrlMobile: content.tenSection.imageUrlMobile,
            title:
              content.tenSection.title?.[language] ||
              content.tenSection.title?.fr ||
              '',
            description:
              content.tenSection.description?.[language] ||
              content.tenSection.description?.fr ||
              '',
          }
        : null,
    };
  }

  private transformCategory(
    category: any,
    language: 'fr' | 'en',
  ): TransformedCategory {
    return {
      id: category._id,
      name: category.name?.[language] || category.name?.fr || '',
      slug: category.slug || '',
      description:
        category.description?.[language] || category.description?.fr || '',
      parentId: category.parent || null,
      isActive: category.isActive ?? true,
      isVisible: category.isVisible ?? true,
      children: category.children || [],
      icon: category.icon,
      image: category.image,
      sortOrder: category.sortOrder || 0,
      productCount: category.productCount || 0,
      seoMeta: category.seoMeta
        ? {
            title:
              category.seoMeta.title?.[language] || category.seoMeta.title?.fr,
            description:
              category.seoMeta.description?.[language] ||
              category.seoMeta.description?.fr,
            keywords: category.seoMeta.keywords,
          }
        : undefined,
      metadata: category.metadata,
    };
  }

  private transformProduct(product: any, language: string): TransformedProduct {
    return {
      id: product._id,
      name: product.name?.[language],
      description: product.description?.[language] || '',
      category: product.category || undefined,
      link: product.link,
      variants: product.variants || [],
      // notVariable: product.notVariable || undefined,
      smallDescription: product.smallDescription?.[language],
      slug: product.slug,
      sku: product.sku,
      price: {
        amount: product.price?.amount?.[language] || 0,
        currency: product.price?.currency?.[language],
      },
      solde: product.solde || false,
      promotion: product.promotion
        ? {
            reduced_price: {
              amount: product.promotion.reduced_price?.[language]?.amount || 0,
              currency:
                product.promotion.reduced_price?.[language]?.currency || '',
            },
            pourcentage: product.promotion.pourcentage || 0,
          }
        : undefined,
      isLoading: product.isLoading || false,
      label: product.label?.[language] || '',
      isActive: product.isActive || false,
      isFeatured: product.isFeatured || false,
      seoMeta: {
        title: {
          fr: product.seoMeta?.title?.fr || '',
          en: product.seoMeta?.title?.en || '',
        },
        description: {
          fr: product.seoMeta?.description?.fr || '',
          en: product.seoMeta?.description?.en || '',
        },
        keywords: product.seoMeta?.keywords || [],
      },
    };
  }
}
