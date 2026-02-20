import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "eur",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  
  const regionModuleService = container.resolve(Modules.REGION);
  const existingRegions = await regionModuleService.listRegions();
  
  let region;
  if (existingRegions.length > 0) {
    logger.info(`Found ${existingRegions.length} existing regions. Skipping region creation.`);
    region = existingRegions[0];
  } else {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Europe",
            currency_code: "eur",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
    logger.info("Finished seeding regions.");
  }

  logger.info("Seeding tax regions...");
  const taxRegionModuleService = container.resolve(Modules.TAX);
  const existingTaxRegions = await taxRegionModuleService.listTaxRegions();
  
  if (existingTaxRegions.length > 0) {
    logger.info(`Found ${existingTaxRegions.length} existing tax regions. Skipping tax region creation.`);
  } else {
    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
    logger.info("Finished seeding tax regions.");
  }

  logger.info("Seeding stock location data...");
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  const existingStockLocations = await stockLocationModuleService.listStockLocations({});
  
  let stockLocation;
  if (existingStockLocations.length > 0) {
    logger.info(`Found ${existingStockLocations.length} existing stock locations. Using first one.`);
    stockLocation = existingStockLocations[0];
  } else {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "European Warehouse",
            address: {
              city: "Copenhagen",
              country_code: "DK",
              address_1: "",
            },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product categories...");

  const parentCategories = [
    {
      name: "WOMEN",
      handle: "women",
      is_active: true,
      is_internal: false,
      description: "Women's fashion collection",
    },
    {
      name: "PLUS+CURVE",
      handle: "plus-curve",
      is_active: true,
      is_internal: false,
      description: "Plus size and curve fashion",
    },
    {
      name: "MEN",
      handle: "men",
      is_active: true,
      is_internal: false,
      description: "Men's fashion collection",
    },
    {
      name: "SPORT",
      handle: "sport",
      is_active: true,
      is_internal: false,
      description: "Sportswear and athletic clothing",
    },
    {
      name: "KIDS",
      handle: "kids",
      is_active: true,
      is_internal: false,
      description: "Kids fashion collection",
    },
    {
      name: "BEAUTY",
      handle: "beauty",
      is_active: true,
      is_internal: false,
      description: "Beauty products and accessories",
    },
  ];

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: parentCategories,
    },
  });

  logger.info(`Created ${categoryResult.length} parent categories.`);

  const womenCategory = categoryResult.find((cat) => cat.handle === "women");
  const menCategory = categoryResult.find((cat) => cat.handle === "men");
  const sportCategory = categoryResult.find((cat) => cat.handle === "sport");
  const kidsCategory = categoryResult.find((cat) => cat.handle === "kids");
  const plusCurveCategory = categoryResult.find((cat) => cat.handle === "plus-curve");
  const beautyCategory = categoryResult.find((cat) => cat.handle === "beauty");

  const childCategories: {
    name: string;
    handle: string;
    is_active: boolean;
    is_internal: boolean;
    parent_category_id: string;
    description: string;
  }[] = [];

  if (womenCategory) {
    childCategories.push(
      {
        name: "New In",
        handle: "women-new-in",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Latest arrivals for women",
      },
      {
        name: "Clothing",
        handle: "women-clothing",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Women's clothing collection",
      },
      {
        name: "NovaDEALS",
        handle: "women-novadeals",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Special deals for women",
      },
      {
        name: "Dresses",
        handle: "women-dresses",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Women's dresses collection",
      },
      {
        name: "Matching Sets",
        handle: "women-matching-sets",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Coordinated matching sets",
      },
      {
        name: "Tops",
        handle: "women-tops",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Women's tops collection",
      },
      {
        name: "Graphics",
        handle: "women-graphics",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Graphic tees and printed clothing",
      },
      {
        name: "Jumpsuits & Rompers",
        handle: "women-jumpsuits-rompers",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Jumpsuits and rompers collection",
      },
      {
        name: "Bottoms",
        handle: "women-bottoms",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Women's bottoms: pants, skirts, shorts",
      },
      {
        name: "Shoes",
        handle: "women-shoes",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Women's footwear collection",
      },
      {
        name: "Accessories",
        handle: "women-accessories",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Women's accessories",
      },
      {
        name: "Swimwear",
        handle: "women-swimwear",
        is_active: true,
        is_internal: false,
        parent_category_id: womenCategory.id,
        description: "Swimwear and beachwear",
      }
    );
  }

  if (menCategory) {
    childCategories.push(
      {
        name: "New In",
        handle: "men-new-in",
        is_active: true,
        is_internal: false,
        parent_category_id: menCategory.id,
        description: "Latest arrivals for men",
      },
      {
        name: "Clothing",
        handle: "men-clothing",
        is_active: true,
        is_internal: false,
        parent_category_id: menCategory.id,
        description: "Men's clothing collection",
      },
      {
        name: "Tops",
        handle: "men-tops",
        is_active: true,
        is_internal: false,
        parent_category_id: menCategory.id,
        description: "Men's tops collection",
      },
      {
        name: "Bottoms",
        handle: "men-bottoms",
        is_active: true,
        is_internal: false,
        parent_category_id: menCategory.id,
        description: "Men's bottoms: pants, jeans, shorts",
      },
      {
        name: "Shoes",
        handle: "men-shoes",
        is_active: true,
        is_internal: false,
        parent_category_id: menCategory.id,
        description: "Men's footwear collection",
      },
      {
        name: "Accessories",
        handle: "men-accessories",
        is_active: true,
        is_internal: false,
        parent_category_id: menCategory.id,
        description: "Men's accessories",
      }
    );
  }

  if (sportCategory) {
    childCategories.push(
      {
        name: "Activewear",
        handle: "sport-activewear",
        is_active: true,
        is_internal: false,
        parent_category_id: sportCategory.id,
        description: "Athletic and workout clothing",
      },
      {
        name: "Sports Tops",
        handle: "sport-tops",
        is_active: true,
        is_internal: false,
        parent_category_id: sportCategory.id,
        description: "Sports tops and t-shirts",
      },
      {
        name: "Sports Bottoms",
        handle: "sport-bottoms",
        is_active: true,
        is_internal: false,
        parent_category_id: sportCategory.id,
        description: "Sports pants and leggings",
      },
      {
        name: "Sports Shoes",
        handle: "sport-shoes",
        is_active: true,
        is_internal: false,
        parent_category_id: sportCategory.id,
        description: "Athletic footwear",
      }
    );
  }

  if (kidsCategory) {
    childCategories.push(
      {
        name: "Girls",
        handle: "kids-girls",
        is_active: true,
        is_internal: false,
        parent_category_id: kidsCategory.id,
        description: "Girls clothing collection",
      },
      {
        name: "Boys",
        handle: "kids-boys",
        is_active: true,
        is_internal: false,
        parent_category_id: kidsCategory.id,
        description: "Boys clothing collection",
      },
      {
        name: "Baby",
        handle: "kids-baby",
        is_active: true,
        is_internal: false,
        parent_category_id: kidsCategory.id,
        description: "Baby clothing and essentials",
      }
    );
  }

  if (plusCurveCategory) {
    childCategories.push(
      {
        name: "New In",
        handle: "plus-curve-new-in",
        is_active: true,
        is_internal: false,
        parent_category_id: plusCurveCategory.id,
        description: "Latest arrivals in plus sizes",
      },
      {
        name: "Dresses",
        handle: "plus-curve-dresses",
        is_active: true,
        is_internal: false,
        parent_category_id: plusCurveCategory.id,
        description: "Plus size dresses",
      },
      {
        name: "Tops",
        handle: "plus-curve-tops",
        is_active: true,
        is_internal: false,
        parent_category_id: plusCurveCategory.id,
        description: "Plus size tops",
      },
      {
        name: "Bottoms",
        handle: "plus-curve-bottoms",
        is_active: true,
        is_internal: false,
        parent_category_id: plusCurveCategory.id,
        description: "Plus size bottoms",
      }
    );
  }

  if (beautyCategory) {
    childCategories.push(
      {
        name: "Makeup",
        handle: "beauty-makeup",
        is_active: true,
        is_internal: false,
        parent_category_id: beautyCategory.id,
        description: "Makeup products",
      },
      {
        name: "Skincare",
        handle: "beauty-skincare",
        is_active: true,
        is_internal: false,
        parent_category_id: beautyCategory.id,
        description: "Skincare products",
      },
      {
        name: "Hair Care",
        handle: "beauty-hair-care",
        is_active: true,
        is_internal: false,
        parent_category_id: beautyCategory.id,
        description: "Hair care products",
      },
      {
        name: "Fragrance",
        handle: "beauty-fragrance",
        is_active: true,
        is_internal: false,
        parent_category_id: beautyCategory.id,
        description: "Perfumes and fragrances",
      }
    );
  }

  if (childCategories.length > 0) {
    const { result: createdChildCategories } =
      await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: childCategories,
        },
      });

    logger.info(`Created ${createdChildCategories.length} child categories.`);
  }

  logger.info("Finished seeding categories.");
  logger.info("Seeding product data...");

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Medusa T-Shirt",
          category_ids: womenCategory ? [womenCategory.id] : [],
          description:
            "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.",
          handle: "t-shirt",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "S / Black",
              sku: "SHIRT-S-BLACK",
              options: {
                Size: "S",
                Color: "Black",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "S / White",
              sku: "SHIRT-S-WHITE",
              options: {
                Size: "S",
                Color: "White",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M / Black",
              sku: "SHIRT-M-BLACK",
              options: {
                Size: "M",
                Color: "Black",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M / White",
              sku: "SHIRT-M-WHITE",
              options: {
                Size: "M",
                Color: "White",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L / Black",
              sku: "SHIRT-L-BLACK",
              options: {
                Size: "L",
                Color: "Black",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L / White",
              sku: "SHIRT-L-WHITE",
              options: {
                Size: "L",
                Color: "White",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL / Black",
              sku: "SHIRT-XL-BLACK",
              options: {
                Size: "XL",
                Color: "Black",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL / White",
              sku: "SHIRT-XL-WHITE",
              options: {
                Size: "XL",
                Color: "White",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Medusa Sweatshirt",
          category_ids: womenCategory ? [womenCategory.id] : [],
          description:
            "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
          handle: "sweatshirt",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "SWEATSHIRT-S",
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M",
              sku: "SWEATSHIRT-M",
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L",
              sku: "SWEATSHIRT-L",
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL",
              sku: "SWEATSHIRT-XL",
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Medusa Sweatpants",
          category_ids: womenCategory ? [womenCategory.id] : [],
          description:
            "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.",
          handle: "sweatpants",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "SWEATPANTS-S",
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M",
              sku: "SWEATPANTS-M",
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L",
              sku: "SWEATPANTS-L",
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL",
              sku: "SWEATPANTS-XL",
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Medusa Shorts",
          category_ids: menCategory ? [menCategory.id] : [],
          description:
            "Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.",
          handle: "shorts",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "SHORTS-S",
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M",
              sku: "SHORTS-M",
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L",
              sku: "SHORTS-L",
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL",
              sku: "SHORTS-XL",
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}




