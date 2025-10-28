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

export interface TransformedProduct {
  id: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  category?: string;
  link?: string;
  variable?: {
    color: { label: string; code: string };
    size: string[];
    image: string[];
    quantity: number;
  }[];
  notVariable?: {
    color?: { label: string; code: string };
    size: string[];
    image: string[];
    quantity?: number;
  };
  smallDescription?: string;
  sku: string;
  price: { amount: 0; currency: string };
  solde?: boolean;
  promotion?: { reduced_price: number; pourcentage: number };
  isLoading?: boolean;
  label?: string;
  isActive: true;
  isFeatured: true;
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

  /**
   * Crée un nouveau produit
   */
  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const product = new this.productModel({
      ...createProductDto,
      category: createProductDto.categoryId,
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
   * Décrémente le stock d'un produit (utilisé par OrdersService)
   */
  async decrementStock(
    productId: string,
    quantity: number,
    session?: ClientSession,
  ): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } },
        { new: true, session },
      )
      .exec();

    if (!product) {
      throw new NotFoundException(`Produit non trouvé: ${productId}`);
    }

    if (product.stock < 0) {
      throw new BadRequestException(
        `Stock insuffisant pour le produit ${product.sku}`,
      );
    }

    return product;
  }

  /**
   * Transforme un produit pour ne retourner que la langue demandée
   */
  private transformProduct(product: any, language: string): TransformedProduct {
    return {
      id: product._id,
      name: product.name[language],
      description: product.description[language],
      category: product.category ? product.categoryId : undefined,
      link: product.link,
      variable: product.variable,
      notVariable: product.notVariable,
      smallDescription: product.smallDescription[language],
      sku: product.sku,
      price: product.price,
      solde: product.solde,
      promotion: product.promotion,
      isLoading: product.isLoading,
      label: product.label,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      seoMeta: product.seoMeta,
    };
  }
}
