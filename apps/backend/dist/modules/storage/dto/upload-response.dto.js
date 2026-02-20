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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleUploadResponseDto = exports.UploadResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class UploadResponseDto {
    url;
    key;
    bucket;
    size;
    mimetype;
    static _OPENAPI_METADATA_FACTORY() {
        return { url: { required: true, type: () => String }, key: { required: true, type: () => String }, bucket: { required: true, type: () => String }, size: { required: true, type: () => Number }, mimetype: { required: true, type: () => String } };
    }
}
exports.UploadResponseDto = UploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL publique du fichier uploadé',
        example: 'https://s3.garage.example.com/mybucket/products/image-uuid.jpg',
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clé du fichier dans le bucket',
        example: 'products/image-uuid.jpg',
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du bucket',
        example: 'mybucket',
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Taille du fichier en bytes',
        example: 125840,
    }),
    __metadata("design:type", Number)
], UploadResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type MIME du fichier',
        example: 'image/jpeg',
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "mimetype", void 0);
class MultipleUploadResponseDto {
    files;
    count;
    static _OPENAPI_METADATA_FACTORY() {
        return { files: { required: true, type: () => [require("./upload-response.dto").UploadResponseDto] }, count: { required: true, type: () => Number } };
    }
}
exports.MultipleUploadResponseDto = MultipleUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [UploadResponseDto],
        description: 'Liste des fichiers uploadés',
    }),
    __metadata("design:type", Array)
], MultipleUploadResponseDto.prototype, "files", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre total de fichiers uploadés',
        example: 3,
    }),
    __metadata("design:type", Number)
], MultipleUploadResponseDto.prototype, "count", void 0);
//# sourceMappingURL=upload-response.dto.js.map