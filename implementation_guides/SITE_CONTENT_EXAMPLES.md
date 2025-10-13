# Exemples de Contenu pour SiteContent

## 1. Bannière Homepage

```json
POST /site-content
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
    "imageUrl": "https://cdn.prettyfull.com/banners/hero-main.jpg",
    "mobileImageUrl": "https://cdn.prettyfull.com/banners/hero-main-mobile.jpg",
    "ctaText": {
      "fr": "Voir les produits",
      "en": "View products"
    },
    "ctaLink": "/products",
    "backgroundColor": "#FF6B6B",
    "textColor": "#FFFFFF"
  },
  "isActive": true,
  "metadata": {
    "author": "admin",
    "tags": ["homepage", "hero", "banner"],
    "notes": "Bannière principale de la page d'accueil"
  }
}
```

## 2. Section Héros avec Features

```json
POST /site-content
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
    "backgroundImage": "https://cdn.prettyfull.com/hero-bg.jpg",
    "features": [
      {
        "icon": "shipping-fast",
        "title": {
          "fr": "Livraison rapide",
          "en": "Fast delivery"
        },
        "description": {
          "fr": "Livraison en 24-48h dans toute la région",
          "en": "Delivery in 24-48h across the region"
        }
      },
      {
        "icon": "lock",
        "title": {
          "fr": "Paiement sécurisé",
          "en": "Secure payment"
        },
        "description": {
          "fr": "Transactions 100% sécurisées",
          "en": "100% secure transactions"
        }
      },
      {
        "icon": "headset",
        "title": {
          "fr": "Support 24/7",
          "en": "24/7 Support"
        },
        "description": {
          "fr": "Notre équipe est là pour vous aider",
          "en": "Our team is here to help you"
        }
      }
    ]
  },
  "isActive": true
}
```

## 3. Page À Propos

```json
POST /site-content
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
          "fr": "PrettyFull a été fondé en 2025 avec une mission simple : rendre le shopping en ligne accessible à tous. Nous croyons que tout le monde mérite d'avoir accès à des produits de qualité à des prix abordables.",
          "en": "PrettyFull was founded in 2025 with a simple mission: to make online shopping accessible to everyone. We believe that everyone deserves access to quality products at affordable prices."
        }
      },
      {
        "type": "image",
        "imageUrl": "https://cdn.prettyfull.com/about/team.jpg",
        "alt": {
          "fr": "L'équipe PrettyFull",
          "en": "The PrettyFull team"
        }
      },
      {
        "type": "text",
        "heading": {
          "fr": "Notre mission",
          "en": "Our mission"
        },
        "body": {
          "fr": "Nous nous engageons à offrir la meilleure expérience d'achat en ligne en combinant technologie de pointe, service client exceptionnel et produits de qualité.",
          "en": "We are committed to providing the best online shopping experience by combining cutting-edge technology, exceptional customer service, and quality products."
        }
      }
    ],
    "seoMeta": {
      "title": {
        "fr": "À propos - PrettyFull | E-commerce",
        "en": "About - PrettyFull | E-commerce"
      },
      "description": {
        "fr": "Découvrez l'histoire et la mission de PrettyFull, votre marketplace e-commerce de confiance.",
        "en": "Discover the story and mission of PrettyFull, your trusted e-commerce marketplace."
      },
      "keywords": ["about", "à propos", "histoire", "mission", "équipe"]
    }
  },
  "isActive": true
}
```

## 4. Page FAQ

```json
POST /site-content
{
  "key": "faq-page",
  "type": "page",
  "content": {
    "title": {
      "fr": "Questions Fréquentes",
      "en": "Frequently Asked Questions"
    },
    "categories": [
      {
        "name": {
          "fr": "Commandes et Livraison",
          "en": "Orders and Delivery"
        },
        "questions": [
          {
            "question": {
              "fr": "Combien de temps prend la livraison ?",
              "en": "How long does delivery take?"
            },
            "answer": {
              "fr": "La livraison standard prend entre 3 et 5 jours ouvrables. La livraison express est disponible sous 24-48h.",
              "en": "Standard delivery takes 3 to 5 business days. Express delivery is available within 24-48 hours."
            }
          },
          {
            "question": {
              "fr": "Puis-je suivre ma commande ?",
              "en": "Can I track my order?"
            },
            "answer": {
              "fr": "Oui, vous recevrez un numéro de suivi par email dès l'expédition de votre commande.",
              "en": "Yes, you will receive a tracking number by email as soon as your order is shipped."
            }
          }
        ]
      },
      {
        "name": {
          "fr": "Paiements",
          "en": "Payments"
        },
        "questions": [
          {
            "question": {
              "fr": "Quels modes de paiement acceptez-vous ?",
              "en": "What payment methods do you accept?"
            },
            "answer": {
              "fr": "Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money, et le paiement à la livraison.",
              "en": "We accept credit cards (Visa, Mastercard), Mobile Money, and cash on delivery."
            }
          }
        ]
      }
    ]
  },
  "isActive": true
}
```

## 5. Footer Block

```json
POST /site-content
{
  "key": "footer-content",
  "type": "block",
  "content": {
    "columns": [
      {
        "title": {
          "fr": "À propos",
          "en": "About"
        },
        "links": [
          {
            "label": {
              "fr": "Qui sommes-nous",
              "en": "About us"
            },
            "url": "/about"
          },
          {
            "label": {
              "fr": "Contact",
              "en": "Contact"
            },
            "url": "/contact"
          }
        ]
      },
      {
        "title": {
          "fr": "Aide",
          "en": "Help"
        },
        "links": [
          {
            "label": {
              "fr": "FAQ",
              "en": "FAQ"
            },
            "url": "/faq"
          },
          {
            "label": {
              "fr": "Livraison",
              "en": "Shipping"
            },
            "url": "/shipping"
          }
        ]
      }
    ],
    "social": {
      "facebook": "https://facebook.com/prettyfull",
      "instagram": "https://instagram.com/prettyfull",
      "twitter": "https://twitter.com/prettyfull"
    },
    "copyright": {
      "fr": "© 2025 PrettyFull. Tous droits réservés.",
      "en": "© 2025 PrettyFull. All rights reserved."
    }
  },
  "isActive": true
}
```

## Tests d'utilisation

### Créer un contenu (Admin)

```bash
curl -X POST http://localhost:3000/site-content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d @example-banner.json
```

### Publier un contenu (Admin)

```bash
curl -X POST http://localhost:3000/site-content/home-hero-banner/publish \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"publishedBy": "admin-user-id"}'
```

### Récupérer un contenu (Public)

```bash
# En français
curl http://localhost:3000/site-content/home-hero-banner \
  -H "Accept-Language: fr"

# Réponse transformée :
{
  "key": "home-hero-banner",
  "type": "banner",
  "content": {
    "title": "Découvrez nos nouveautés",
    "subtitle": "Les meilleurs produits au meilleur prix",
    "imageUrl": "https://cdn.prettyfull.com/banners/hero-main.jpg",
    "mobileImageUrl": "https://cdn.prettyfull.com/banners/hero-main-mobile.jpg",
    "ctaText": "Voir les produits",
    "ctaLink": "/products",
    "backgroundColor": "#FF6B6B",
    "textColor": "#FFFFFF"
  },
  "publishedAt": "2025-10-11T12:00:00.000Z"
}

# En anglais
curl http://localhost:3000/site-content/home-hero-banner \
  -H "Accept-Language: en"

# Réponse transformée :
{
  "key": "home-hero-banner",
  "type": "banner",
  "content": {
    "title": "Discover our new products",
    "subtitle": "The best products at the best price",
    ...
  }
}
```

### Lister tous les contenus (Admin)

```bash
curl http://localhost:3000/site-content?type=banner&includeInactive=true \
  -H "Authorization: Bearer <admin-token>"
```
