import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';

import {
  FormatResponse,
  formatResponse,
} from 'src/shared/utils/format-response';
import {
  CategoriesService,
  TransformedCategory,
} from '../categories/categories.service';
import { StorageService } from '../storage';
import { CreateProductDto, VariantsProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

interface ProductVariant {
  id: string;
  color: { label: string; code: string };
  size: string[];
  image: string[];
  quantity: number;
  [key: string]: any;
}

export interface TransformedProduct {
  id: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  category?: TransformedCategory;
  link?: string;
  variants: ProductVariant[];

  smallDescription?: string;
  slug: string;
  sku: string;
  price: {
    amount: {
      fr: number;
      en: number;
    };
    currency: {
      fr: string;
      en: string;
    };
  };
  solde?: boolean;
  promotion?: {
    reduced_price: {
      amount: {
        fr: number;
        en: number;
      };
      currency: {
        fr: string;
        en: string;
      };
    };
    pourcentage: number;
  };
  isLoading?: boolean;
  label?: string;
  isActive: boolean;
  isFeatured: boolean;
  seoMeta: {
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    keywords: string[];
  };
}

export interface PaginatedProducts {
  products: TransformedProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private readonly storageService: StorageService,

    private categoriesService: CategoriesService,
  ) {}

  /**
   * Récupère tous les produits avec pagination et projections i18n
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    language: string = 'fr',
  ): Promise<PaginatedProducts> {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productModel
        .find({ isActive: true })
        .populate('category', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.productModel.countDocuments({ isActive: true }).exec(),
    ]);

    return {
      products: products.map((p) => this.transformProduct(p, language)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupère un produit par son ID avec projection i18n
   */
  async findOne(
    id: string,
    language: string = 'en',
  ): Promise<TransformedProduct> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de produit invalide');
    }

    const product = await this.productModel
      .findById(id)
      .populate('category', 'name slug')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    return this.transformProduct(product, language);
  }

  async findOneBySlug(
    slug: string,
    language: string = 'fr',
  ): Promise<TransformedProduct> {
    if (slug.trim() === '') {
      throw new BadRequestException('Slug de produit invalide');
    }

    const product = await this.productModel
      .findOne({ slug: slug })
      .populate('category', 'name slug')
      .lean()
      .exec();

    //Je veux l'objet de LA catégorie associée à ce produit

    const category = await this.categoriesService.findOne(
      product?.category as string,
      language,
    );

    //Attribution a la categorie produit
    // if (product) {
    //   product.category = category;
    // }

    const newProduct = { ...product, category };

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }
    return this.transformProduct(newProduct, language);
  }

  //find products by category id
  async findByCategoryId(
    categoryId: string,
    language: string = 'fr',
  ): Promise<TransformedProduct[]> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException('ID de catégorie invalide');
    }

    const products = await this.productModel
      .find({ category: categoryId, isActive: true })
      // .populate('category', 'name slug')
      .lean()
      .exec();

    return products.map((product) => this.transformProduct(product, language));
  }

  //find products by category slug
  async findByCategorySlug(
    categorySlug: string,
    language: string = 'fr',
  ): Promise<TransformedProduct[]> {
    const category = await this.categoriesService.findBySlug(
      categorySlug,
      language,
    );

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    const products = await this.productModel
      .find({
        category: category.id.toString(),
        isActive: true,
      })
      // .populate('category', 'name slug')
      .lean()
      .exec();

    return products.map((product) => this.transformProduct(product, language));
  }
  /**
   * Calcule le stock total d'un produit basé sur ses variantes
   */
  private calculateTotalStock(product: {
    variants?: { quantity?: number }[];
    notVariable?: { quantity?: number };
  }): number {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce(
        (total: number, variant: { quantity?: number }) => {
          return total + (variant.quantity || 0);
        },
        0,
      );
    } else if (product.notVariable) {
      return product.notVariable.quantity || 0;
    }
    return 0;
  }

  /**
   * Crée un nouveau produit
   */
  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const product = new this.productModel({
      ...createProductDto,
      category: createProductDto.categoryId,
      price: {
        amount: {
          fr: createProductDto.price.amount.fr,
          en: createProductDto.price.amount.en,
        },
        currency: {
          fr: createProductDto.price.currency.fr,
          en: createProductDto.price.currency.en,
        },
      },
      promotion: createProductDto.promotion
        ? {
            reduced_price: {
              fr: {
                amount: createProductDto.promotion.reduced_price.fr,
                currency: createProductDto.price.currency.fr,
              },
              en: {
                amount: createProductDto.promotion.reduced_price.en,
                currency: createProductDto.price.currency.en,
              },
            },
            pourcentage: createProductDto.promotion.pourcentage,
          }
        : undefined,
    });

    return product.save();
  }

  /**
   * Met à jour un produit
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de produit invalide');
    }

    const updateData: any = { ...updateProductDto };
    if (updateProductDto.categoryId) {
      updateData.category = updateProductDto.categoryId;
      delete updateData.categoryId;
    }

    // Si un price est fourni, s'assurer du bon shape (amount / currency)
    if (updateProductDto.price) {
      // Supporter les deux formes : nouvelle forme { amount, currency } ou ancienne forme { fr, en }
      if ((updateProductDto.price as any).amount) {
        updateData.price = {
          amount: {
            fr: (updateProductDto.price as any).amount.fr,
            en: (updateProductDto.price as any).amount.en,
          },
          currency: {
            fr: (updateProductDto.price as any).currency?.fr,
            en: (updateProductDto.price as any).currency?.en,
          },
        };
      } else {
        // ancienne forme fallback (au cas où)
        updateData.price = {
          amount: {
            fr: (updateProductDto.price as any).fr,
            en: (updateProductDto.price as any).en,
          },
          currency: {
            fr: (updateProductDto.price as any).currency ?? '',
            en: (updateProductDto.price as any).currency ?? '',
          },
        };
      }
    }

    // Le stock sera recalculé automatiquement par le hook pre-update
    const product = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    return product;
  }

  /**
   * Supprime un produit (soft delete)
   */
  async remove(id: string): Promise<FormatResponse<ProductDocument>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de produit invalide');
    }

    const result = await this.productModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException('Produit non trouvé');
    }
    Logger.log(`Produit avec ID ${id} a été désactivé (soft delete).`);

    return formatResponse({
      data: result,
      message: 'Produit désactivé avec succès',
    });
  }

  /**
   * Décrémente le stock d'une variante spécifique ou du produit simple
   */
  async decrementStock(
    productId: string,
    quantity: number,
    selectedVariants?: Record<string, string>,
    session?: ClientSession,
  ): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(productId)
      .session(session as any)
      .exec();

    if (!product) {
      throw new NotFoundException(`Produit non trouvé: ${productId}`);
    }

    const productData = product as any;

    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      // Décrémentation pour un produit avec variantes
      const variantIndex = (productData as ProductDocument).variants?.findIndex(
        (v) => {
          return Object.entries(selectedVariants).every(
            ([key, value]) => v[key]?.code === value || v[key] === value,
          );
        },
      );

      if (variantIndex === -1 || variantIndex === undefined) {
        throw new BadRequestException('Variante non trouvée');
      }

      const variant = productData.variants[variantIndex];
      if (variant.quantity < quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour cette variante du produit ${productData.sku}`,
        );
      }

      // Décrémenter la quantité de la variante
      productData.variants[variantIndex].quantity -= quantity;
    } else {
      // Décrémentation pour un produit simple (notVariable)
      if (!productData.notVariable || !productData.notVariable.quantity) {
        throw new BadRequestException(
          `Produit simple sans stock: ${productData.sku}`,
        );
      }

      if (productData.notVariable.quantity < quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour le produit ${productData.sku}`,
        );
      }

      productData.notVariable.quantity -= quantity;
    }

    // Recalculer le stock total
    productData.stock = this.calculateTotalStock(productData);

    // Sauvegarder avec la session si fournie
    const updatedProduct = await (productData as ProductDocument).save({
      session,
    });

    return updatedProduct;
  }

  /**
   * Init create: create a minimal product document (no variants/images) xof bv
   */
  async initCreate(
    payload: Partial<CreateProductDto>,
  ): Promise<ProductDocument> {
    const doc: any = {
      name: payload.name,
      description: payload.description,
      category: payload.categoryId || undefined,
      slug: payload.slug || undefined,
      sku: payload.sku || undefined,
      price: payload.price || {
        amount: { fr: 0, en: 0 },
        currency: { fr: '', en: '' },
      },
      isActive: payload.isActive ?? true,
      isFeatured: payload.isFeatured ?? false,
      variants: [],
      notVariable: payload.notVariable ? { ...payload.notVariable } : undefined,
      seoMeta: payload.seoMeta || {
        title: { fr: '', en: '' },
        description: { fr: '', en: '' },
        keywords: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const product = new this.productModel(doc);
    return product.save();
  }

  /**
   * Add variants to an existing product (variants contain color/size/quantity, but no files)
   */
  async addVariants({
    productId,
    variants,
    images,
    files,
  }: {
    productId: string;
    variants: VariantsProductDto[];
    images?: Express.Multer.File[];
    files?: Express.Multer.File[];
  }): Promise<ProductDocument> {
    const uploadedFiles = files ?? images ?? [];

    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product id');
    }
    const product = await this.productModel.findById(productId).exec();
    if (!product) throw new NotFoundException('Product not found');

    // Group files by their fieldname
    const filesByField: Record<string, Express.Multer.File[]> = {};
    uploadedFiles.forEach((f) => {
      if (!f || !f.fieldname) return;
      if (!filesByField[f.fieldname]) filesByField[f.fieldname] = [];
      filesByField[f.fieldname]?.push(f);
    });

    // Log pour debug
    Logger.log(
      `Files grouped by field: ${JSON.stringify(Object.keys(filesByField))}`,
    );
    Logger.log(
      `Variants received: ${JSON.stringify(variants.map((v) => v.imageField))}`,
    );

    // Normalize incoming variants and attach proper images per variant
    const normalized = await Promise.all(
      variants.map(async (v, idx) => {
        const next: any = { ...v };

        // If variant already specifies images (URLs) keep them
        if (next.images && next.images.length > 0) {
          delete next.imageField;
          return next;
        }

        // Determine field name for this variant's files
        const fieldName = next.imageField || `images_${idx}`;
        const filesForThisVariant = filesByField[fieldName] || [];

        if (filesForThisVariant.length > 0) {
          // Upload only files for this specific variant
          const uploaded = await this.storageService.uploadMultipleFiles(
            filesForThisVariant,
            'products',
          );
          next.images = uploaded.map((u) => u.url);
        } else {
          // No files for this variant
          next.images = [];
        }

        // Remove helper field before saving
        delete next.imageField;
        return next;
      }),
    );

    product.variants = [...(product.variants || []), ...normalized];
    product.stock = this.calculateTotalStock(product as any);

    return product.save();
  }

  /** */

  /**
   * Transforme un produit pour ne retourner que la langue demandée
   */
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
