# Storage Module - Garage S3 Upload Guide

## 📋 Vue d'ensemble

Module NestJS pour gérer les uploads de fichiers vers **Garage Storage** (compatible S3). Conçu spécifiquement pour uploader des images vers un serveur Garage sur le port **3903**.

## 🏗️ Architecture

```
modules/storage/
├── storage.module.ts           # Configuration du module
├── storage.service.ts          # Service de gestion des uploads S3
├── storage.controller.ts       # Endpoints API REST
└── dto/
    └── upload-response.dto.ts  # DTOs de réponse
```

## ⚙️ Configuration

### 1. Variables d'environnement

Ajouter dans `/apps/backend/.env` :

```bash
# Garage Storage (S3-compatible Object Storage)
GARAGE_ENDPOINT=http://localhost:3903
GARAGE_REGION=garage
GARAGE_BUCKET=prettyfull-images
GARAGE_ACCESS_KEY=your-garage-access-key
GARAGE_SECRET_KEY=your-garage-secret-key
GARAGE_PUBLIC_URL=http://localhost:3903
```

### 2. Configuration Garage Storage

#### Obtenir les credentials :

```bash
# Se connecter au serveur Garage
# Créer un bucket
garage bucket create prettyfull-images

# Créer une clé d'accès
garage key create prettyfull-api-key

# Permettre l'accès au bucket
garage bucket allow --read --write prettyfull-images --key prettyfull-api-key

# Rendre le bucket public pour les lectures
garage bucket website --allow prettyfull-images
```

### 3. Dépendances installées

```json
{
  "@aws-sdk/client-s3": "^3.927.0",
  "@aws-sdk/lib-storage": "^3.927.0",
  "multer": "^2.0.2",
  "@types/multer": "^2.0.0",
  "@nestjs/swagger": "^11.x.x"
}
```

## 📡 API Endpoints

### 1. Upload d'une seule image

**POST** `/api/v1/storage/upload`

**Headers:**

```
Content-Type: multipart/form-data
```

**Body (form-data):**

- `file`: Image file (required)
- `folder`: Destination folder (optional, query param)

**Query Parameters:**

- `folder` (optional): Dossier de destination (ex: `products`, `users`, `categories`)

**Response 201:**

```json
{
  "url": "http://localhost:3903/prettyfull-images/products/uuid-image.jpg",
  "key": "products/uuid-image.jpg",
  "bucket": "prettyfull-images",
  "size": 125840,
  "mimetype": "image/jpeg"
}
```

**Exemple avec curl:**

```bash
curl -X POST http://localhost:3001/api/v1/storage/upload?folder=products \
  -F "file=@/path/to/image.jpg"
```

**Exemple avec Postman:**

1. Méthode: POST
2. URL: `http://localhost:3001/api/v1/storage/upload?folder=products`
3. Body > form-data
4. Key: `file`, Type: File
5. Select file

### 2. Upload de plusieurs images

**POST** `/api/v1/storage/upload/multiple`

**Body (form-data):**

- `files`: Multiple image files (max 10)
- `folder`: Destination folder (optional, query param)

**Response 201:**

```json
{
  "files": [
    {
      "url": "http://localhost:3903/prettyfull-images/products/uuid-1.jpg",
      "key": "products/uuid-1.jpg",
      "bucket": "prettyfull-images",
      "size": 125840,
      "mimetype": "image/jpeg"
    },
    {
      "url": "http://localhost:3903/prettyfull-images/products/uuid-2.jpg",
      "key": "products/uuid-2.jpg",
      "bucket": "prettyfull-images",
      "size": 89432,
      "mimetype": "image/png"
    }
  ],
  "count": 2
}
```

**Exemple avec curl:**

```bash
curl -X POST http://localhost:3001/api/v1/storage/upload/multiple?folder=products \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

### 3. Suppression d'un fichier

**DELETE** `/api/v1/storage/:key`

**Exemple:**

```bash
DELETE /api/v1/storage/products/uuid-image.jpg
```

**Response 204:** No Content

**Exemple avec curl:**

```bash
curl -X DELETE http://localhost:3001/api/v1/storage/products/uuid-image.jpg
```

## 🔧 Utilisation du Service

### Dans un autre module

```typescript
import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ProductsService {
  constructor(private readonly storageService: StorageService) {}

  async updateProductImage(file: Express.Multer.File, productId: string) {
    // Upload de l'image
    const result = await this.storageService.uploadFile(file, 'products');

    // Utiliser result.url pour sauvegarder dans la base de données
    console.log('Image URL:', result.url);
    console.log('Storage key:', result.key);

    return result;
  }

  async deleteProductImage(imageUrl: string) {
    // Extraire la clé depuis l'URL
    const key = this.storageService.extractKeyFromUrl(imageUrl);

    if (key) {
      await this.storageService.deleteFile(key);
    }
  }
}
```

### Méthodes disponibles

```typescript
// Upload d'un fichier
async uploadFile(
  file: Express.Multer.File,
  folder?: string,
  filename?: string
): Promise<UploadResult>

// Upload de plusieurs fichiers
async uploadMultipleFiles(
  files: Express.Multer.File[],
  folder?: string
): Promise<UploadResult[]>

// Suppression d'un fichier
async deleteFile(key: string): Promise<void>

// Suppression de plusieurs fichiers
async deleteMultipleFiles(keys: string[]): Promise<void>

// Vérifier si un fichier existe
async fileExists(key: string): Promise<boolean>

// Obtenir les métadonnées
async getFileMetadata(key: string): Promise<{
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
}>

// Obtenir l'URL publique
getPublicUrl(key: string): string

// Extraire la clé depuis une URL
extractKeyFromUrl(url: string): string | null
```

## 🛡️ Validation et Limites

### Types de fichiers autorisés

- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ GIF (.gif)
- ✅ WebP (.webp)

### Limites

- Taille max par fichier: **5 MB**
- Nombre max de fichiers (multi-upload): **10 fichiers**

### Modification des limites

Dans `storage.controller.ts`:

```typescript
// Modifier la taille max
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Modifier le nombre de fichiers
@UseInterceptors(
  FilesInterceptor('files', 20, { // Max 20 fichiers
    fileFilter: imageFileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  }),
)
```

### Ajouter d'autres types de fichiers

```typescript
const documentFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Accepter images + PDFs
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
    callback(new BadRequestException('Type de fichier non autorisé'), false);
    return;
  }
  callback(null, true);
};
```

## 📂 Organisation des fichiers

### Structure recommandée

```
prettyfull-images/
├── products/
│   ├── uuid-1.jpg
│   ├── uuid-2.png
│   └── ...
├── users/
│   ├── avatar-uuid-1.jpg
│   └── ...
├── categories/
│   └── ...
└── site-content/
    └── ...
```

### Utilisation des dossiers

```typescript
// Upload dans le dossier "products"
await storageService.uploadFile(file, 'products');

// Upload dans le dossier "users"
await storageService.uploadFile(file, 'users');

// Upload à la racine du bucket
await storageService.uploadFile(file);
```

## 🔐 Sécurité

### ACL et Permissions

Les fichiers sont uploadés avec `ACL: 'public-read'` pour permettre un accès direct via URL.

Pour modifier les permissions:

```typescript
// Dans storage.service.ts, méthode uploadFile()
const upload = new Upload({
  client: this.s3Client,
  params: {
    Bucket: this.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private', // Changer ici
  },
});
```

### Options ACL disponibles:

- `public-read`: Lecture publique, écriture privée
- `private`: Accès privé uniquement
- `public-read-write`: Lecture et écriture publiques (non recommandé)
- `authenticated-read`: Lecture pour utilisateurs authentifiés

## 🧪 Tests

### Test avec curl

```bash
# Upload simple
curl -X POST http://localhost:3001/api/v1/storage/upload?folder=test \
  -F "file=@test-image.jpg" \
  -v

# Upload multiple
curl -X POST http://localhost:3001/api/v1/storage/upload/multiple?folder=test \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -v

# Suppression
curl -X DELETE http://localhost:3001/api/v1/storage/test/uuid-image.jpg \
  -v
```

### Test avec HTTPie

```bash
# Installation
pip install httpie

# Upload
http -f POST http://localhost:3001/api/v1/storage/upload?folder=test \
  file@test-image.jpg

# Suppression
http DELETE http://localhost:3001/api/v1/storage/test/uuid-image.jpg
```

## 🚨 Gestion des erreurs

### Erreurs courantes

| Code | Erreur                       | Solution                                            |
| ---- | ---------------------------- | --------------------------------------------------- |
| 400  | Aucun fichier fourni         | Vérifier que le champ `file` ou `files` est présent |
| 400  | Type de fichier non autorisé | Uploader une image (jpg, png, gif, webp)            |
| 400  | Fichier trop volumineux      | Réduire la taille (max 5MB)                         |
| 404  | Fichier non trouvé           | Vérifier la clé du fichier                          |
| 500  | Erreur serveur Garage        | Vérifier la connexion à Garage et les credentials   |

### Logs

Les logs sont disponibles dans la console NestJS:

```bash
[StorageService] Storage service initialized with endpoint: http://localhost:3903
[StorageService] Uploading file to: products/uuid-image.jpg
[StorageService] File uploaded successfully: http://localhost:3903/prettyfull-images/products/uuid-image.jpg
```

## 🔄 Intégration avec d'autres modules

### Exemple: Module Products

```typescript
// products.controller.ts
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storageService: StorageService,
  ) {}

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Upload vers Garage
    const uploadResult = await this.storageService.uploadFile(file, 'products');

    // Sauvegarder l'URL dans le produit
    await this.productsService.updateProductImage(id, uploadResult.url);

    return {
      message: 'Image uploaded successfully',
      imageUrl: uploadResult.url,
    };
  }

  @Delete(':id/image')
  async deleteProductImage(@Param('id') id: string) {
    const product = await this.productsService.findById(id);

    if (product.imageUrl) {
      const key = this.storageService.extractKeyFromUrl(product.imageUrl);
      if (key) {
        await this.storageService.deleteFile(key);
      }
    }

    await this.productsService.updateProductImage(id, null);

    return { message: 'Image deleted successfully' };
  }
}
```

## 📚 Ressources

- [Garage Documentation](https://garagehq.deuxfleurs.fr/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [Multer Documentation](https://github.com/expressjs/multer)

## 📝 Notes importantes

1. **UUID automatique**: Si aucun nom de fichier n'est fourni, un UUID est généré automatiquement
2. **Extensions préservées**: L'extension du fichier original est toujours conservée
3. **Pas de collision**: Les UUID garantissent l'unicité des noms de fichiers
4. **URLs publiques**: Les fichiers sont accessibles directement via leur URL
5. **Pas de cache**: Les fichiers sont servis directement depuis Garage
6. **Performance**: Utilisez le multi-upload pour plusieurs fichiers simultanés

## 🎯 Next Steps

- [ ] Ajouter la compression d'images automatique
- [ ] Implémenter le redimensionnement d'images (thumbnails)
- [ ] Ajouter la validation avancée (dimensions, ratio)
- [ ] Implémenter la rotation EXIF automatique
- [ ] Ajouter le support des vidéos
- [ ] Créer un système de CDN/caching
- [ ] Ajouter l'authentification sur les endpoints
- [ ] Implémenter les quotas par utilisateur
