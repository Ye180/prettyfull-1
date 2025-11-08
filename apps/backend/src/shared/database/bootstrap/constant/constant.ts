export const CATEGORY = [
  {
    name: {
      fr: 'Femme',
      en: 'Woman',
    },
    slug: 'woman',
    description: {
      fr: 'Mode et accessoires pour femme : chaussures, vêtements et articles de sport.',
      en: 'Fashion and accessories for women: shoes, clothing, and sports gear.',
    },
    countries: ['CI', 'SN', 'FR'],
    isActive: true,
    isVisible: true,
    displayOrder: 1,
    first: true,
    parent: null,
    children: [],
    icon: 'fa-solid fa-person-dress',
    image: 'https://cdn.example.com/images/categories/woman-fashion.jpg',
    second: false,
    seoMeta: {
      title: {
        fr: 'Femme - Mode, chaussures et accessoires',
        en: 'Woman - Fashion, Shoes & Accessories',
      },
      description: {
        fr: 'Découvrez les dernières tendances femme : vêtements, baskets, accessoires et plus encore.',
        en: "Discover the latest women's trends: clothing, sneakers, accessories and more.",
      },
      keywords: ['femme', 'mode', 'chaussures', 'vêtements', 'accessoires'],
    },
  },
  {
    name: {
      fr: 'Homme',
      en: 'Man',
    },
    slug: 'man',
    description: {
      fr: 'Mode et accessoires pour homme : chaussures, vêtements et articles de sport.',
      en: 'Fashion and accessories for men: shoes, clothing, and sports gear.',
    },
    countries: ['CI', 'SN', 'FR'],
    isActive: true,
    isVisible: true,
    displayOrder: 2,
    first: true,
    parent: null,
    children: [],
    icon: 'fa-solid fa-person',
    image: 'https://cdn.example.com/images/CategoriesModule/man-fashion.jpg',
    second: false,
    seoMeta: {
      title: {
        fr: 'Homme - Mode, chaussures et accessoires',
        en: 'Man - Fashion, Shoes & Accessories',
      },
      description: {
        fr: 'Découvrez les dernières tendances homme : vêtements, baskets, accessoires et plus encore.',
        en: "Discover the latest men's trends: clothing, sneakers, accessories and more.",
      },
      keywords: ['homme', 'mode', 'chaussures', 'vêtements', 'accessoires'],
    },
  },

  {
    name: {
      fr: 'Enfant',
      en: 'Child',
    },
    slug: 'child',
    description: {
      fr: 'Mode et accessoires pour enfant : chaussures, vêtements et articles de sport.',
      en: 'Fashion and accessories for children: shoes, clothing, and sports gear.',
    },
    countries: ['CI', 'SN', 'FR'],
    isActive: true,
    isVisible: true,
    displayOrder: 3,
    first: true,
    parent: null,
    children: [],
    icon: 'fa-solid fa-person-child',
    image: 'https://cdn.example.com/images/categories/child-fashion.jpg',
    second: false,
    seoMeta: {
      title: {
        fr: 'Enfant - Mode, chaussures et accessoires',
        en: 'Child - Fashion, Shoes & Accessories',
      },
      description: {
        fr: 'Découvrez les dernières tendances enfant : vêtements, baskets, accessoires et plus encore.',
        en: "Discover the latest children's trends: clothing, sneakers, accessories and more.",
      },
      keywords: ['enfant', 'mode', 'chaussures', 'vêtements', 'accessoires'],
    },
  },

  //Sous categories exemple
  {
    name: {
      fr: 'Chaussures Femme',
      en: 'Women Shoes',
    },
    slug: 'women-shoes',
    description: {
      fr: 'Découvrez notre collection de chaussures pour femmes : élégantes, confortables et tendance.',
      en: 'Discover our collection of women shoes: stylish, comfortable, and trendy.',
    },
    countries: ['CI', 'SN', 'FR'],
    isActive: true,
    isVisible: true,
    displayOrder: 1,
    first: false,
    parent: '690f461c67110a30aea4a6fe',
    children: [],
    icon: 'fa-solid fa-shoe-prints',
    image: 'https://cdn.example.com/images/categories/women-shoes.jpg',
    second: true,
    seoMeta: {
      title: {
        fr: 'Chaussures Femme - Mode, confort et élégance',
        en: 'Women Shoes - Fashion, Comfort & Elegance',
      },
      description: {
        fr: 'Découvrez les dernières tendances en matière de chaussures pour femmes : confort, style et élégance.',
        en: "Discover the latest trends in women's shoes: comfort, style, and elegance.",
      },
      keywords: ['chaussures', 'femme', 'mode', 'confort', 'élégance'],
    },
  },

  //Sous categories exemple homme

  // {
  //   name: {
  //     fr: 'Chaussures Homme',
  //     en: 'Men Shoes',
  //   },
  //   slug: 'men-shoes',
  //   description: {
  //     fr: 'Découvrez notre collection de chaussures pour hommes : élégantes, confortables et tendance.',
  //     en: 'Discover our collection of men shoes: stylish, comfortable, and trendy.',
  //   },
  //   countries: ['CI', 'SN', 'FR'],
  //   isActive: true,
  //   isVisible: true,
  //   displayOrder: 1,
  //   first: false,
  //   parent: '690f461d67110a30aea4a704',
  //   children: [],
  //   icon: 'fa-solid fa-shoe-prints',
  //   image: 'https://cdn.example.com/images/categories/men-shoes.jpg',
  //   second: true,
  //   seoMeta: {
  //     title: {
  //       fr: 'Chaussures Homme - Mode, confort et élégance',
  //       en: 'Men Shoes - Fashion, Comfort & Elegance',
  //     },
  //     description: {
  //       fr: 'Découvrez les dernières tendances en matière de chaussures pour hommes : confort, style et élégance.',
  //       en: "Discover the latest trends in men's shoes: comfort, style, and elegance.",
  //     },
  //     keywords: ['chaussures', 'homme', 'mode', 'confort', 'élégance'],
  //   },
  // },
];

export const PRODUCTS = [
  {
    name: {
      fr: "Manteau d'hiver chic pour chien",
      en: 'Stylish Winter Dog Coat',
    },
    description: {
      fr: 'Un manteau chaud et élégant pour garder votre chien au chaud pendant les promenades hivernales.',
      en: 'A warm and stylish coat to keep your dog cozy during winter walks.',
    },
    smallDescription: {
      fr: 'Manteau chaud et élégant.',
      en: 'Warm and stylish coat.',
    },
    categoryId: '690f48a15efe858eb76c759a', // Remplace par ton ID réel de catégorie
    link: '/produits/manteau-hiver-chien',
    slug: 'manteau-hiver-chien',
    sku: 'DOG-COAT-001',
    price: {
      amount: { fr: 50000, en: 44.99 },
      currency: { fr: 'XOF', en: 'USD' },
    },
    solde: true,
    promotion: null,
    variable: [
      {
        color: { label: 'Rouge', code: '#FF0000' },
        size: ['S', 'M', 'L'],
        image: [
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1974',
          'https://images.unsplash.com/photo-1666358777322-a25eda95848f?auto=format&fit=crop&q=80&w=1974',
        ],
        quantity: 15,
      },
      {
        color: { label: 'Bleu marine', code: '#001F3F' },
        size: ['S', 'M', 'L'],
        image: [
          'https://images.unsplash.com/photo-1666358777322-a25eda95848f?auto=format&fit=crop&q=80&w=1974',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1974',
        ],
        quantity: 12,
      },
    ],
    isActive: true,
    isFeatured: true,
    seoMeta: {
      title: {
        fr: "Manteau d'hiver chic pour chien | DogFashion",
        en: 'Stylish Winter Dog Coat | DogFashion',
      },
      description: {
        fr: "Découvrez notre manteau d'hiver pour chien, confortable, chaud et élégant. Disponible en plusieurs couleurs.",
        en: 'Discover our stylish winter coat for dogs, warm and elegant. Available in multiple colors.',
      },
      keywords: [
        'manteau chien',
        'vêtement chien',
        'mode canine',
        'dog coat',
        'fashion',
      ],
    },
  },
];
