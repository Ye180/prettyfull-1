"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const path = __importStar(require("path"));
let StorageService = StorageService_1 = class StorageService {
    configService;
    logger = new common_1.Logger(StorageService_1.name);
    s3Client;
    bucket;
    region;
    endpoint;
    publicUrl;
    constructor(configService) {
        this.configService = configService;
        this.endpoint = this.configService.get('GARAGE_ENDPOINT') || '';
        this.region = this.configService.get('GARAGE_REGION', 'garage');
        this.bucket = this.configService.get('GARAGE_BUCKET') || '';
        this.publicUrl = this.configService.get('GARAGE_PUBLIC_URL') || '';
        const accessKeyId = this.configService.get('GARAGE_ACCESS_KEY');
        const secretAccessKey = this.configService.get('GARAGE_SECRET_KEY');
        if (!this.endpoint || !accessKeyId || !secretAccessKey || !this.bucket) {
            throw new Error('Missing Garage storage configuration. Please check your .env file.');
        }
        this.s3Client = new client_s3_1.S3Client({
            endpoint: this.endpoint,
            region: this.region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true,
        });
        this.logger.log(`Storage service initialized with endpoint: ${this.endpoint}`);
    }
    async uploadFile(file, folder, filename) {
        try {
            const fileExtension = path.extname(file.originalname);
            const baseFilename = filename || (0, crypto_1.randomUUID)();
            const key = folder
                ? `${folder}/${baseFilename}${fileExtension}`
                : `${baseFilename}${fileExtension}`;
            this.logger.debug(`Uploading file to: ${key}`);
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
                ChecksumAlgorithm: undefined,
            });
            await this.s3Client.send(command);
            const url = `${this.publicUrl}/${this.bucket}/${key}`;
            const result = {
                url,
                key,
                bucket: this.bucket,
                size: file.size,
                mimetype: file.mimetype,
            };
            this.logger.log(`File uploaded successfully: ${url}`);
            return result;
        }
        catch (error) {
            const err = error;
            this.logger.error(`Failed to upload file: ${err.message}`, err.stack);
            throw error;
        }
    }
    async uploadMultipleFiles(files, folder) {
        const uploadPromises = files.map((file) => this.uploadFile(file, folder));
        return Promise.all(uploadPromises);
    }
    async deleteFile(key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            await this.s3Client.send(command);
            this.logger.log(`File deleted successfully: ${key}`);
        }
        catch (error) {
            const err = error;
            this.logger.error(`Failed to delete file: ${err.message}`, err.stack);
            throw error;
        }
    }
    async deleteMultipleFiles(keys) {
        const deletePromises = keys.map((key) => this.deleteFile(key));
        await Promise.all(deletePromises);
    }
    async fileExists(key) {
        try {
            const command = new client_s3_1.HeadObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            await this.s3Client.send(command);
            return true;
        }
        catch (error) {
            const err = error;
            if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
                return false;
            }
            throw error;
        }
    }
    async getFileMetadata(key) {
        try {
            const command = new client_s3_1.HeadObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            const response = await this.s3Client.send(command);
            return {
                size: response.ContentLength,
                contentType: response.ContentType,
                lastModified: response.LastModified,
                etag: response.ETag,
            };
        }
        catch (error) {
            const err = error;
            this.logger.error(`Failed to get file metadata: ${err.message}`, err.stack);
            throw error;
        }
    }
    getPublicUrl(key) {
        return `${this.publicUrl}/${this.bucket}/${key}`;
    }
    extractKeyFromUrl(url) {
        try {
            const bucketPath = `/${this.bucket}/`;
            const index = url.indexOf(bucketPath);
            if (index !== -1) {
                return url.substring(index + bucketPath.length);
            }
            return null;
        }
        catch {
            this.logger.error(`Failed to extract key from URL: ${url}`);
            return null;
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map