# Étape 7 : Gestion du Contenu du Site (CMS Léger)

## Objectif

Créer un module SiteContent qui permet de gérer le contenu éditorial dynamique du site (bannières, sections héros, pages statiques, etc.) avec support complet de l'internationalisation.

## Architecture

### Cas d'usage

- **Bannières homepage** : Carrousels, promotions
- **Sections héros** : Contenus d'accueil personnalisés
- **Pages statiques** : À propos, FAQ, CGV, Politique de confidentialité
- **Blocs de contenu** : Sections réutilisables (ex: footer, header)

### Avantages

- ✅ Contenu modifiable sans déploiement
- ✅ Support multilingue natif
- ✅ Gestion centralisée
- ✅ Versionning possible
- ✅ Preview avant publication

## Schéma de données

### site-content.schema.ts

```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SiteContentDocument = SiteContent & Document;

@Schema({ timestamps: true })
export class SiteContent {
  @Prop({ required: true, unique: true, index: true })
  key: string; // Identifiant unique (ex: 'home-hero-banner', 'about-page')

  @Prop({ required: true, enum: ["banner", "hero", "page", "block"] })
  type: string; // Type de contenu

  @Prop({ type: Object, required: true })
  content: Record<string, any>; // Contenu flexible avec i18n

  @Prop({ default: true })
  isActive: boolean; // Publié ou brouillon

  @Prop({ type: Date })
  publishedAt?: Date; // Date de publication

  @Prop()
  publishedBy?: string; // Utilisateur ayant publié

  @Prop({ type: Object })
  metadata?: {
    version?: number;
    tags?: string[];
    author?: string;
    notes?: string;
  };
}

export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);

// Index pour les recherches
SiteContentSchema.index({ key: 1, isActive: 1 });
SiteContentSchema.index({ type: 1, isActive: 1 });
```

### Exemples de structures de contenu

#### 1. Bannière homepage

```json
{
  "key": "home-hero-banner",
  "type": "banner",
  "content": {
    "title": {
      "fr": "Découvrez nos nouveautés",
      "en": "Discover our new products"
    },
    "subtitle": {
      "fr": "Les meilleurs produits au meilleur prix",
      "en": "The best products at the best price"
    },
    "imageUrl": "https://cdn.example.com/banner.jpg",
    "mobileImageUrl": "https://cdn.example.com/banner-mobile.jpg",
    "ctaText": {
      "fr": "Voir les produits",
      "en": "View products"
    },
    "ctaLink": "/products",
    "backgroundColor": "#FF6B6B",
    "textColor": "#FFFFFF"
  },
  "isActive": true,
  "publishedAt": "2025-01-01T00:00:00.000Z"
}
```

#### 2. Section héros

```json
{
  "key": "home-hero-section",
  "type": "hero",
  "content": {
    "heading": {
      "fr": "Bienvenue sur PrettyFull",
      "en": "Welcome to PrettyFull"
    },
    "subheading": {
      "fr": "Votre marketplace e-commerce de confiance",
      "en": "Your trusted e-commerce marketplace"
    },
    "features": [
      {
        "icon": "shipping",
        "title": {
          "fr": "Livraison rapide",
          "en": "Fast delivery"
        },
        "description": {
          "fr": "Livraison en 24-48h",
          "en": "Delivery in 24-48h"
        }
      },
      {
        "icon": "secure",
        "title": {
          "fr": "Paiement sécurisé",
          "en": "Secure payment"
        },
        "description": {
          "fr": "Transactions 100% sécurisées",
          "en": "100% secure transactions"
        }
      }
    ]
  },
  "isActive": true
}
```

#### 3. Page statique (À propos)

```json
{
  "key": "about-page",
  "type": "page",
  "content": {
    "title": {
      "fr": "À propos de nous",
      "en": "About us"
    },
    "sections": [
      {
        "type": "text",
        "heading": {
          "fr": "Notre histoire",
          "en": "Our story"
        },
        "body": {
          "fr": "PrettyFull a été fondé en 2025...",
          "en": "PrettyFull was founded in 2025..."
        }
      },
      {
        "type": "image",
        "imageUrl": "https://cdn.example.com/about.jpg",
        "alt": {
          "fr": "L'équipe PrettyFull",
          "en": "The PrettyFull team"
        }
      }
    ],
    "seoMeta": {
      "title": {
        "fr": "À propos - PrettyFull",
        "en": "About - PrettyFull"
      },
      "description": {
        "fr": "Découvrez l'histoire de PrettyFull",
        "en": "Discover PrettyFull's story"
      }
    }
  },
  "isActive": true
}
```

## Service Implementation

### site-content.service.ts

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  SiteContent,
  SiteContentDocument,
} from "./schemas/site-content.schema";

@Injectable()
export class SiteContentService {
  constructor(
    @InjectModel(SiteContent.name)
    private siteContentModel: Model<SiteContentDocument>
  ) {}

  /**
   * Récupère un contenu par sa clé (public, avec transformation i18n)
   */
  async getByKey(key: string, language: string = "fr"): Promise<any> {
    const content = await this.siteContentModel
      .findOne({ key, isActive: true })
      .lean()
      .exec();

    if (!content) {
      throw new NotFoundException(`Contenu introuvable: ${key}`);
    }

    return this.transformContent(content, language);
  }

  /**
   * Liste tous les contenus d'un type (admin)
   */
  async findAll(
    type?: string,
    includeInactive: boolean = false
  ): Promise<SiteContentDocument[]> {
    const query: any = {};

    if (type) {
      query.type = type;
    }

    if (!includeInactive) {
      query.isActive = true;
    }

    return this.siteContentModel.find(query).sort({ createdAt: -1 }).exec();
  }

  /**
   * Crée un nouveau contenu (admin)
   */
  async create(createDto: any): Promise<SiteContentDocument> {
    const content = new this.siteContentModel(createDto);
    return content.save();
  }

  /**
   * Met à jour un contenu (admin)
   */
  async update(key: string, updateDto: any): Promise<SiteContentDocument> {
    const content = await this.siteContentModel
      .findOneAndUpdate(
        { key },
        {
          ...updateDto,
          "metadata.version": { $inc: 1 }, // Increment version
        },
        { new: true }
      )
      .exec();

    if (!content) {
      throw new NotFoundException(`Contenu introuvable: ${key}`);
    }

    return content;
  }

  /**
   * Publie un contenu (admin)
   */
  async publish(
    key: string,
    publishedBy: string
  ): Promise<SiteContentDocument> {
    const content = await this.siteContentModel
      .findOneAndUpdate(
        { key },
        {
          isActive: true,
          publishedAt: new Date(),
          publishedBy,
        },
        { new: true }
      )
      .exec();

    if (!content) {
      throw new NotFoundException(`Contenu introuvable: ${key}`);
    }

    return content;
  }

  /**
   * Dépublie un contenu (admin)
   */
  async unpublish(key: string): Promise<SiteContentDocument> {
    const content = await this.siteContentModel
      .findOneAndUpdate({ key }, { isActive: false }, { new: true })
      .exec();

    if (!content) {
      throw new NotFoundException(`Contenu introuvable: ${key}`);
    }

    return content;
  }

  /**
   * Supprime un contenu (admin)
   */
  async delete(key: string): Promise<void> {
    const result = await this.siteContentModel.deleteOne({ key }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Contenu introuvable: ${key}`);
    }
  }

  /**
   * Transforme le contenu pour ne retourner que la langue demandée
   */
  private transformContent(content: any, language: string): any {
    const transformed = {
      key: content.key,
      type: content.type,
      content: this.translateFields(content.content, language),
      publishedAt: content.publishedAt,
    };

    return transformed;
  }

  /**
   * Traduit récursivement les champs multilingues
   */
  private translateFields(obj: any, language: string): any {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    // Si c'est un objet de traduction {fr: "...", en: "..."}
    if (obj.fr !== undefined || obj.en !== undefined) {
      return obj[language] || obj.fr || obj.en;
    }

    // Si c'est un tableau
    if (Array.isArray(obj)) {
      return obj.map((item) => this.translateFields(item, language));
    }

    // Si c'est un objet, traduire récursivement
    const translated: any = {};
    for (const key in obj) {
      translated[key] = this.translateFields(obj[key], language);
    }

    return translated;
  }
}
```

## Contrôleur

### site-content.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Headers,
  UseGuards,
} from "@nestjs/common";
import { SiteContentService } from "./site-content.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("site-content")
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  /**
   * GET /site-content/:key - Public
   * Récupère un contenu publié par sa clé
   */
  @Get(":key")
  async getByKey(
    @Param("key") key: string,
    @Headers("accept-language") language: string = "fr"
  ) {
    return this.siteContentService.getByKey(key, language);
  }

  /**
   * GET /site-content - Admin only
   * Liste tous les contenus
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async findAll(
    @Query("type") type?: string,
    @Query("includeInactive") includeInactive?: boolean
  ) {
    return this.siteContentService.findAll(type, includeInactive);
  }

  /**
   * POST /site-content - Admin only
   * Crée un nouveau contenu
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async create(@Body() createDto: any) {
    return this.siteContentService.create(createDto);
  }

  /**
   * PATCH /site-content/:key - Admin only
   * Met à jour un contenu
   */
  @Patch(":key")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async update(@Param("key") key: string, @Body() updateDto: any) {
    return this.siteContentService.update(key, updateDto);
  }

  /**
   * POST /site-content/:key/publish - Admin only
   * Publie un contenu
   */
  @Post(":key/publish")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async publish(
    @Param("key") key: string,
    @Body("publishedBy") publishedBy: string
  ) {
    return this.siteContentService.publish(key, publishedBy);
  }

  /**
   * POST /site-content/:key/unpublish - Admin only
   * Dépublie un contenu
   */
  @Post(":key/unpublish")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async unpublish(@Param("key") key: string) {
    return this.siteContentService.unpublish(key);
  }

  /**
   * DELETE /site-content/:key - Admin only
   * Supprime un contenu
   */
  @Delete(":key")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async delete(@Param("key") key: string) {
    return this.siteContentService.delete(key);
  }
}
```

## DTOs

### create-site-content.dto.ts

```typescript
import {
  IsString,
  IsEnum,
  IsObject,
  IsBoolean,
  IsOptional,
} from "class-validator";

export enum ContentType {
  BANNER = "banner",
  HERO = "hero",
  PAGE = "page",
  BLOCK = "block",
}

export class CreateSiteContentDto {
  @IsString()
  key: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsObject()
  content: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: {
    tags?: string[];
    author?: string;
    notes?: string;
  };
}
```

### update-site-content.dto.ts

```typescript
import { PartialType } from "@nestjs/mapped-types";
import { CreateSiteContentDto } from "./create-site-content.dto";

export class UpdateSiteContentDto extends PartialType(CreateSiteContentDto) {}
```

## Module Configuration

### site-content.module.ts

```typescript
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SiteContentController } from "./site-content.controller";
import { SiteContentService } from "./site-content.service";
import { SiteContent, SiteContentSchema } from "./schemas/site-content.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteContent.name, schema: SiteContentSchema },
    ]),
  ],
  controllers: [SiteContentController],
  providers: [SiteContentService],
  exports: [SiteContentService],
})
export class SiteContentModule {}
```

## Tests d'utilisation

### 1. Créer un contenu (Admin)

```bash
curl -X POST http://localhost:3000/site-content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "key": "home-hero-banner",
    "type": "banner",
    "content": {
      "title": {
        "fr": "Découvrez nos nouveautés",
        "en": "Discover our new products"
      },
      "imageUrl": "https://cdn.example.com/banner.jpg",
      "ctaLink": "/products"
    },
    "isActive": false
  }'
```

### 2. Publier un contenu (Admin)

```bash
curl -X POST http://localhost:3000/site-content/home-hero-banner/publish \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"publishedBy": "admin-user-id"}'
```

### 3. Récupérer un contenu (Public)

```bash
# En français
curl http://localhost:3000/site-content/home-hero-banner \
  -H "Accept-Language: fr"

# En anglais
curl http://localhost:3000/site-content/home-hero-banner \
  -H "Accept-Language: en"
```

### 4. Lister tous les contenus (Admin)

```bash
curl http://localhost:3000/site-content?type=banner&includeInactive=true \
  -H "Authorization: Bearer <admin-token>"
```

## Cas d'usage avancés

### 1. Preview avant publication

```typescript
// Endpoint pour prévisualiser un brouillon
@Get(':key/preview')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async preview(
  @Param('key') key: string,
  @Headers('accept-language') language: string = 'fr',
) {
  return this.siteContentService.getByKey(key, language, true); // includeInactive=true
}
```

### 2. Versionning

```typescript
// Sauvegarder l'historique des versions
@Prop({ type: [Object] })
versions?: Array<{
  version: number;
  content: Record<string, any>;
  updatedAt: Date;
  updatedBy: string;
}>;

// Rollback vers une version précédente
async rollback(key: string, version: number): Promise<SiteContentDocument> {
  const content = await this.siteContentModel.findOne({ key }).exec();
  const targetVersion = content.versions?.find(v => v.version === version);

  if (!targetVersion) {
    throw new NotFoundException('Version introuvable');
  }

  content.content = targetVersion.content;
  return content.save();
}
```

### 3. Scheduling (publication programmée)

```typescript
// Utiliser Bull pour programmer la publication
await this.queue.add(
  "publish-content",
  { key: "home-hero-banner" },
  { delay: scheduledDate.getTime() - Date.now() }
);
```

## Prochaine étape

**Étape 8** : Notifications Asynchrones (Bull/Redis)

- Configuration de BullMQ
- Envoi d'emails de confirmation de commande
- Webhooks pour les événements système
