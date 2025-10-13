import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  ProductDocument,
  ProductSchema,
} from '../../shared/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface TransformedProduct {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: { amount: number; currency: string };
  stock: number;
  category: any;
  images: string[];
  variants: any[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
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
    @InjectModel(ProductSchema.name)
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
    language: string = 'fr',
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
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de produit invalide');
    }

    const result = await this.productModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException('Produit non trouvé');
    }
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
      id: product._id.toString(),
      name: product.name[language] || product.name.fr,
      description: product.description[language] || product.description.fr,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      category: product.category
        ? {
            id: product.category._id.toString(),
            name: product.category.name[language] || product.category.name.fr,
            slug: product.category.slug,
          }
        : null,
      images: product.images || [],
      variants: product.variants || [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
