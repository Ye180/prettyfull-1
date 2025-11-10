# 🔄 Migration Guide - Storage Module

## Pour les développeurs qui travaillent déjà sur le projet

### 1. Installer les nouvelles dépendances

```bash
cd apps/backend
pnpm install
```

Les dépendances suivantes seront installées automatiquement :

- `@aws-sdk/client-s3` v3.927.0
- `@aws-sdk/lib-storage` v3.927.0
- `multer` v2.0.2
- `@types/multer` v2.0.0
- `uuid` v13.0.0
- `@nestjs/swagger`

### 2. Mettre à jour votre fichier .env

Ajouter ces variables à votre fichier `.env` :

```bash
# Garage Storage Configuration
GARAGE_ENDPOINT=http://localhost:3903
GARAGE_REGION=garage
GARAGE_BUCKET=prettyfull-images
GARAGE_ACCESS_KEY=your-garage-access-key
GARAGE_SECRET_KEY=your-garage-secret-key
GARAGE_PUBLIC_URL=http://localhost:3903
```

**⚠️ Important** : Remplacez `your-garage-access-key` et `your-garage-secret-key` par vos vraies credentials Garage.

### 3. Configurer Garage Storage (si pas déjà fait)

Si vous avez accès au serveur Garage :

```bash
# Créer le bucket
garage bucket create prettyfull-images

# Créer une clé API
garage key create prettyfull-api-key

# Autoriser l'accès au bucket
garage bucket allow --read --write prettyfull-images --key prettyfull-api-key

# Rendre le bucket public en lecture
garage bucket website --allow prettyfull-images
```

### 4. Redémarrer le backend

```bash
# Si le backend tourne déjà, redémarrez-le
pnpm dev

# Ou avec turbo depuis la racine
cd ../..
turbo dev --filter=backend
```

### 5. Tester le module

```bash
cd apps/backend

# Méthode 1: Script de test automatique
./test-storage-upload.sh

# Méthode 2: Test manuel avec curl
curl -X POST http://localhost:3001/api/v1/storage/upload?folder=test \
  -F "file=@path/to/your/image.jpg"
```

### 6. Utiliser dans votre code

#### Exemple : Ajouter un upload d'image à un produit

```typescript
// Dans products.module.ts
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    // ... autres imports
    StorageModule,
  ],
  // ...
})
export class ProductsModule {}
```

```typescript
// Dans products.controller.ts
import { StorageService } from '../storage/storage.service';

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
    const result = await this.storageService.uploadFile(file, 'products');

    // Mettre à jour le produit avec la nouvelle URL
    await this.productsService.updateImage(id, result.url);

    return result;
  }
}
```

## ❓ FAQ

### Q: Je n'ai pas accès au serveur Garage, puis-je tester quand même ?

**R:** Oui ! Vous pouvez installer Garage localement avec Docker :

```bash
docker run -d \
  --name garage \
  -p 3903:3903 \
  -v /tmp/garage-data:/data \
  -v /tmp/garage-meta:/meta \
  -e GARAGE_RPC_SECRET=your-secret \
  dxflrs/garage:v0.8.2

# Ensuite, configurer Garage
docker exec -it garage garage status
```

### Q: Puis-je utiliser AWS S3 au lieu de Garage ?

**R:** Oui ! Le code est compatible S3. Il suffit de changer les variables d'environnement :

```bash
GARAGE_ENDPOINT=https://s3.amazonaws.com
GARAGE_REGION=us-east-1
GARAGE_BUCKET=your-bucket-name
GARAGE_ACCESS_KEY=your-aws-access-key
GARAGE_SECRET_KEY=your-aws-secret-key
GARAGE_PUBLIC_URL=https://your-bucket-name.s3.amazonaws.com
```

### Q: Comment modifier la taille max des fichiers ?

**R:** Dans `storage.controller.ts`, ligne 45 :

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // Changez ici (10 MB)
```

### Q: Puis-je autoriser d'autres types de fichiers (PDF, vidéos) ?

**R:** Oui, modifiez le `imageFileFilter` dans `storage.controller.ts` :

```typescript
const fileFilter = (req: any, file: Express.Multer.File, callback) => {
  // Autoriser images + PDFs
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
    callback(new BadRequestException('Type non autorisé'), false);
    return;
  }
  callback(null, true);
};
```

### Q: Les anciennes routes fonctionnent toujours ?

**R:** Oui ! Le module Storage est **additionnel**. Aucune route existante n'a été modifiée. Vos endpoints Products, Users, etc. fonctionnent exactement comme avant.

## 🐛 Problèmes courants

### Erreur: "Missing Garage storage configuration"

**Solution** : Vérifiez que toutes les variables `GARAGE_*` sont présentes dans votre `.env`.

### Erreur: "Failed to upload file: Network timeout"

**Solution** :

1. Vérifiez que Garage tourne sur le port 3903
2. Vérifiez le firewall
3. Testez avec : `curl http://localhost:3903`

### Erreur: "Access Denied"

**Solution** : Vérifiez que votre clé API a les droits sur le bucket :

```bash
garage bucket allow --read --write prettyfull-images --key your-key-name
```

### Le fichier s'upload mais l'URL ne fonctionne pas

**Solution** : Vérifiez que le bucket est configuré en mode "website" :

```bash
garage bucket website --allow prettyfull-images
```

## 📚 Ressources

- Documentation complète : `apps/backend/STORAGE_MODULE_GUIDE.md`
- Résumé : `apps/backend/STORAGE_MODULE_SUMMARY.md`
- Script de test : `apps/backend/test-storage-upload.sh`

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs du backend : `pnpm dev`
2. Testez avec le script : `./test-storage-upload.sh`
3. Vérifiez la connexion Garage : `curl http://localhost:3903`
4. Lisez le guide complet : `STORAGE_MODULE_GUIDE.md`

---

**Bon développement ! 🚀**
