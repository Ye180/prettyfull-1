import { IsBoolean, IsOptional, IsString } from 'class-validator';
// --- Sous-DTOs ---

export class AddressDto {
  @IsString()
  fullName: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsString()
  @IsOptional()
  userId?: string;
}
