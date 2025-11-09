import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as path from 'path';

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly endpoint: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    // Configuration Garage Storage (S3-compatible)
    this.endpoint = this.configService.get<string>('GARAGE_ENDPOINT') || '';
    this.region = this.configService.get<string>('GARAGE_REGION', 'garage');
    this.bucket = this.configService.get<string>('GARAGE_BUCKET') || '';
    this.publicUrl = this.configService.get<string>('GARAGE_PUBLIC_URL') || '';

    const accessKeyId = this.configService.get<string>('GARAGE_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('GARAGE_SECRET_KEY');

    if (!this.endpoint || !accessKeyId || !secretAccessKey || !this.bucket) {
      throw new Error(
        'Missing Garage storage configuration. Please check your .env file.',
      );
    }

    // Initialisation du client S3 pour Garage
    // Note: Garage peut nécessiter un endpoint avec le bucket dans le hostname
    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
      tls: this.endpoint.startsWith('https'), // Auto-detect TLS depuis l'endpoint
    });

    this.logger.log(
      `Storage service initialized with endpoint: ${this.endpoint}`,
    );
  }

  /**
   * Upload un fichier vers Garage Storage
   * @param file - Le fichier à uploader (Buffer ou Stream)
   * @param folder - Dossier de destination (optionnel, ex: 'products', 'users')
   * @param filename - Nom du fichier (optionnel, génère un UUID si non fourni)
   */
  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
    filename?: string,
  ): Promise<UploadResult> {
    try {
      // Générer un nom de fichier unique si non fourni
      const fileExtension = path.extname(file.originalname);
      const baseFilename = filename || randomUUID();
      const key = folder
        ? `${folder}/${baseFilename}${fileExtension}`
        : `${baseFilename}${fileExtension}`;

      this.logger.debug(`Uploading file to: ${key}`);

      // Upload simple avec PutObjectCommand (compatible Garage)
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL public pour accès direct
        ACL: 'public-read',
        // Désactiver les checksums qui peuvent causer des problèmes avec Garage
        ChecksumAlgorithm: undefined,
      });

      await this.s3Client.send(command);

      // Construire l'URL publique
      const url = `${this.publicUrl}/${this.bucket}/${key}`;

      const result: UploadResult = {
        url,
        key,
        bucket: this.bucket,
        size: file.size,
        mimetype: file.mimetype,
      };

      this.logger.log(`File uploaded successfully: ${url}`);
      return result;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload file: ${err.message}`, err.stack);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Supprimer un fichier de Garage Storage
   * @param key - La clé du fichier (chemin complet dans le bucket)
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete file: ${err.message}`, err.stack);
      throw error;
    }
  }

  /**
   * Supprimer plusieurs fichiers
   */
  async deleteMultipleFiles(keys: string[]): Promise<void> {
    const deletePromises = keys.map((key) => this.deleteFile(key));
    await Promise.all(deletePromises);
  }

  /**
   * Vérifier si un fichier existe
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      const err = error as any;
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Obtenir les métadonnées d'un fichier
   */
  async getFileMetadata(key: string) {
    try {
      const command = new HeadObjectCommand({
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
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to get file metadata: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Obtenir l'URL publique d'un fichier
   */
  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${this.bucket}/${key}`;
  }

  /**
   * Extraire la clé depuis une URL publique
   */
  extractKeyFromUrl(url: string): string | null {
    try {
      const bucketPath = `/${this.bucket}/`;
      const index = url.indexOf(bucketPath);
      if (index !== -1) {
        return url.substring(index + bucketPath.length);
      }
      return null;
    } catch {
      this.logger.error(`Failed to extract key from URL: ${url}`);
      return null;
    }
  }
}
