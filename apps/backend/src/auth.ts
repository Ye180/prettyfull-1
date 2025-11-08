import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin, multiSession } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';

// Initialisation du client MongoDB
const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/prettyfull-ecommerce';
const client = new MongoClient(databaseUrl);

// Connexion à MongoDB
client.connect().catch((error) => {
  console.error('MongoDB connection error:', error);
  throw error;
});

const db = client.db();

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  // Base configuration
  secret:
    process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-in-production',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:7777',
  basePath: '/api/v1/auth',

  // Trusted origins pour CORS
  trustedOrigins: (
    process.env.BETTER_AUTH_TRUSTED_ORIGINS ||
    'http://localhost:3000,http://localhost:3002'
  ).split(','),

  // MongoDB adapter
  database: mongodbAdapter(db),

  // Email and Password configuration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Mettre true en production
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // Mise à jour quotidienne
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // User configuration avec champs personnalisés
  user: {
    additionalFields: {
      // Champs existants dans votre User schema
      lastName: {
        type: 'string',
        required: true,
        defaultValue: '',
      },
      phone: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        required: true,
        defaultValue: 'user',
      },
      status: {
        type: 'string',
        required: true,
        defaultValue: 'active',
      },
      preferredLanguage: {
        type: 'string',
        required: true,
        defaultValue: 'fr',
      },
      preferredCurrency: {
        type: 'string',
        required: true,
        defaultValue: 'XOF',
      },
      country: {
        type: 'string',
        required: false,
        defaultValue: 'CI',
      },
      dateOfBirth: {
        type: 'date',
        required: false,
      },
      lastLoginAt: {
        type: 'date',
        required: false,
      },
    },
  },

  // OAuth Providers (optionnel, configurer selon besoins)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      enabled: !!process.env.FACEBOOK_CLIENT_ID,
    },
  },

  // Plugins
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 60, // 1 heure
    }),
    multiSession(),
  ],

  // Hooks (minimum requis pour utiliser @Hook decorators)
  hooks: {},

  // Configuration avancée
  advanced: {
    cookiePrefix: 'better-auth',
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Auth = typeof auth;
