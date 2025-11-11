import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import {
  MultipleUploadResponseDto,
  UploadResponseDto,
} from './dto/upload-response.dto';
import { StorageService } from './storage.service';

// Validation des fichiers
const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // allow case-insensitive mime types (e.g. IMAGE/JPEG)
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/i)) {
    callback(
      new BadRequestException(
        'Seuls les fichiers images sont autorisés (jpg, jpeg, png, gif, webp)',
      ),
      false,
    );
    return;
  }
  callback(null, true);
};

// Limite de taille : 5MB par défaut
const MAX_FILE_SIZE = 5 * 1024 * 1024;

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Upload d'une seule image
   */
  @Post('upload')
  @AllowAnonymous()
  @ApiOperation({
    summary: "Upload d'une image",
    description: 'Upload une seule image vers Garage Storage (S3-compatible)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image à uploader',
        },
        folder: {
          type: 'string',
          description: 'Dossier de destination (optionnel)',
          example: 'products',
        },
      },
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'Dossier de destination pour organiser les fichiers',
    example: 'products',
  })
  @ApiResponse({
    status: 201,
    description: 'Fichier uploadé avec succès',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fichier invalide ou manquant',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    return this.storageService.uploadFile(file, folder);
  }

  /**
   * Upload de plusieurs images
   */
  @Post('upload/multiple')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Upload de plusieurs images',
    description:
      'Upload plusieurs images en une seule requête (max 10 fichiers)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Fichiers images à uploader (max 10)',
        },
        folder: {
          type: 'string',
          description: 'Dossier de destination (optionnel)',
          example: 'products',
        },
      },
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'Dossier de destination pour organiser les fichiers',
    example: 'products',
  })
  @ApiResponse({
    status: 201,
    description: 'Fichiers uploadés avec succès',
    type: MultipleUploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fichiers invalides ou manquants',
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ): Promise<MultipleUploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const uploadedFiles = await this.storageService.uploadMultipleFiles(
      files,
      folder,
    );

    return {
      files: uploadedFiles,
      count: uploadedFiles.length,
    };
  }

  /**
   * Supprimer un fichier
   */
  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Suppression d'un fichier",
    description:
      'Supprime un fichier de Garage Storage en utilisant sa clé (chemin complet)',
  })
  @ApiResponse({
    status: 204,
    description: 'Fichier supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Fichier non trouvé',
  })
  async deleteFile(@Param('key') key: string): Promise<void> {
    // Vérifier si le fichier existe avant de le supprimer
    const exists = await this.storageService.fileExists(key);
    if (!exists) {
      throw new NotFoundException('Fichier non trouvé');
    }

    await this.storageService.deleteFile(key);
  }
}
