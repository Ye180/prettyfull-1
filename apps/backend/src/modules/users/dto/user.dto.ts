import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import {
  Currency,
  Language,
  UserRole,
  UserStatus,
} from '../schemas/user.schema';

// Base DTO - La source de vérité pour tous les DTOs User
export class UserDto {
  @ApiProperty({ description: 'User unique identifier' })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User first name', minLength: 2 })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ description: 'User last name', minLength: 2 })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'User avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'User bio/description' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'User status', enum: UserStatus })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({ description: 'Preferred language', enum: Language })
  @IsEnum(Language)
  preferredLanguage: Language;

  @ApiProperty({ description: 'Preferred currency', enum: Currency })
  @IsEnum(Currency)
  preferredCurrency: Currency;

  @ApiProperty({ description: 'Email verification status' })
  @IsBoolean()
  isEmailVerified: boolean;

  @ApiPropertyOptional({ description: 'Last login timestamp' })
  @IsOptional()
  @IsDate()
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Account creation timestamp' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Account last update timestamp' })
  @IsDate()
  updatedAt: Date;
}

// DTO pour la création d'utilisateur - champs requis seulement
export class CreateUserDto extends PickType(UserDto, [
  'email',
  'firstName',
  'lastName',
  'phone',
  'avatar',
  'bio',
  'preferredLanguage',
  'preferredCurrency',
] as const) {
  // Ajout du mot de passe uniquement pour la création
  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

// DTO pour la mise à jour - tous les champs optionnels sauf ID et timestamps
export class UpdateUserDto extends PartialType(
  PickType(UserDto, [
    'firstName',
    'lastName',
    'phone',
    'avatar',
    'bio',
    'preferredLanguage',
    'preferredCurrency',
  ] as const),
) {}

// DTO pour les réponses publiques - informations minimales
export class PublicUserDto extends PickType(UserDto, [
  'id',
  'firstName',
  'lastName',
  'avatar',
] as const) {}

// DTO pour les réponses d'administration - toutes les infos sauf mot de passe
export class UserResponseDto extends OmitType(UserDto, [
  'updatedAt',
] as const) {}

// DTO pour les profils utilisateur - infos publiques étendues
export class UserProfileDto extends PickType(UserDto, [
  'id',
  'firstName',
  'lastName',
  'avatar',
  'bio',
  'createdAt',
] as const) {}
