// user.schema.ts
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

export enum Language {
  FR = "fr",
  EN = "en",
}

export enum Currency {
  XOF = "XOF",
  USD = "USD",
}

// Interface User complète
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  preferredLanguage: Language;
  preferredCurrency: Currency;
  avatar?: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// update-user.dto.ts
export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isEmailVerified?: boolean;
}

//  create-user.dto.ts
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
  avatar?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
