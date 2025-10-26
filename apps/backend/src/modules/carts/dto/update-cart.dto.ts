import { PartialType } from '@nestjs/mapped-types';
import { CartItemDto } from './cart.dto';

export class UpdateCartDto extends PartialType(CartItemDto) {}
