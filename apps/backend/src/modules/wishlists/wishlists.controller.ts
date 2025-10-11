import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Request,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getWishlist(@Request() req: any) {
    const userId = req.user?.id || 'temp-user-id';
    return this.wishlistsService.getWishlist(userId);
  }

  @Post(':productId')
  async addToWishlist(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.wishlistsService.addToWishlist(userId, productId);
  }

  @Delete(':productId')
  async removeFromWishlist(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.wishlistsService.removeFromWishlist(userId, productId);
  }

  @Delete()
  async clearWishlist(@Request() req: any) {
    const userId = req.user?.id || 'temp-user-id';
    return this.wishlistsService.clearWishlist(userId);
  }

  @Get('check/:productId')
  async isInWishlist(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    const isInWishlist = await this.wishlistsService.isInWishlist(userId, productId);
    return { productId, isInWishlist };
  }
}
