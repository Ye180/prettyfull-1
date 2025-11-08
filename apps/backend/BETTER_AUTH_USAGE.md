# Better Auth Integration - Guide d'utilisation NestJS

Ce document explique comment utiliser Better Auth dans le backend NestJS après l'installation.

## 🎯 Configuration effectuée

✅ Package `@thallesp/nestjs-better-auth` installé  
✅ Configuration Better Auth créée dans `src/auth.ts`  
✅ Body parser désactivé dans `main.ts`  
✅ AuthModule importé dans `app.module.ts`  
✅ User schema adapté pour Better Auth (emailVerified, name, image)

## 📝 Variables d'environnement requises

Ajouter dans votre fichier `.env` :

```env
# Better Auth
BETTER_AUTH_SECRET=your-super-secret-key-minimum-32-characters-long
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:3002

# OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

## 🔐 Protection des routes

### Par défaut : Toutes les routes sont protégées

Better Auth active un `AuthGuard` global automatiquement. **Toutes vos routes nécessitent une authentification** sauf si vous utilisez les decorators suivants :

### Decorators disponibles

#### 1. `@AllowAnonymous()` - Autoriser l'accès sans authentification

```typescript
import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('products')
export class ProductsController {
  @Get()
  @AllowAnonymous() // Route publique
  async findAll() {
    return this.productsService.findAll();
  }
}
```

#### 2. `@OptionalAuth()` - Authentification optionnelle

```typescript
import { Controller, Get } from '@nestjs/common';
import {
  OptionalAuth,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';

@Controller('products')
export class ProductsController {
  @Get('featured')
  @OptionalAuth() // Session disponible si authentifié, mais pas requis
  async getFeatured(@Session() session?: UserSession) {
    const userId = session?.user?.id;
    return this.productsService.getFeatured(userId);
  }
}
```

#### 3. `@Roles(['admin'])` - Restriction par rôle

```typescript
import { Controller, Post } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';

@Controller('products')
export class ProductsController {
  @Post()
  @Roles(['admin']) // Seulement les admins
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
}
```

### Sur un contrôleur entier

```typescript
import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@AllowAnonymous() // Toutes les routes de ce contrôleur sont publiques
@Controller('public')
export class PublicController {
  @Get('info')
  getInfo() {
    return { message: 'Public info' };
  }
}
```

## 👤 Accéder à l'utilisateur connecté

### Avec le decorator `@Session()`

```typescript
import { Controller, Get } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  @Get('me')
  async getProfile(@Session() session: UserSession) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      // Tous vos champs personnalisés sont accessibles
      lastName: session.user.lastName,
      preferredLanguage: session.user.preferredLanguage,
      preferredCurrency: session.user.preferredCurrency,
    };
  }
}
```

### Avec l'objet Request

```typescript
import { Controller, Get, Request } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';

@Controller('users')
export class UsersController {
  @Get('me')
  async getProfile(@Request() req: ExpressRequest) {
    return {
      session: req.session, // Session complète
      user: req.user, // Utilisateur uniquement
    };
  }
}
```

## 🔌 Utiliser AuthService

Injectez `AuthService` pour accéder aux API Better Auth :

```typescript
import { Injectable } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { auth } from '../auth';

@Injectable()
export class UsersService {
  constructor(private authService: AuthService<typeof auth>) {}

  async getUserAccounts(userId: string) {
    const accounts = await this.authService.api.listUserAccounts({
      query: { userId },
    });
    return accounts;
  }

  async revokeUserSession(sessionId: string) {
    await this.authService.api.revokeSession({
      body: { sessionId },
    });
  }
}
```

## 🪝 Hooks Better Auth

Vous pouvez créer des hooks pour intercepter les événements d'authentification :

### Exemple : Hook de création de compte

```typescript
import { Injectable } from '@nestjs/common';
import {
  BeforeHook,
  Hook,
  AuthHookContext,
} from '@thallesp/nestjs-better-auth';
import { APIError } from 'better-auth/api';

@Hook()
@Injectable()
export class SignUpHook {
  @BeforeHook('/sign-up/email')
  async handle(ctx: AuthHookContext) {
    const email = ctx.body.email;

    // Exemple : Bloquer certains domaines email
    if (email.endsWith('@spam.com')) {
      throw new APIError('FORBIDDEN', {
        message: "Ce domaine email n'est pas autorisé",
      });
    }

    // Logique personnalisée avant création du compte
    console.log('New user signing up:', email);
  }
}
```

Ensuite, enregistrez le hook dans un module :

```typescript
import { Module } from '@nestjs/common';
import { SignUpHook } from './hooks/sign-up.hook';

@Module({
  providers: [SignUpHook],
})
export class AppModule {}
```

## 📡 Endpoints d'authentification disponibles

Better Auth expose automatiquement ces endpoints via `/api/auth` :

### Inscription

```bash
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John",
  "lastName": "Doe",
  "role": "user",
  "preferredLanguage": "fr",
  "preferredCurrency": "XOF"
}
```

### Connexion

```bash
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Déconnexion

```bash
POST /api/auth/sign-out
```

### Obtenir la session

```bash
GET /api/auth/get-session
```

### OAuth (Google, Facebook)

```bash
GET /api/auth/sign-in/social?provider=google
GET /api/auth/sign-in/social?provider=facebook
```

## 🔄 Migration depuis l'ancien système

Si vous utilisiez l'ancien système d'authentification :

### 1. Remplacer les guards

**Avant :**

```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
```

**Après :**

```typescript
// Le guard global est automatique
// Utilisez @AllowAnonymous() pour les routes publiques
```

### 2. Remplacer les decorators

**Avant :**

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

**Après :**

```typescript
import { Session, UserSession } from '@thallesp/nestjs-better-auth';

@Get('profile')
getProfile(@Session() session: UserSession) {
  return session.user;
}
```

### 3. Mettre à jour les noms de champs

- `firstName` → `name`
- `avatar` → `image`
- `isEmailVerified` → `emailVerified`

## 🧪 Tester l'authentification

### Avec curl

```bash
# 1. Inscription
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test",
    "lastName": "User"
  }'

# 2. Connexion
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Accéder à une route protégée
curl http://localhost:3001/api/users/me \
  -b cookies.txt
```

## 📚 Ressources

- [Documentation Better Auth](https://www.better-auth.com/docs)
- [nestjs-better-auth GitHub](https://github.com/thallesph/nestjs-better-auth)
- [Better Auth Plugins](https://www.better-auth.com/docs/plugins)

## ⚠️ Notes importantes

1. **Le body parser est désactivé** - Better Auth gère lui-même le parsing
2. **Guard global activé** - Toutes les routes sont protégées par défaut
3. **MongoDB requis** - Better Auth utilise MongoDB comme base de données
4. **Collections créées automatiquement** - `user`, `session`, `account`, `verification`

## 🚀 Prochaines étapes

1. ✅ Ajouter les variables d'environnement dans `.env`
2. ✅ Démarrer le serveur et tester les endpoints
3. ⬜ Configurer OAuth (Google, Facebook) si nécessaire
4. ⬜ Personnaliser les hooks selon vos besoins
5. ⬜ Migrer les routes existantes vers le nouveau système
