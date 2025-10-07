import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phone?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop()
  avatar?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({
    type: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  })
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Prop({ default: Date.now })
  lastLoginAt?: Date;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hook pre-save pour hasher le mot de passe
UserSchema.pre<UserDocument>('save', async function (next) {
  // Ne hashe que si le mot de passe a été modifié
  if (!this.isModified('password')) return next();

  try {
    // Hash le mot de passe avec un salt de 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
