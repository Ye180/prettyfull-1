"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const nestjs_better_auth_1 = require("@thallesp/nestjs-better-auth");
const upload_response_dto_1 = require("./dto/upload-response.dto");
const storage_service_1 = require("./storage.service");
const imageFileFilter = (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/i)) {
        callback(new common_1.BadRequestException('Seuls les fichiers images sont autorisés (jpg, jpeg, png, gif, webp)'), false);
        return;
    }
    callback(null, true);
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;
let StorageController = class StorageController {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    async uploadFile(file, folder) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        return this.storageService.uploadFile(file, folder);
    }
    async uploadMultipleFiles(files, folder) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        const uploadedFiles = await this.storageService.uploadMultipleFiles(files, folder);
        return {
            files: uploadedFiles,
            count: uploadedFiles.length,
        };
    }
    async deleteFile(key) {
        const exists = await this.storageService.fileExists(key);
        if (!exists) {
            throw new common_1.NotFoundException('Fichier non trouvé');
        }
        await this.storageService.deleteFile(key);
    }
};
exports.StorageController = StorageController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Upload d'une seule image", summary: "Upload d'une image",
        description: 'Upload une seule image vers Garage Storage (S3-compatible)' }),
    (0, common_1.Post)('upload'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiQuery)({
        name: 'folder',
        required: false,
        description: 'Dossier de destination pour organiser les fichiers',
        example: 'products',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Fichier uploadé avec succès',
        type: upload_response_dto_1.UploadResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Fichier invalide ou manquant',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter: imageFileFilter,
        limits: { fileSize: MAX_FILE_SIZE },
    })),
    openapi.ApiResponse({ status: 201, type: require("./dto/upload-response.dto").UploadResponseDto }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadFile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Upload de plusieurs images", summary: 'Upload de plusieurs images',
        description: 'Upload plusieurs images en une seule requête (max 10 fichiers)' }),
    (0, common_1.Post)('upload/multiple'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiQuery)({
        name: 'folder',
        required: false,
        description: 'Dossier de destination pour organiser les fichiers',
        example: 'products',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Fichiers uploadés avec succès',
        type: upload_response_dto_1.MultipleUploadResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Fichiers invalides ou manquants',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        fileFilter: imageFileFilter,
        limits: { fileSize: MAX_FILE_SIZE },
    })),
    openapi.ApiResponse({ status: 201, type: require("./dto/upload-response.dto").MultipleUploadResponseDto }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Supprimer un fichier", summary: "Suppression d'un fichier",
        description: 'Supprime un fichier de Garage Storage en utilisant sa clé (chemin complet)' }),
    (0, common_1.Delete)(':key'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Fichier supprimé avec succès',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Fichier non trouvé',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "deleteFile", null);
exports.StorageController = StorageController = __decorate([
    (0, swagger_1.ApiTags)('Storage'),
    (0, common_1.Controller)('storage'),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], StorageController);
//# sourceMappingURL=storage.controller.js.map