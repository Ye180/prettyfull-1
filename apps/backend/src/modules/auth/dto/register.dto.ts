import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: "Email de l'utilisateur",
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe',
    minLength: 6,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @ApiProperty({ example: 'John', description: "Prénom de l'utilisateur" })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: "Nom de l'utilisateur" })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  lastName: string;
}
