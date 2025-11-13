import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class ValidateDeliveryDto {
  @ApiProperty({
    description: 'Code de validation à 6 caractères alphanumériques',
    example: 'ABC123',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty({ message: 'Le code de validation est requis' })
  @IsString()
  @Length(6, 6, {
    message: 'Le code de validation doit contenir exactement 6 caractères',
  })
  @Matches(/^[A-Z0-9]{6}$/, {
    message:
      'Le code de validation doit contenir uniquement des lettres majuscules et des chiffres',
  })
  validationCode: string;

  @ApiPropertyOptional({
    description: 'Note de livraison du livreur',
    example: 'Colis remis en main propre',
  })
  @IsOptional()
  @IsString()
  deliveryNote?: string;

  @ApiPropertyOptional({
    description: 'URL de la photo de signature/preuve de livraison',
    example: 'https://storage.example.com/signatures/abc123.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: "L'URL de signature doit être une URL valide" })
  signatureUrl?: string;
}
