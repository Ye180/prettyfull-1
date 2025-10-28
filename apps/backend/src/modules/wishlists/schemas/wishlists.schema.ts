import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

/** * Schéma de liste de souhaits utilisateur
 */
@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  productIds: Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

// Index pour les performances
WishlistSchema.index({ userId: 1 });
