import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  street: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  postalCode: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;
}

export const AddressSchemaDefinition = SchemaFactory.createForClass(Address);
