import { ApiProperty } from '@nestjs/swagger';
import { CreateSiteContentDto } from './create-site-content.dto';

export class ResponseSiteContentDto extends CreateSiteContentDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
