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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

interface ProductVariant {
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
  category?: string;
  link?: string;
  variable?: ProductVariant[];
  notVariable?: {
    color?: { label: string; code: string };
    size: string[];
    image: string[];
    quantity?: number;
  };
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

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    return this.transformProduct(product, language);
  }

  /**
   * Calcule le stock total d'un produit basé sur ses variantes
   */
  private calculateTotalStock(product: {
    variable?: { quantity?: number }[];
    notVariable?: { quantity?: number };
  }): number {
    if (product.variable && product.variable.length > 0) {
      return product.variable.reduce(
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
      const variantIndex = (productData as ProductDocument).variable?.findIndex(
        (v: ProductVariant) => {
          return Object.entries(selectedVariants).every(
            ([key, value]) => v[key]?.code === value || v[key] === value,
          );
        },
      );

      if (variantIndex === -1 || variantIndex === undefined) {
        throw new BadRequestException('Variante non trouvée');
      }

      const variant = productData.variable[variantIndex];
      if (variant.quantity < quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour cette variante du produit ${productData.sku}`,
        );
      }

      // Décrémenter la quantité de la variante
      productData.variable[variantIndex].quantity -= quantity;
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
   * Transforme un produit pour ne retourner que la langue demandée
   */
  private transformProduct(product: any, language: string): TransformedProduct {
    return {
      id: product._id,
      name: product.name?.[language],
      description: product.description?.[language] || '',
      category: product.category || undefined,
      link: product.link,
      variable: product.variable || [],
      notVariable: product.notVariable || undefined,
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
