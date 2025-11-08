# ✅ Better Auth - Installation Terminée

## 📦 Ce qui a été installé et configuré

### Backend (NestJS)

1. **Package installé**
   - `@thallesp/nestjs-better-auth` (v2.1.0)
   - `better-auth` (v1.3.34)
   - `mongodb` (v7.0.0)

2. **Fichiers créés/modifiés**
   - ✅ `src/auth.ts` - Configuration Better Auth avec MongoDB
   - ✅ `src/main.ts` - Body parser désactivé
   - ✅ `src/app.module.ts` - AuthModule.forRoot() importé
   - ✅ `src/modules/users/schemas/user.schema.ts` - Schema adapté pour Better Auth
   - ✅ `src/modules/auth/auth.service.ts` - Correction pour password optionnel
   - ✅ `.env.example` - Variables d'environnement Better Auth ajoutées
   - ✅ `BETTER_AUTH_USAGE.md` - Documentation complète

3. **Changements du User Schema**

   ```typescript
   // Anciens champs → Nouveaux champs Better Auth
   firstName → name
   avatar → image
   isEmailVerified → emailVerified
   password (required) → password? (optionnel pour OAuth)

   // Nouveaux champs ajoutés
   - twoFactorEnabled
   - twoFactorSecret
   - banned
   - banReason
   - banExpiresAt
   ```

## 🔧 Configuration requise

### Variables d'environnement à ajouter dans `.env`

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

⚠️ **IMPORTANT** : Générer un secret sécurisé pour production :

```bash
openssl rand -base64 32
```

## 🚀 Démarrage

```bash
cd apps/backend

# Ajouter les variables d'environnement
cp .env.example .env
# Éditer .env et ajouter BETTER_AUTH_SECRET

# Démarrer le serveur
pnpm dev
```

## 📡 Endpoints disponibles

Better Auth expose automatiquement ces routes :

```
POST   /api/auth/sign-up/email       - Inscription
POST   /api/auth/sign-in/email       - Connexion
POST   /api/auth/sign-out            - Déconnexion
GET    /api/auth/get-session         - Obtenir la session
GET    /api/auth/sign-in/social      - OAuth (Google, Facebook)
POST   /api/auth/reset-password      - Réinitialisation mot de passe
```

## 🔐 Protection des routes

### Par défaut : Guard global activé

**Toutes les routes sont protégées automatiquement** ✅

### Rendre une route publique

```typescript
import { Controller, Get } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Controller("products")
export class ProductsController {
  @Get()
  @AllowAnonymous() // Route accessible sans authentification
  async findAll() {
    return this.productsService.findAll();
  }
}
```

### Accéder à l'utilisateur connecté

```typescript
import { Controller, Get } from "@nestjs/common";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";

@Controller("users")
export class UsersController {
  @Get("me")
  async getProfile(@Session() session: UserSession) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      // Vos champs personnalisés
      lastName: session.user.lastName,
      preferredLanguage: session.user.preferredLanguage,
    };
  }
}
```

### Routes réservées aux admins

```typescript
import { Controller, Post } from "@nestjs/common";
import { Roles } from "@thallesp/nestjs-better-auth";

@Controller("products")
export class ProductsController {
  @Post()
  @Roles(["admin"]) // Seulement les utilisateurs avec role='admin'
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
}
```

## 🧪 Test rapide

### 1. Créer un compte

```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "John",
    "lastName": "Doe",
    "role": "user",
    "preferredLanguage": "fr",
    "preferredCurrency": "XOF"
  }'
```

### 2. Se connecter

```bash
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Accéder à une route protégée

```bash
curl http://localhost:3001/api/users/me \
  -b cookies.txt
```

## 📚 Documentation complète

Consultez `BETTER_AUTH_USAGE.md` pour :

- Guide complet d'utilisation
- Exemples de hooks
- Migration depuis l'ancien système
- Configuration OAuth
- Et plus encore...

## 🔄 Prochaines étapes

1. ✅ Configuration terminée
2. ⬜ Ajouter `BETTER_AUTH_SECRET` dans `.env`
3. ⬜ Démarrer le serveur et tester les endpoints
4. ⬜ Migrer les routes existantes (ajouter `@AllowAnonymous()` si nécessaire)
5. ⬜ Configurer OAuth si souhaité
6. ⬜ Adapter le frontend pour utiliser les nouveaux endpoints

## ⚠️ Points importants

- ✅ Body parser désactivé (Better Auth le gère)
- ✅ Guard global activé automatiquement
- ✅ MongoDB collections créées automatiquement : `user`, `session`, `account`, `verification`
- ✅ Support OAuth Google et Facebook (nécessite configuration)
- ✅ Sessions gérées automatiquement (7 jours par défaut)
- ✅ Champs personnalisés du User schema préservés

## 🆘 En cas de problème

### Erreur de compilation

```bash
cd apps/backend
pnpm build
```

### Tester la connexion MongoDB

```bash
# Dans auth.ts, vérifier DATABASE_URL dans .env
```

### Vérifier les logs

```bash
pnpm dev
# Regarder les logs du serveur
```

## 📖 Ressources

- [Better Auth Docs](https://www.better-auth.com/docs)
- [nestjs-better-auth GitHub](https://github.com/thallesph/nestjs-better-auth)
- [Better Auth Plugins](https://www.better-auth.com/docs/plugins)

---

**✨ Better Auth est maintenant prêt à être utilisé ! ✨**

Pour toute question, consultez `BETTER_AUTH_USAGE.md` ou la documentation officielle.
