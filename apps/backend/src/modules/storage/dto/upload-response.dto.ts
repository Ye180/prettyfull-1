import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'URL publique du fichier uploadé',
    example: 'https://s3.garage.example.com/mybucket/products/image-uuid.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Clé du fichier dans le bucket',
    example: 'products/image-uuid.jpg',
  })
  key: string;

  @ApiProperty({
    description: 'Nom du bucket',
    example: 'mybucket',
  })
  bucket: string;

  @ApiProperty({
    description: 'Taille du fichier en bytes',
    example: 125840,
  })
  size: number;

  @ApiProperty({
    description: 'Type MIME du fichier',
    example: 'image/jpeg',
  })
  mimetype: string;
}

export class MultipleUploadResponseDto {
  @ApiProperty({
    type: [UploadResponseDto],
    description: 'Liste des fichiers uploadés',
  })
  files: UploadResponseDto[];

  @ApiProperty({
    description: 'Nombre total de fichiers uploadés',
    example: 3,
  })
  count: number;
}
