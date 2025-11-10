import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AllowAnonymous, Roles, Session } from '@thallesp/nestjs-better-auth';
import { CreateProductDto, VariantsProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /products - Public
   * Liste tous les produits avec pagination
   */
  @Get()
  @AllowAnonymous()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.productsService.findAll(page, limit, language);
  }

  /**
   * GET /products/:id - Public
   * Récupère un produit par son ID
   */
  @Get(':id')
  @AllowAnonymous()
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.productsService.findOne(id, language);
  }

  @Get('slugname/:slug')
  @AllowAnonymous()
  async findOneBySlug(
    @Param('slug') slug: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.productsService.findOneBySlug(slug, language);
  }

  /**
   * POST /products - Admin only
   * Crée un nouveau produit avec upload d'images
   */
  // @Post()
  // // @Roles(['admin'])
  // @AllowAnonymous()
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       productData: {
  //         type: 'string',
  //         description: 'JSON stringifié des données du produit',
  //       },
  //       images: {
  //         type: 'array',
  //         items: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //         description: 'Images du produit',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(
  //   FilesInterceptor('images', 20, {
  //     fileFilter: (req, file, callback) => {
  //       if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/i)) {
  //         callback(
  //           new Error('Seuls les fichiers images sont autorisés'),
  //           false,
  //         );
  //         return;
  //       }
  //       callback(null, true);
  //     },
  //     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  //   }),
  // )
  // async create(
  //   @Body('productData') createProductDto: CreateProductDto,
  //   @UploadedFiles() images: Express.Multer.File[],
  //   // @Session() session: UserSession,
  // ) {
  //   return this.productsService.create(createProductDto, images);
  // }

  /**
   * POST /products/init-create-product
   * Create minimal product (init), returns created product (id...)KD
   */
  @Post('init-create-product')
  // @Roles(['admin'])
  @AllowAnonymous()
  async initCreate(@Body() payload: Partial<CreateProductDto>) {
    // Basic validation
    if (!payload?.name || !payload?.description) {
      throw new BadRequestException('name and description are required');
    }
    return this.productsService.initCreate(payload);
  }

  /**
   * PATCH /products/add-product-variant/:id
   * Add one or more variants (no images) to an existing product
   * body: { variants: VariableProductDto[] }
   */
  // SS
  @Post('add-product-variant/:id')
  @UseInterceptors(FilesInterceptor('images'))
  // @Roles(['admin'])
  @AllowAnonymous()
  async addVariants(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() variant: VariantsProductDto,
    @Param('id') productId: string,
  ) {
    return this.productsService.addVariants({
      productId,
      variant,
      images,
    });
  }

  /**
   * PATCH /products/:id - Admin only
   * Met à jour un produit
   */
  @Patch(':id')
  @Roles(['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Session() session: UserSession,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * PUT /products/bind-image-product/:id
   * Upload images and bind them to variants or notVariable.
   * Expects multipart/form-data with files field name "images" (multiple).
   * Optional body field "imagesMap": JSON string that maps originalname => target
   * Example imagesMap:
   * [
   *   { "filename": "img1.jpg", "target": { "type":"variable", "index":0 } },
   *   { "filename": "img2.jpg", "target": { "type":"notVariable" } }
   * ]
   */
  // @Put('bind-image-product/:id')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       images: {
  //         type: 'array',
  //         items: { type: 'string', format: 'binary' },
  //       },
  //       imagesMap: {
  //         type: 'string',
  //         description: 'JSON string mapping filenames to targets',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(
  //   FilesInterceptor('images', 50, {
  //     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for example
  //   }),
  // )
  // // @Roles(['admin'])
  // @AllowAnonymous()
  // async bindImages(
  //   @Param('id') id: string,
  //   @UploadedFiles() images: Express.Multer.File[],
  //   @Body('imagesMap') imagesMapStr?: string,
  // ) {
  //   const imagesMap = imagesMapStr ? JSON.parse(imagesMapStr) : undefined;
  //   return this.productsService.bindImages(id, images || [], imagesMap);
  // }

  /**
   * DELETE /products/:id - Admin only
   * Supprime un produit (soft delete)
   */
  @Delete(':id')
  @Roles(['admin'])
  async remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.productsService.remove(id);
  }
}
