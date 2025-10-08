import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../schemas/user.schema';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Statut invalide' })
  status?: UserStatus;

  @IsOptional()
  isEmailVerified?: boolean;
}
