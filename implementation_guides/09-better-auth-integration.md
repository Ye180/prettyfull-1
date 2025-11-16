# Guide d'Intégration Better Auth - Authentification Complète

## 📋 Vue d'ensemble

Ce guide vous accompagne dans l'intégration de **Better Auth** pour remplacer l'authentification actuelle Passport/JWT par une solution moderne, type-safe et complète avec support de :

- ✅ Email/Password
- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ Gestion des rôles (USER, ADMIN)
- ✅ Multi-devise et multi-langue
- ✅ Sessions sécurisées
- ✅ Vérification email
- ✅ Réinitialisation mot de passe

---

## 🎯 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Better Auth Client                                   │  │
│  │  - authClient instance                                │  │
│  │  - React hooks (useSession, signIn, signOut...)      │  │
│  │  - OAuth redirects                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Better Auth Server                                   │  │
│  │  - auth instance avec plugins                         │  │
│  │  - MongoDB adapter                                    │  │
│  │  - Email/Password + OAuth providers                   │  │
│  │  - Session management                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB Collections                                  │  │
│  │  - user (existing schema adapted)                     │  │
│  │  - session                                            │  │
│  │  - account (OAuth)                                    │  │
│  │  - verification                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Étape 1 : Installation des Dépendances

### 1.1 Backend (NestJS)

```bash
cd apps/backend
pnpm add better-auth@latest
pnpm add -D @types/better-auth
```

### 1.2 Frontend (Next.js)

```bash
cd apps/web
pnpm add better-auth@latest
pnpm add @better-auth/react
```

---

## 🔧 Étape 2 : Configuration Backend (NestJS)

### 2.1 Variables d'environnement

Créez/mettez à jour `apps/backend/.env` :

```env
# Better Auth
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars-here
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:3002

# Database
DATABASE_URL=mongodb://localhost:27017/prettyfull-ecommerce

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Email (pour vérification et reset password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@prettyfull.com
```

### 2.2 Adapter le Schema User

Le schéma utilisateur existant est déjà bien structuré. Nous allons l'adapter pour Better Auth.

**Fichier :** `apps/backend/src/modules/users/schemas/user.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Document } from "mongoose";

export type UserDocument = User & Document;

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

export enum Language {
  FR = "fr",
  EN = "en",
}

export enum Currency {
  XOF = "XOF",
  USD = "USD",
}

@Schema({
  collection: "user", // Better Auth attend 'user' par défaut
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: false }) // Peut être null pour OAuth
  password?: string;

  @Prop({ required: true })
  firstName: string; // Mappé à 'name' dans Better Auth

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phone?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ type: String, enum: Language, default: Language.FR })
  preferredLanguage: Language;

  @Prop({ type: String, enum: Currency, default: Currency.XOF })
  preferredCurrency: Currency;

  @Prop({ type: String, default: "CI" })
  country: string;

  @Prop()
  avatar?: string; // Mappé à 'image' dans Better Auth

  @Prop()
  dateOfBirth?: Date;

  @Prop({
    type: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  })
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Prop({ default: Date.now })
  lastLoginAt?: Date;

  @Prop({ default: false })
  emailVerified: boolean; // Better Auth utilise 'emailVerified'

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  // Champs Better Auth additionnels
  @Prop()
  twoFactorEnabled?: boolean;

  @Prop()
  twoFactorSecret?: string;

  @Prop()
  banned?: boolean;

  @Prop()
  banReason?: string;

  @Prop()
  banExpiresAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });

// Hook pre-save pour hasher le mot de passe
UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};
```

### 2.3 Créer les Schemas Better Auth additionnels

**Fichier :** `apps/backend/src/modules/auth/schemas/session.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type SessionDocument = Session & Document;

@Schema({
  collection: "session",
  timestamps: true,
})
export class Session {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Indexes
SessionSchema.index({ token: 1 }, { unique: true });
SessionSchema.index({ userId: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

**Fichier :** `apps/backend/src/modules/auth/schemas/account.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type AccountDocument = Account & Document;

@Schema({
  collection: "account",
  timestamps: true,
})
export class Account {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true }) // 'google', 'facebook', etc.
  providerId: string;

  @Prop({ required: true }) // ID de l'utilisateur chez le provider
  providerAccountId: string;

  @Prop()
  accessToken?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  expiresAt?: Date;

  @Prop()
  tokenType?: string;

  @Prop()
  scope?: string;

  @Prop()
  idToken?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// Indexes
AccountSchema.index({ userId: 1 });
AccountSchema.index({ providerId: 1, providerAccountId: 1 }, { unique: true });
```

**Fichier :** `apps/backend/src/modules/auth/schemas/verification.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type VerificationDocument = Verification & Document;

@Schema({
  collection: "verification",
  timestamps: true,
})
export class Verification {
  @Prop({ required: true })
  identifier: string; // Email ou phone

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

// Indexes
VerificationSchema.index({ identifier: 1, token: 1 });
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### 2.4 Configuration Better Auth

**Fichier :** `apps/backend/src/modules/auth/config/better-auth.config.ts`

```typescript
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, multiSession, twoFactor } from "better-auth/plugins";
import { MongoClient } from "mongodb";

export async function createBetterAuth() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/prettyfull-ecommerce";

  // Créer le client MongoDB
  const client = new MongoClient(databaseUrl);
  await client.connect();
  const db = client.db();

  return betterAuth({
    // Configuration de base
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
    basePath: "/api/auth",

    // Origines de confiance
    trustedOrigins: (
      process.env.BETTER_AUTH_TRUSTED_ORIGINS || "http://localhost:3000"
    ).split(","),

    // Adapter MongoDB
    database: mongodbAdapter(db, {
      collectionNames: {
        user: "user",
        session: "session",
        account: "account",
        verification: "verification",
      },
    }),

    // Configuration Email/Password
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 6,
      maxPasswordLength: 128,
      autoSignIn: false, // Nécessite vérification email
    },

    // Configuration de session
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 jours
      updateAge: 60 * 60 * 24, // Mise à jour quotidienne
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },

    // Configuration User
    user: {
      // Mapping des champs
      fields: {
        email: "email",
        emailVerified: "emailVerified",
        name: "firstName", // Better Auth 'name' → notre 'firstName'
        image: "avatar", // Better Auth 'image' → notre 'avatar'
      },
      // Champs additionnels personnalisés
      additionalFields: {
        lastName: {
          type: "string",
          required: true,
        },
        phone: {
          type: "string",
          required: false,
        },
        role: {
          type: "string",
          required: true,
          defaultValue: "user",
          validator: (value: string) => ["user", "admin"].includes(value),
        },
        status: {
          type: "string",
          required: true,
          defaultValue: "active",
        },
        preferredLanguage: {
          type: "string",
          required: true,
          defaultValue: "fr",
        },
        preferredCurrency: {
          type: "string",
          required: true,
          defaultValue: "XOF",
        },
        country: {
          type: "string",
          required: false,
          defaultValue: "CI",
        },
        dateOfBirth: {
          type: "date",
          required: false,
        },
        address: {
          type: "object",
          required: false,
        },
        lastLoginAt: {
          type: "date",
          required: false,
        },
      },
    },

    // Providers OAuth
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
        scopes: ["email", "profile"],
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/facebook`,
        scopes: ["email", "public_profile"],
      },
    },

    // Email sender (pour vérification et reset password)
    emailVerification: {
      sendOnSignUp: true,
      expiresIn: 60 * 60 * 24, // 24 heures
      sendEmail: async (email, url, token) => {
        // TODO: Intégrer avec votre service email
        console.log(`
          📧 Email de vérification
          To: ${email}
          URL: ${url}
          Token: ${token}
        `);
        // Exemple avec Nodemailer (à implémenter)
        // await sendVerificationEmail(email, url);
      },
    },

    // Plugins
    plugins: [
      // Plugin admin pour gérer les rôles
      admin({
        impersonationSessionDuration: 60 * 60, // 1 heure
      }),

      // Support multi-session
      multiSession(),

      // Two-factor authentication (optionnel)
      twoFactor({
        issuer: "PrettyFull",
        otpOptions: {
          period: 30,
        },
      }),
    ],

    // Hooks
    hooks: {
      after: [
        {
          matcher(context) {
            return context.path === "/sign-in/email";
          },
          handler: async (ctx) => {
            if (ctx.context.user) {
              // Mettre à jour lastLoginAt
              await db
                .collection("user")
                .updateOne(
                  { _id: ctx.context.user.id },
                  { $set: { lastLoginAt: new Date() } }
                );
            }
          },
        },
      ],
    },

    // Configuration avancée
    advanced: {
      cookiePrefix: "better-auth",
      crossSubDomainCookies: {
        enabled: false,
      },
      useSecureCookies: process.env.NODE_ENV === "production",
      generateId: () => {
        // Génération d'ID personnalisée si nécessaire
        return crypto.randomUUID();
      },
    },
  });
}
```

### 2.5 Module Better Auth

**Fichier :** `apps/backend/src/modules/auth/better-auth.module.ts`

```typescript
import { Module, Global, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { createBetterAuth } from "./config/better-auth.config";
import { BetterAuthController } from "./better-auth.controller";
import { BetterAuthService } from "./better-auth.service";
import { BetterAuthGuard } from "./guards/better-auth.guard";
import { MongooseModule } from "@nestjs/mongoose";
import { Session, SessionSchema } from "./schemas/session.schema";
import { Account, AccountSchema } from "./schemas/account.schema";
import {
  Verification,
  VerificationSchema,
} from "./schemas/verification.schema";

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
  controllers: [BetterAuthController],
  providers: [BetterAuthService, BetterAuthGuard],
  exports: [BetterAuthService, BetterAuthGuard],
})
export class BetterAuthModule implements OnModuleInit {
  async onModuleInit() {
    console.log("✅ Better Auth Module initialized");
  }
}
```

### 2.6 Service Better Auth

**Fichier :** `apps/backend/src/modules/auth/better-auth.service.ts`

```typescript
import { Injectable, OnModuleInit } from "@nestjs/common";
import { createBetterAuth } from "./config/better-auth.config";
import type { Auth } from "better-auth";

@Injectable()
export class BetterAuthService implements OnModuleInit {
  private authInstance: Auth;

  async onModuleInit() {
    this.authInstance = await createBetterAuth();
  }

  getAuth(): Auth {
    return this.authInstance;
  }

  // Méthodes utilitaires
  async verifySession(token: string) {
    return this.authInstance.api.getSession({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserFromSession(token: string) {
    const session = await this.verifySession(token);
    return session?.user;
  }

  async revokeSession(sessionId: string) {
    return this.authInstance.api.revokeSession({
      body: { sessionId },
    });
  }

  async listUserSessions(userId: string) {
    return this.authInstance.api.listSessions({
      query: { userId },
    });
  }
}
```

### 2.7 Controller Better Auth

**Fichier :** `apps/backend/src/modules/auth/better-auth.controller.ts`

```typescript
import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { BetterAuthService } from "./better-auth.service";

@Controller("auth")
export class BetterAuthController {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  /**
   * Route catch-all pour Better Auth
   * Toutes les routes /api/auth/* sont gérées par Better Auth
   */
  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const auth = this.betterAuthService.getAuth();
    return auth.handler(req, res);
  }
}
```

### 2.8 Guard Better Auth

**Fichier :** `apps/backend/src/modules/auth/guards/better-auth.guard.ts`

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BetterAuthService } from "../better-auth.service";

/**
 * Guard pour protéger les routes avec Better Auth
 * Usage: @UseGuards(BetterAuthGuard)
 */
@Injectable()
export class BetterAuthGuard implements CanActivate {
  constructor(
    private readonly betterAuthService: BetterAuthService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Récupérer le token depuis le cookie ou header
    const token =
      request.cookies?.["better-auth.session_token"] ||
      request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedException("No authentication token found");
    }

    try {
      const session = await this.betterAuthService.verifySession(token);

      if (!session || !session.user) {
        throw new UnauthorizedException("Invalid or expired session");
      }

      // Attacher l'utilisateur à la requête
      request.user = session.user;
      request.session = session;

      return true;
    } catch (error) {
      throw new UnauthorizedException("Authentication failed");
    }
  }
}

/**
 * Guard pour vérifier les rôles
 * Usage: @UseGuards(BetterAuthGuard, RolesGuard) + @Roles('admin')
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }

    const hasRole = roles.includes(user.role);

    if (!hasRole) {
      throw new UnauthorizedException(
        `User role '${user.role}' is not authorized. Required: ${roles.join(", ")}`
      );
    }

    return true;
  }
}
```

### 2.9 Decorator pour les rôles

**Fichier :** `apps/backend/src/modules/auth/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

**Fichier :** `apps/backend/src/modules/auth/decorators/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
```

### 2.10 Mettre à jour le module principal

**Fichier :** `apps/backend/src/app.module.ts`

```typescript
// Remplacer AuthModule par BetterAuthModule
import { BetterAuthModule } from "./modules/auth/better-auth.module";

@Module({
  imports: [
    // ... autres imports
    BetterAuthModule, // Remplace AuthModule
    UsersModule,
    // ... autres modules
  ],
  // ...
})
export class AppModule {}
```

---

## 🎨 Étape 3 : Configuration Frontend (Next.js)

### 3.1 Variables d'environnement

**Fichier :** `apps/web/.env.local`

```env
# Better Auth
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001/api/auth
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 Client Better Auth

**Fichier :** `apps/web/src/lib/auth/client.ts`

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,

  // Configuration des cookies
  cookiePrefix: "better-auth",

  // Plugins côté client
  plugins: [],
});

// Types pour TypeScript
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
```

### 3.3 Provider de session

**Fichier :** `apps/web/src/lib/auth/SessionProvider.tsx`

```typescript
'use client';

import { ReactNode } from 'react';
import { SessionProvider as BetterAuthSessionProvider } from 'better-auth/react';

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <BetterAuthSessionProvider>
      {children}
    </BetterAuthSessionProvider>
  );
}
```

### 3.4 Hooks personnalisés

**Fichier :** `apps/web/src/lib/auth/hooks.ts`

```typescript
"use client";

import { authClient } from "./client";

// Hook pour la session
export const useSession = () => {
  return authClient.useSession();
};

// Hook pour sign in avec email/password
export const useSignIn = () => {
  return authClient.signIn.email;
};

// Hook pour sign up avec email/password
export const useSignUp = () => {
  return authClient.signUp.email;
};

// Hook pour sign out
export const useSignOut = () => {
  return authClient.signOut;
};

// Hook pour Google OAuth
export const useGoogleSignIn = () => {
  return authClient.signIn.social;
};

// Hook pour Facebook OAuth
export const useFacebookSignIn = () => {
  return authClient.signIn.social;
};

// Hook pour vérifier si l'utilisateur est admin
export const useIsAdmin = () => {
  const { data: session } = useSession();
  return session?.user?.role === "admin";
};

// Hook pour obtenir l'utilisateur courant
export const useCurrentUser = () => {
  const { data: session } = useSession();
  return session?.user;
};
```

### 3.5 Intégrer dans le layout principal

**Fichier :** `apps/web/src/app/layout.tsx`

```typescript
import { SessionProvider } from '@/lib/auth/SessionProvider';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

### 3.6 Composant de connexion

**Fichier :** `apps/web/src/features/auth/components/SignInForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useGoogleSignIn, useFacebookSignIn } from '@/lib/auth/hooks';
import { Button } from '@prettyfull/ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = useSignIn();
  const signInWithGoogle = useGoogleSignIn();
  const signInWithFacebook = useFacebookSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn.mutateAsync({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle.mutateAsync({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (err) {
      setError('Erreur de connexion avec Google');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook.mutateAsync({
        provider: 'facebook',
        callbackURL: '/dashboard',
      });
    } catch (err) {
      setError('Erreur de connexion avec Facebook');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            placeholder="vous@exemple.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Mot de passe
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            {/* Google icon */}
          </svg>
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleFacebookSignIn}
          className="w-full"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            {/* Facebook icon */}
          </svg>
          Facebook
        </Button>
      </div>
    </div>
  );
}
```

### 3.7 Composant d'inscription

**Fichier :** `apps/web/src/features/auth/components/SignUpForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@/lib/auth/hooks';
import { Button } from '@prettyfull/ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const signUp = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signUp.mutateAsync({
        email: data.email,
        password: data.password,
        name: data.firstName,
        // Champs personnalisés
        lastName: data.lastName,
        phone: data.phone,
        role: 'user',
        preferredLanguage: 'fr',
        preferredCurrency: 'XOF',
        country: 'CI',
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess(true);
        // Rediriger vers la page de vérification email
        setTimeout(() => {
          router.push('/auth/verify-email?email=' + encodeURIComponent(data.email));
        }, 2000);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <p className="text-sm text-green-800">
          ✅ Compte créé avec succès ! Vérifiez votre email pour activer votre compte.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            Prénom
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Nom
          </label>
          <input
            {...register('lastName')}
            type="text"
            id="lastName"
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Téléphone (optionnel)
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Mot de passe
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirmer le mot de passe
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Création...' : "S'inscrire"}
      </Button>
    </form>
  );
}
```

### 3.8 Middleware pour protection des routes

**Fichier :** `apps/web/src/middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("better-auth.session_token")?.value;

  // Routes publiques
  const publicPaths = ["/auth/signin", "/auth/signup", "/auth/verify-email"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Routes protégées
  const protectedPaths = ["/dashboard", "/profile", "/orders"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Routes admin
  const adminPaths = ["/admin"];
  const isAdminPath = adminPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Si route protégée et pas de token, rediriger vers login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Si route publique et token présent, rediriger vers dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Pour les routes admin, vérifier le rôle (nécessite un appel API)
  if (isAdminPath && token) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/session`,
        {
          headers: {
            cookie: `better-auth.session_token=${token}`,
          },
        }
      );

      const session = await response.json();

      if (session?.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
```

---

## 🔐 Étape 4 : Configuration OAuth

### 4.1 Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un existant
3. Activer Google+ API
4. Credentials → Create Credentials → OAuth client ID
5. Configure le consent screen
6. Ajouter les Authorized redirect URIs :
   ```
   http://localhost:3001/api/auth/callback/google
   https://votre-domaine.com/api/auth/callback/google
   ```
7. Copier Client ID et Client Secret dans `.env`

### 4.2 Facebook OAuth

1. Aller sur [Facebook Developers](https://developers.facebook.com/)
2. Créer une nouvelle app
3. Ajouter Facebook Login product
4. Settings → Basic : copier App ID et App Secret
5. Settings → Advanced → OAuth Redirect URIs :
   ```
   http://localhost:3001/api/auth/callback/facebook
   https://votre-domaine.com/api/auth/callback/facebook
   ```
6. Copier dans `.env`

---

## 📧 Étape 5 : Service Email (optionnel mais recommandé)

**Fichier :** `apps/backend/src/shared/email/email.service.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get("SMTP_PORT"),
      secure: false,
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASSWORD"),
      },
    });
  }

  async sendVerificationEmail(email: string, verificationUrl: string) {
    const mailOptions = {
      from: this.configService.get("EMAIL_FROM"),
      to: email,
      subject: "Vérifiez votre compte PrettyFull",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Bienvenue sur PrettyFull! 🎉</h1>
          <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Vérifier mon email
          </a>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p style="color: #666; font-size: 14px;">${verificationUrl}</p>
          <p>Ce lien expire dans 24 heures.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            Si vous n'avez pas créé de compte, ignorez cet email.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    const mailOptions = {
      from: this.configService.get("EMAIL_FROM"),
      to: email,
      subject: "Réinitialisation de votre mot de passe PrettyFull",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Réinitialisation de mot de passe</h1>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous :</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Réinitialiser mon mot de passe
          </a>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p style="color: #666; font-size: 14px;">${resetUrl}</p>
          <p>Ce lien expire dans 1 heure.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
```

---

## 🧪 Étape 6 : Tests

### 6.1 Tester l'inscription

```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test",
    "lastName": "User",
    "role": "user"
  }'
```

### 6.2 Tester la connexion

```bash
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 6.3 Tester la session

```bash
curl http://localhost:3001/api/auth/session \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

---

## 🚀 Étape 7 : Déploiement

### 7.1 Checklist de production

- [ ] Changer `BETTER_AUTH_SECRET` avec une clé forte (min 32 caractères)
- [ ] Activer `useSecureCookies` en production
- [ ] Configurer les vrais credentials OAuth
- [ ] Configurer le service email
- [ ] Ajouter les domaines de production dans `BETTER_AUTH_TRUSTED_ORIGINS`
- [ ] Activer HTTPS
- [ ] Configurer CORS correctement
- [ ] Tester tous les flows d'authentification
- [ ] Configurer les redirections OAuth en production

### 7.2 Variables d'environnement production

```env
# Production
NODE_ENV=production
BETTER_AUTH_SECRET=votre-cle-secrete-super-longue-et-aleatoire-min-32-chars
BETTER_AUTH_URL=https://api.prettyfull.com
BETTER_AUTH_TRUSTED_ORIGINS=https://prettyfull.com,https://admin.prettyfull.com

# OAuth Production
GOOGLE_CLIENT_ID=votre-prod-google-client-id
GOOGLE_CLIENT_SECRET=votre-prod-google-secret
FACEBOOK_CLIENT_ID=votre-prod-facebook-id
FACEBOOK_CLIENT_SECRET=votre-prod-facebook-secret

# Email Production
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=votre-sendgrid-api-key
EMAIL_FROM=noreply@prettyfull.com
```

---

## 📚 Étape 8 : Utilisation dans l'application

### 8.1 Protéger un endpoint backend

```typescript
import { Controller, Get, UseGuards } from "@nestjs/common";
import { BetterAuthGuard, RolesGuard } from "../auth/guards/better-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("products")
export class ProductsController {
  // Route publique
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Route authentifiée
  @Get("my-products")
  @UseGuards(BetterAuthGuard)
  findMyProducts(@CurrentUser() user: any) {
    return this.productsService.findByUser(user.id);
  }

  // Route admin uniquement
  @Post()
  @UseGuards(BetterAuthGuard, RolesGuard)
  @Roles("admin")
  create(@CurrentUser() user: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(dto, user.id);
  }
}
```

### 8.2 Protéger une page frontend

```typescript
'use client';

import { useSession } from '@/lib/auth/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Bonjour {session?.user?.firstName} !</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Rôle: {session?.user?.role}</p>
    </div>
  );
}
```

### 8.3 Bouton de déconnexion

```typescript
'use client';

import { useSignOut } from '@/lib/auth/hooks';
import { useRouter } from 'next/navigation';
import { Button } from '@prettyfull/ui';

export function SignOutButton() {
  const signOut = useSignOut();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    router.push('/');
  };

  return (
    <Button onClick={handleSignOut} variant="outline">
      Se déconnecter
    </Button>
  );
}
```

---

## 🎨 Étape 9 : Composants UI complets (optionnels)

Créez des composants d'auth complets dans `packages/ui` pour réutilisation dans `web` et `admin`.

---

## 📖 Résumé des commandes

```bash
# 1. Installation
cd apps/backend && pnpm add better-auth
cd apps/web && pnpm add better-auth @better-auth/react

# 2. Démarrer le backend
cd apps/backend && pnpm dev

# 3. Démarrer le frontend
cd apps/web && pnpm dev

# 4. Tester
# Créer un compte : http://localhost:3000/auth/signup
# Se connecter : http://localhost:3000/auth/signin
# Dashboard : http://localhost:3000/dashboard
```

---

## 🔍 Dépannage

### Problème : Session non persistante

**Solution :** Vérifier que les cookies sont bien configurés et que les domaines correspondent.

### Problème : OAuth ne fonctionne pas

**Solution :**

1. Vérifier les Redirect URIs dans Google/Facebook
2. Vérifier les credentials dans `.env`
3. Vérifier les logs backend

### Problème : Types TypeScript

**Solution :** Redémarrer le serveur TypeScript dans VS Code (Cmd+Shift+P → "TypeScript: Restart TS Server")

---

## 📚 Ressources

- [Documentation Better Auth](https://better-auth.com)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)

---

## ✅ Checklist de migration

- [ ] Installer les dépendances
- [ ] Configurer les variables d'environnement
- [ ] Créer les schemas MongoDB
- [ ] Configurer Better Auth backend
- [ ] Créer les guards et decorators
- [ ] Configurer Better Auth frontend
- [ ] Créer les composants de connexion/inscription
- [ ] Configurer OAuth (Google, Facebook)
- [ ] Tester tous les flows
- [ ] Migrer les routes protégées existantes
- [ ] Supprimer l'ancien système d'auth (Passport/JWT)
- [ ] Documenter pour l'équipe
- [ ] Déployer en production

---

**Note importante :** Ce guide remplace complètement l'ancien système Passport/JWT. Une fois Better Auth implémenté et testé, vous pouvez supprimer les anciens fichiers d'authentification (`auth.module.ts`, `jwt.strategy.ts`, `local.strategy.ts`, etc.).

Bon courage ! 🚀
