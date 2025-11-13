import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AssignDriverDto {
  @ApiProperty({
    description: 'ID du livreur à assigner',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: "L'ID du livreur est requis" })
  @IsMongoId({ message: "L'ID du livreur doit être un ObjectId valide" })
  @IsString()
  driverId: string;

  @ApiProperty({
    description: 'Date de livraison estimée',
    example: '2024-12-25T14:30:00.000Z',
  })
  @IsNotEmpty({ message: 'La date de livraison estimée est requise' })
  @IsDateString(
    {},
    { message: 'La date de livraison doit être une date valide' },
  )
  estimatedDelivery: string;
}
