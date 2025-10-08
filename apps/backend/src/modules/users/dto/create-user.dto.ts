import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../shared/schemas/user.schema';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  firstName: string;

  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: "L'avatar doit être une chaîne de caractères" })
  avatar?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date de naissance invalide' })
  dateOfBirth?: string;

  @IsOptional()
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
