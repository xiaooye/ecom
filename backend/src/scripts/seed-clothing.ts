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
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies-clothing",
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

// ---------------------------------------------------------------------------
// Medusa public placeholder images (reused from the default seed)
// ---------------------------------------------------------------------------
const IMG = {
  teeBlackFront:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
  teeBlackBack:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
  teeWhiteFront:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
  teeWhiteBack:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
  sweatshirtFront:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
  sweatshirtBack:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
  sweatpantsFront:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
  sweatpantsBack:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
  shortsFront:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
  shortsBack:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
};

// ---------------------------------------------------------------------------
// Variant helper – generates Size x Color variants for a product
// ---------------------------------------------------------------------------
type VariantDef = {
  title: string;
  sku: string;
  options: Record<string, string>;
  prices: { amount: number; currency_code: string }[];
};

function buildSizeColorVariants(
  skuPrefix: string,
  eurPrice: number,
  usdPrice: number,
  sizes: string[],
  colors: string[]
): VariantDef[] {
  const variants: VariantDef[] = [];
  for (const size of sizes) {
    for (const color of colors) {
      variants.push({
        title: `${size} / ${color}`,
        sku: `${skuPrefix}-${size}-${color.toUpperCase().replace(/\s+/g, "")}`,
        options: { Size: size, Color: color },
        prices: [
          { amount: eurPrice, currency_code: "eur" },
          { amount: usdPrice, currency_code: "usd" },
        ],
      });
    }
  }
  return variants;
}

function buildSizeOnlyVariants(
  skuPrefix: string,
  eurPrice: number,
  usdPrice: number,
  sizes: string[]
): VariantDef[] {
  return sizes.map((size) => ({
    title: size,
    sku: `${skuPrefix}-${size}`,
    options: { Size: size },
    prices: [
      { amount: eurPrice, currency_code: "eur" },
      { amount: usdPrice, currency_code: "usd" },
    ],
  }));
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
export default async function seedClothingData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["us", "gb", "de", "dk", "se", "fr", "es", "it"];

  // -----------------------------------------------------------------------
  // Store & Sales Channel
  // -----------------------------------------------------------------------
  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
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

  // -----------------------------------------------------------------------
  // Regions – Europe (EUR) + United States (USD)
  // -----------------------------------------------------------------------
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries: ["gb", "de", "dk", "se", "fr", "es", "it"],
          payment_providers: ["pp_system_default"],
        },
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const europeRegion = regionResult[0];
  const usRegion = regionResult[1];
  logger.info("Finished seeding regions.");

  // -----------------------------------------------------------------------
  // Tax Regions
  // -----------------------------------------------------------------------
  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  // -----------------------------------------------------------------------
  // Stock Locations – EU warehouse + US warehouse
  // -----------------------------------------------------------------------
  logger.info("Seeding stock location data...");
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
        {
          name: "US Warehouse",
          address: {
            city: "New York",
            country_code: "US",
            address_1: "",
          },
        },
      ],
    },
  });
  const euStockLocation = stockLocationResult[0];
  const usStockLocation = stockLocationResult[1];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: usStockLocation.id,
      },
    },
  });

  // Link both stock locations to the manual fulfillment provider
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: euStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: usStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  // -----------------------------------------------------------------------
  // Fulfillment – Shipping Profiles, Fulfillment Sets, Shipping Options
  // -----------------------------------------------------------------------
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

  // EU fulfillment set
  const euFulfillmentSet =
    await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: [
            { country_code: "gb", type: "country" },
            { country_code: "de", type: "country" },
            { country_code: "dk", type: "country" },
            { country_code: "se", type: "country" },
            { country_code: "fr", type: "country" },
            { country_code: "es", type: "country" },
            { country_code: "it", type: "country" },
          ],
        },
      ],
    });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: euStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: euFulfillmentSet.id,
    },
  });

  // US fulfillment set
  const usFulfillmentSet =
    await fulfillmentModuleService.createFulfillmentSets({
      name: "US Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "United States",
          geo_zones: [{ country_code: "us", type: "country" }],
        },
      ],
    });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: usStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: usFulfillmentSet.id,
    },
  });

  // Shipping options for EU
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: euFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          { currency_code: "usd", amount: 10 },
          { currency_code: "eur", amount: 10 },
          { region_id: europeRegion.id, amount: 10 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: euFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          { currency_code: "usd", amount: 20 },
          { currency_code: "eur", amount: 20 },
          { region_id: europeRegion.id, amount: 20 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  });

  // Shipping options for US
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: usFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 3-5 business days.",
          code: "standard",
        },
        prices: [
          { currency_code: "usd", amount: 8 },
          { currency_code: "eur", amount: 8 },
          { region_id: usRegion.id, amount: 8 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: usFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 1-2 business days.",
          code: "express",
        },
        prices: [
          { currency_code: "usd", amount: 18 },
          { currency_code: "eur", amount: 18 },
          { region_id: usRegion.id, amount: 18 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  // Link sales channels to both stock locations
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: euStockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: usStockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  // -----------------------------------------------------------------------
  // Publishable API Key
  // -----------------------------------------------------------------------
  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
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

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  // -----------------------------------------------------------------------
  // Product Categories
  // -----------------------------------------------------------------------
  logger.info("Seeding product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Shirts", is_active: true },
        { name: "T-Shirts", is_active: true },
        { name: "Sweatshirts", is_active: true },
        { name: "Pants", is_active: true },
        { name: "Shorts", is_active: true },
        { name: "Accessories", is_active: true },
      ],
    },
  });

  const catId = (name: string) =>
    categoryResult.find((cat) => cat.name === name)!.id;

  logger.info("Finished seeding product categories.");

  // -----------------------------------------------------------------------
  // Shared helpers
  // -----------------------------------------------------------------------
  const SIZES = ["S", "M", "L", "XL"];
  const salesChannels = [{ id: defaultSalesChannel[0].id }];

  // -----------------------------------------------------------------------
  // Products – 32 total across 6 categories
  // -----------------------------------------------------------------------
  logger.info("Seeding product data...");

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // =================================================================
        // SHIRTS (6 products)
        // =================================================================
        {
          title: "Classic Oxford Shirt",
          category_ids: [catId("Shirts")],
          description:
            "A timeless button-down Oxford shirt crafted from premium cotton. Perfect for both office and weekend wear.",
          handle: "classic-oxford-shirt",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeWhiteFront },
            { url: IMG.teeWhiteBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["White", "Navy", "Light Blue"] },
          ],
          variants: buildSizeColorVariants("OXFORD", 45, 50, SIZES, ["White", "Navy", "Light Blue"]),
          sales_channels: salesChannels,
        },
        {
          title: "Slim Fit Dress Shirt",
          category_ids: [catId("Shirts")],
          description:
            "Elevated tailoring meets everyday comfort. This slim fit dress shirt features a spread collar and French cuffs.",
          handle: "slim-fit-dress-shirt",
          weight: 280,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeWhiteFront },
            { url: IMG.teeWhiteBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["White", "Black"] },
          ],
          variants: buildSizeColorVariants("DRESSSHIRT", 55, 60, SIZES, ["White", "Black"]),
          sales_channels: salesChannels,
        },
        {
          title: "Linen Camp Collar Shirt",
          category_ids: [catId("Shirts")],
          description:
            "Relaxed linen shirt with a camp collar for effortless warm-weather style. Breathable and lightweight.",
          handle: "linen-camp-collar-shirt",
          weight: 220,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeWhiteFront },
            { url: IMG.teeWhiteBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["White", "Olive", "Sand"] },
          ],
          variants: buildSizeColorVariants("LINENCAMP", 50, 55, SIZES, ["White", "Olive", "Sand"]),
          sales_channels: salesChannels,
        },
        {
          title: "Flannel Check Shirt",
          category_ids: [catId("Shirts")],
          description:
            "Soft brushed flannel in a classic check pattern. Ideal for layering during the cooler months.",
          handle: "flannel-check-shirt",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
            { url: IMG.teeBlackBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Red", "Navy"] },
          ],
          variants: buildSizeColorVariants("FLANNEL", 42, 48, SIZES, ["Red", "Navy"]),
          sales_channels: salesChannels,
        },
        {
          title: "Chambray Casual Shirt",
          category_ids: [catId("Shirts")],
          description:
            "Washed chambray fabric gives this shirt a broken-in feel from day one. A versatile wardrobe staple.",
          handle: "chambray-casual-shirt",
          weight: 290,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
            { url: IMG.teeBlackBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Light Blue", "Indigo"] },
          ],
          variants: buildSizeColorVariants("CHAMBRAY", 40, 45, SIZES, ["Light Blue", "Indigo"]),
          sales_channels: salesChannels,
        },
        {
          title: "Denim Western Shirt",
          category_ids: [catId("Shirts")],
          description:
            "Rugged denim shirt with snap buttons and western yoke detailing. Built to last.",
          handle: "denim-western-shirt",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
            { url: IMG.teeBlackBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Indigo", "Black"] },
          ],
          variants: buildSizeColorVariants("DENIMWEST", 55, 62, SIZES, ["Indigo", "Black"]),
          sales_channels: salesChannels,
        },

        // =================================================================
        // T-SHIRTS (6 products)
        // =================================================================
        {
          title: "Essential Crew Neck Tee",
          category_ids: [catId("T-Shirts")],
          description:
            "The perfect everyday tee. Made from 100% combed cotton for a super-soft hand feel.",
          handle: "essential-crew-neck-tee",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
            { url: IMG.teeBlackBack },
            { url: IMG.teeWhiteFront },
            { url: IMG.teeWhiteBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "White", "Gray", "Navy"] },
          ],
          variants: buildSizeColorVariants("CREWNECK", 18, 20, SIZES, ["Black", "White", "Gray", "Navy"]),
          sales_channels: salesChannels,
        },
        {
          title: "V-Neck Classic Tee",
          category_ids: [catId("T-Shirts")],
          description:
            "A clean V-neck silhouette in premium jersey cotton. Slightly longer body for a modern fit.",
          handle: "v-neck-classic-tee",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeWhiteFront },
            { url: IMG.teeWhiteBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["White", "Black", "Heather Gray"] },
          ],
          variants: buildSizeColorVariants("VNECK", 20, 22, SIZES, ["White", "Black", "Heather Gray"]),
          sales_channels: salesChannels,
        },
        {
          title: "Graphic Print Tee",
          category_ids: [catId("T-Shirts")],
          description:
            "Bold graphic print on heavyweight cotton. Stand out with this statement piece.",
          handle: "graphic-print-tee",
          weight: 240,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
            { url: IMG.teeBlackBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "White"] },
          ],
          variants: buildSizeColorVariants("GRAPHIC", 25, 28, SIZES, ["Black", "White"]),
          sales_channels: salesChannels,
        },
        {
          title: "Striped Pocket Tee",
          category_ids: [catId("T-Shirts")],
          description:
            "Nautical-inspired stripe pattern with a chest pocket detail. Relaxed weekend vibes.",
          handle: "striped-pocket-tee",
          weight: 210,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeWhiteFront },
            { url: IMG.teeWhiteBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["White", "Navy"] },
          ],
          variants: buildSizeColorVariants("STRIPEPKT", 22, 25, SIZES, ["White", "Navy"]),
          sales_channels: salesChannels,
        },
        {
          title: "Oversized Drop Shoulder Tee",
          category_ids: [catId("T-Shirts")],
          description:
            "Relaxed oversized fit with dropped shoulders. Heavyweight 250 GSM cotton for a premium drape.",
          handle: "oversized-drop-shoulder-tee",
          weight: 260,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
            { url: IMG.teeBlackBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Sand", "Olive"] },
          ],
          variants: buildSizeColorVariants("OVERSIZED", 28, 32, SIZES, ["Black", "Sand", "Olive"]),
          sales_channels: salesChannels,
        },
        {
          title: "Long Sleeve Henley Tee",
          category_ids: [catId("T-Shirts")],
          description:
            "A three-button Henley neckline adds character to this long-sleeve essential. Ribbed cuffs for a clean finish.",
          handle: "long-sleeve-henley-tee",
          weight: 270,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
            { url: IMG.teeWhiteFront },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "White", "Burgundy"] },
          ],
          variants: buildSizeColorVariants("HENLEY", 30, 35, SIZES, ["Black", "White", "Burgundy"]),
          sales_channels: salesChannels,
        },

        // =================================================================
        // SWEATSHIRTS (5 products)
        // =================================================================
        {
          title: "Classic Crewneck Sweatshirt",
          category_ids: [catId("Sweatshirts")],
          description:
            "Heavyweight French terry crewneck sweatshirt. Brushed interior for warmth and comfort.",
          handle: "classic-crewneck-sweatshirt",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatshirtFront },
            { url: IMG.sweatshirtBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Gray", "Navy"] },
          ],
          variants: buildSizeColorVariants("CREWSWEAT", 45, 50, SIZES, ["Black", "Gray", "Navy"]),
          sales_channels: salesChannels,
        },
        {
          title: "Zip-Up Hoodie",
          category_ids: [catId("Sweatshirts")],
          description:
            "Full-zip hoodie with a kangaroo pocket and ribbed trim. Your go-to layer for every season.",
          handle: "zip-up-hoodie",
          weight: 550,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatshirtFront },
            { url: IMG.sweatshirtBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Charcoal", "Navy"] },
          ],
          variants: buildSizeColorVariants("ZIPHOODIE", 55, 62, SIZES, ["Black", "Charcoal", "Navy"]),
          sales_channels: salesChannels,
        },
        {
          title: "Pullover Hoodie",
          category_ids: [catId("Sweatshirts")],
          description:
            "Oversized pullover hoodie in soft-washed fleece. Features a drawstring hood and front pouch pocket.",
          handle: "pullover-hoodie",
          weight: 580,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatshirtFront },
            { url: IMG.sweatshirtBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Heather Gray", "Forest Green"] },
          ],
          variants: buildSizeColorVariants("PULLHOODIE", 52, 58, SIZES, ["Black", "Heather Gray", "Forest Green"]),
          sales_channels: salesChannels,
        },
        {
          title: "Quarter-Zip Fleece",
          category_ids: [catId("Sweatshirts")],
          description:
            "Cozy quarter-zip fleece with a stand-up collar. Perfect mid-layer for chilly mornings.",
          handle: "quarter-zip-fleece",
          weight: 480,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatshirtFront },
            { url: IMG.sweatshirtBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Navy", "Oatmeal"] },
          ],
          variants: buildSizeColorVariants("QZFLEECE", 48, 55, SIZES, ["Navy", "Oatmeal"]),
          sales_channels: salesChannels,
        },
        {
          title: "Vintage Wash Sweatshirt",
          category_ids: [catId("Sweatshirts")],
          description:
            "Garment-dyed sweatshirt with a lived-in vintage wash. Soft, relaxed, and effortlessly cool.",
          handle: "vintage-wash-sweatshirt",
          weight: 460,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatshirtFront },
            { url: IMG.sweatshirtBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Washed Black", "Dusty Rose", "Sage"] },
          ],
          variants: buildSizeColorVariants("VINTSWEAT", 50, 56, SIZES, ["Washed Black", "Dusty Rose", "Sage"]),
          sales_channels: salesChannels,
        },

        // =================================================================
        // PANTS (6 products)
        // =================================================================
        {
          title: "Slim Fit Chinos",
          category_ids: [catId("Pants")],
          description:
            "Modern slim fit chinos in stretch cotton twill. Clean lines from office to dinner.",
          handle: "slim-fit-chinos",
          weight: 450,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatpantsFront },
            { url: IMG.sweatpantsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Khaki", "Navy", "Black", "Olive"] },
          ],
          variants: buildSizeColorVariants("CHINO", 45, 50, SIZES, ["Khaki", "Navy", "Black", "Olive"]),
          sales_channels: salesChannels,
        },
        {
          title: "Straight Leg Jeans",
          category_ids: [catId("Pants")],
          description:
            "Classic straight-leg jeans in rigid selvedge denim. Built to break in beautifully over time.",
          handle: "straight-leg-jeans",
          weight: 600,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatpantsFront },
            { url: IMG.sweatpantsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Indigo", "Black", "Light Wash"] },
          ],
          variants: buildSizeColorVariants("STRAIGHTJN", 60, 68, SIZES, ["Indigo", "Black", "Light Wash"]),
          sales_channels: salesChannels,
        },
        {
          title: "Tapered Jogger Pants",
          category_ids: [catId("Pants")],
          description:
            "Athletic-inspired jogger with a tapered leg and elastic cuffs. Comfortable enough for all day.",
          handle: "tapered-jogger-pants",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatpantsFront },
            { url: IMG.sweatpantsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Gray", "Navy"] },
          ],
          variants: buildSizeColorVariants("JOGGER", 38, 42, SIZES, ["Black", "Gray", "Navy"]),
          sales_channels: salesChannels,
        },
        {
          title: "Wide Leg Trousers",
          category_ids: [catId("Pants")],
          description:
            "Relaxed wide-leg trousers with a high waist and pleated front. A sophisticated statement piece.",
          handle: "wide-leg-trousers",
          weight: 420,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatpantsFront },
            { url: IMG.sweatpantsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Tan"] },
          ],
          variants: buildSizeColorVariants("WIDELEG", 55, 62, SIZES, ["Black", "Tan"]),
          sales_channels: salesChannels,
        },
        {
          title: "Cargo Pants",
          category_ids: [catId("Pants")],
          description:
            "Utility-inspired cargo pants with multiple pockets. Durable ripstop fabric for rugged everyday wear.",
          handle: "cargo-pants",
          weight: 520,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatpantsFront },
            { url: IMG.sweatpantsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Olive", "Black", "Khaki"] },
          ],
          variants: buildSizeColorVariants("CARGO", 48, 55, SIZES, ["Olive", "Black", "Khaki"]),
          sales_channels: salesChannels,
        },
        {
          title: "Corduroy Trousers",
          category_ids: [catId("Pants")],
          description:
            "Soft-wale corduroy trousers with a relaxed taper. Textured and warm for the autumn and winter seasons.",
          handle: "corduroy-trousers",
          weight: 480,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.sweatpantsFront },
            { url: IMG.sweatpantsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Brown", "Forest Green", "Burgundy"] },
          ],
          variants: buildSizeColorVariants("CORDUROY", 52, 58, SIZES, ["Brown", "Forest Green", "Burgundy"]),
          sales_channels: salesChannels,
        },

        // =================================================================
        // SHORTS (5 products)
        // =================================================================
        {
          title: "Classic Chino Shorts",
          category_ids: [catId("Shorts")],
          description:
            "Tailored chino shorts in a 7-inch inseam. Versatile enough for beach, brunch, or backyard.",
          handle: "classic-chino-shorts",
          weight: 280,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.shortsFront },
            { url: IMG.shortsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Khaki", "Navy", "White"] },
          ],
          variants: buildSizeColorVariants("CHINOSHORT", 30, 35, SIZES, ["Khaki", "Navy", "White"]),
          sales_channels: salesChannels,
        },
        {
          title: "Athletic Training Shorts",
          category_ids: [catId("Shorts")],
          description:
            "Lightweight performance shorts with moisture-wicking fabric and built-in liner. Ready for any workout.",
          handle: "athletic-training-shorts",
          weight: 180,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.shortsFront },
            { url: IMG.shortsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Navy", "Gray"] },
          ],
          variants: buildSizeColorVariants("ATHLETIC", 25, 28, SIZES, ["Black", "Navy", "Gray"]),
          sales_channels: salesChannels,
        },
        {
          title: "Denim Bermuda Shorts",
          category_ids: [catId("Shorts")],
          description:
            "Relaxed denim shorts with a 9-inch inseam. Faded wash for a casual, lived-in look.",
          handle: "denim-bermuda-shorts",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.shortsFront },
            { url: IMG.shortsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Light Wash", "Dark Wash"] },
          ],
          variants: buildSizeColorVariants("BERMUDA", 35, 40, SIZES, ["Light Wash", "Dark Wash"]),
          sales_channels: salesChannels,
        },
        {
          title: "Swim Trunks",
          category_ids: [catId("Shorts")],
          description:
            "Quick-dry swim trunks with an elastic waist and mesh lining. Ready to dive in.",
          handle: "swim-trunks",
          weight: 160,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.shortsFront },
            { url: IMG.shortsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Navy", "Coral", "Teal"] },
          ],
          variants: buildSizeColorVariants("SWIM", 28, 32, SIZES, ["Navy", "Coral", "Teal"]),
          sales_channels: salesChannels,
        },
        {
          title: "Linen Drawstring Shorts",
          category_ids: [catId("Shorts")],
          description:
            "Pure linen shorts with a drawstring waist. Breezy, relaxed, and perfect for hot summer days.",
          handle: "linen-drawstring-shorts",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.shortsFront },
            { url: IMG.shortsBack },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["White", "Sand", "Sky Blue"] },
          ],
          variants: buildSizeColorVariants("LINENSHORT", 32, 36, SIZES, ["White", "Sand", "Sky Blue"]),
          sales_channels: salesChannels,
        },

        // =================================================================
        // ACCESSORIES (4 products)
        // =================================================================
        {
          title: "Leather Belt",
          category_ids: [catId("Accessories")],
          description:
            "Full-grain leather belt with a brushed nickel buckle. 1.25 inches wide for dress or casual wear.",
          handle: "leather-belt",
          weight: 180,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Brown", "Tan"] },
          ],
          variants: buildSizeColorVariants("BELT", 30, 35, SIZES, ["Black", "Brown", "Tan"]),
          sales_channels: salesChannels,
        },
        {
          title: "Cotton Baseball Cap",
          category_ids: [catId("Accessories")],
          description:
            "Washed cotton twill baseball cap with an adjustable strap. Classic six-panel construction.",
          handle: "cotton-baseball-cap",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Navy", "Khaki", "White"] },
          ],
          variants: buildSizeColorVariants("CAP", 18, 20, SIZES, ["Black", "Navy", "Khaki", "White"]),
          sales_channels: salesChannels,
        },
        {
          title: "Wool Beanie",
          category_ids: [catId("Accessories")],
          description:
            "Merino wool ribbed beanie. Soft, warm, and perfectly slouchy for cold weather style.",
          handle: "wool-beanie",
          weight: 80,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeBlackFront },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Gray", "Burgundy", "Navy"] },
          ],
          variants: buildSizeColorVariants("BEANIE", 20, 22, SIZES, ["Black", "Gray", "Burgundy", "Navy"]),
          sales_channels: salesChannels,
        },
        {
          title: "Canvas Tote Bag",
          category_ids: [catId("Accessories")],
          description:
            "Heavy-duty canvas tote with reinforced handles. Spacious enough for shopping, gym, or everyday carry.",
          handle: "canvas-tote-bag",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: IMG.teeWhiteFront },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Natural", "Black", "Navy"] },
          ],
          variants: buildSizeColorVariants("TOTE", 15, 18, SIZES, ["Natural", "Black", "Navy"]),
          sales_channels: salesChannels,
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  // -----------------------------------------------------------------------
  // Inventory Levels – for both EU and US warehouses
  // -----------------------------------------------------------------------
  logger.info("Seeding inventory levels...");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    // Stock in EU warehouse
    inventoryLevels.push({
      location_id: euStockLocation.id,
      stocked_quantity: 100,
      inventory_item_id: inventoryItem.id,
    });
    // Stock in US warehouse
    inventoryLevels.push({
      location_id: usStockLocation.id,
      stocked_quantity: 100,
      inventory_item_id: inventoryItem.id,
    });
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
