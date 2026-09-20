export interface TechSignature {
  name: string;
  category: "ecommerce" | "cms" | "frameworks" | "analytics_tracking" | "marketing_crm" | "payments" | "hosting_cdn" | "security_compliance";
  website?: string;
  headers?: Record<string, RegExp | string>;
  html?: (RegExp | string)[];
  cookies?: (RegExp | string)[];
}

export const SIGNATURES: TechSignature[] = [
  // --- ECOMMERCE ---
  {
    name: "Shopify",
    category: "ecommerce",
    website: "https://shopify.com",
    headers: {
      "x-shopify-stage": /.*/i,
      "x-sorting-hat-podid": /.*/i,
      "powered-by": /shopify/i
    },
    html: [
      /cdn\.shopify\.com/i,
      /Shopify\.theme/i,
      /window\.Shopify/i,
      /shopify-features/i
    ]
  },
  {
    name: "WooCommerce",
    category: "ecommerce",
    website: "https://woocommerce.com",
    html: [
      /woocommerce/i,
      /wc-ajax=/i,
      /name="generator" content="WooCommerce/i,
      /wc_add_to_cart_params/i
    ]
  },
  {
    name: "Magento",
    category: "ecommerce",
    website: "https://magento.com",
    headers: {
      "x-magento-tags": /.*/i,
      "x-magento-cache-debug": /.*/i
    },
    html: [
      /mage\/cookies/i,
      /frontend\/Magento\//i,
      /text\/x-magento-init/i
    ]
  },
  {
    name: "BigCommerce",
    category: "ecommerce",
    website: "https://bigcommerce.com",
    headers: {
      "x-bc-": /.*/i
    },
    html: [
      /cdn11\.bigcommerce\.com/i,
      /bigcommerce\.com\/checkout/i
    ]
  },
  {
    name: "PrestaShop",
    category: "ecommerce",
    website: "https://prestashop.com",
    html: [
      /prestashop/i,
      /\/modules\/ps_/i,
      /generator" content="PrestaShop/i
    ]
  },

  // --- CMS ---
  {
    name: "WordPress",
    category: "cms",
    website: "https://wordpress.org",
    headers: {
      "x-pingback": /xmlrpc\.php/i
    },
    html: [
      /\/wp-content\//i,
      /\/wp-includes\//i,
      /name="generator" content="WordPress/i,
      /wp-json\//i
    ]
  },
  {
    name: "Webflow",
    category: "cms",
    website: "https://webflow.com",
    headers: {
      "x-webflow-site": /.*/i
    },
    html: [
      /data-wf-page/i,
      /data-wf-site/i,
      /d3e54v103j8qbb\.cloudfront\.net/i,
      /webflow\.js/i
    ]
  },
  {
    name: "Ghost",
    category: "cms",
    website: "https://ghost.org",
    headers: {
      "x-ghost-cache-status": /.*/i
    },
    html: [
      /ghost-portal/i,
      /name="generator" content="Ghost/i
    ]
  },
  {
    name: "Wix",
    category: "cms",
    website: "https://wix.com",
    headers: {
      "x-wix-request-id": /.*/i,
      "server": /pepyaka/i
    },
    html: [
      /wix-warmup-data/i,
      /static\.wixstatic\.com/i,
      /wix\.com/i
    ]
  },
  {
    name: "HubSpot CMS",
    category: "cms",
    website: "https://hubspot.com",
    headers: {
      "x-hs-cache-status": /.*/i,
      "x-hs-cf-cache-status": /.*/i
    },
    html: [
      /hs-scripts\.com/i,
      /hs-site/i
    ]
  },
  {
    name: "Drupal",
    category: "cms",
    website: "https://drupal.org",
    headers: {
      "x-drupal-cache": /.*/i,
      "x-generator": /drupal/i
    },
    html: [
      /Drupal\.settings/i,
      /sites\/default\/files/i
    ]
  },

  // --- FRAMEWORKS ---
  {
    name: "Next.js",
    category: "frameworks",
    website: "https://nextjs.org",
    headers: {
      "x-powered-by": /next\.js/i
    },
    html: [
      /__NEXT_DATA__/i,
      /\/_next\/static\//i
    ]
  },
  {
    name: "Nuxt",
    category: "frameworks",
    website: "https://nuxt.com",
    html: [
      /__NUXT__/i,
      /\/_nuxt\//i
    ]
  },
  {
    name: "React",
    category: "frameworks",
    website: "https://react.dev",
    html: [
      /data-reactroot/i,
      /react-dom/i,
      /__REACT_DEVTOOLS_GLOBAL_HOOK__/i
    ]
  },
  {
    name: "Vue.js",
    category: "frameworks",
    website: "https://vuejs.org",
    html: [
      /data-v-[a-f0-9]/i,
      /__vue__/i
    ]
  },
  {
    name: "Angular",
    category: "frameworks",
    website: "https://angular.dev",
    html: [
      /ng-version=/i,
      /ng-app/i
    ]
  },
  {
    name: "Svelte",
    category: "frameworks",
    website: "https://svelte.dev",
    html: [
      /__svelte__/i,
      /class="[^"]*svelte-[a-z0-9]+/i
    ]
  },
  {
    name: "Tailwind CSS",
    category: "frameworks",
    website: "https://tailwindcss.com",
    html: [
      /class="[^"]*(flex|grid|hidden|relative|absolute|mx-auto|space-x-|space-y-)[^"]*"/i,
      /tailwindcss/i
    ]
  },

  // --- ANALYTICS & TRACKING ---
  {
    name: "Google Analytics 4",
    category: "analytics_tracking",
    website: "https://analytics.google.com",
    html: [
      /googletagmanager\.com\/gtag\/js\?id=G-/i,
      /gtag\(['"]config['"],\s*['"]G-/i
    ]
  },
  {
    name: "Google Tag Manager",
    category: "analytics_tracking",
    website: "https://tagmanager.google.com",
    html: [
      /googletagmanager\.com\/gtm\.js\?id=GTM-/i,
      /\(window,document,'script','dataLayer','GTM-/i
    ]
  },
  {
    name: "Meta Pixel (Facebook)",
    category: "analytics_tracking",
    website: "https://facebook.com/business",
    html: [
      /connect\.facebook\.net\/en_US\/fbevents\.js/i,
      /fbq\(['"]init['"]/i
    ]
  },
  {
    name: "Hotjar",
    category: "analytics_tracking",
    website: "https://hotjar.com",
    html: [
      /static\.hotjar\.com\/c\/hotjar-/i,
      /_hjSettings/i
    ]
  },
  {
    name: "PostHog",
    category: "analytics_tracking",
    website: "https://posthog.com",
    html: [
      /app\.posthog\.com\/static\/array\.js/i,
      /posthog\.init\(/i
    ]
  },
  {
    name: "Mixpanel",
    category: "analytics_tracking",
    website: "https://mixpanel.com",
    html: [
      /cdn\.mxpnl\.com\/libs\/mixpanel/i,
      /mixpanel\.init\(/i
    ]
  },
  {
    name: "Segment",
    category: "analytics_tracking",
    website: "https://segment.com",
    html: [
      /cdn\.segment\.com\/analytics\.js\/v1\//i,
      /analytics\.load\(/i
    ]
  },
  {
    name: "Microsoft Clarity",
    category: "analytics_tracking",
    website: "https://clarity.microsoft.com",
    html: [
      /www\.clarity\.ms\/tag\//i,
      /clarity\(['"]init['"]/i
    ]
  },
  {
    name: "Plausible",
    category: "analytics_tracking",
    website: "https://plausible.io",
    html: [
      /plausible\.io\/js\/script\.js/i,
      /data-domain=/i
    ]
  },

  // --- MARKETING & CRM ---
  {
    name: "HubSpot",
    category: "marketing_crm",
    website: "https://hubspot.com",
    html: [
      /js\.hs-scripts\.com\//i,
      /js\.hsforms\.net\//i,
      /_hsq\.push/i
    ]
  },
  {
    name: "Klaviyo",
    category: "marketing_crm",
    website: "https://klaviyo.com",
    html: [
      /static\.klaviyo\.com\/onsite\/js\/klaviyo\.js/i,
      /_learnq\.push/i
    ]
  },
  {
    name: "Intercom",
    category: "marketing_crm",
    website: "https://intercom.com",
    html: [
      /widget\.intercom\.io\/widget\//i,
      /window\.intercomSettings/i
    ]
  },
  {
    name: "Crisp",
    category: "marketing_crm",
    website: "https://crisp.chat",
    html: [
      /client\.crisp\.chat\/l\.js/i,
      /\$crisp\.push/i
    ]
  },
  {
    name: "Mailchimp",
    category: "marketing_crm",
    website: "https://mailchimp.com",
    html: [
      /chimpstatic\.com/i,
      /downloads\.mailchimp\.com\/js\/signup-forms\//i
    ]
  },
  {
    name: "ActiveCampaign",
    category: "marketing_crm",
    website: "https://activecampaign.com",
    html: [
      /trackcmp\.net/i,
      /activecampaign\.com/i
    ]
  },

  // --- PAYMENTS ---
  {
    name: "Stripe",
    category: "payments",
    website: "https://stripe.com",
    html: [
      /js\.stripe\.com\/v3\//i,
      /checkout\.stripe\.com/i,
      /stripe\.elements/i
    ]
  },
  {
    name: "PayPal",
    category: "payments",
    website: "https://paypal.com",
    html: [
      /www\.paypal\.com\/sdk\/js/i,
      /paypal-button/i
    ]
  },
  {
    name: "Klarna",
    category: "payments",
    website: "https://klarna.com",
    html: [
      /x\.klarnacdn\.net/i,
      /klarna-placement/i
    ]
  },

  // --- HOSTING & CDN ---
  {
    name: "Cloudflare",
    category: "hosting_cdn",
    website: "https://cloudflare.com",
    headers: {
      "server": /cloudflare/i,
      "cf-ray": /.*/i
    }
  },
  {
    name: "Vercel",
    category: "hosting_cdn",
    website: "https://vercel.com",
    headers: {
      "server": /vercel/i,
      "x-vercel-id": /.*/i
    }
  },
  {
    name: "Netlify",
    category: "hosting_cdn",
    website: "https://netlify.com",
    headers: {
      "server": /netlify/i,
      "x-nf-request-id": /.*/i
    }
  },
  {
    name: "AWS CloudFront",
    category: "hosting_cdn",
    website: "https://aws.amazon.com/cloudfront",
    headers: {
      "server": /cloudfront/i,
      "x-amz-cf-id": /.*/i
    }
  },
  {
    name: "GitHub Pages",
    category: "hosting_cdn",
    website: "https://pages.github.com",
    headers: {
      "server": /github\.com/i
    }
  },

  // --- PRIVACY & SECURITY ---
  {
    name: "OneTrust",
    category: "security_compliance",
    website: "https://onetrust.com",
    html: [
      /cdn\.cookielaw\.org\/scripttemplates\/otSDKStub\.js/i
    ]
  },
  {
    name: "Cookiebot",
    category: "security_compliance",
    website: "https://cookiebot.com",
    html: [
      /consent\.cookiebot\.com\/uc\.js/i
    ]
  },
  {
    name: "Axeptio",
    category: "security_compliance",
    website: "https://axeptio.eu",
    html: [
      /static\.axept\.io\/sdk\.js/i
    ]
  },
  {
    name: "Cloudflare Turnstile",
    category: "security_compliance",
    website: "https://challenges.cloudflare.com",
    html: [
      /challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/i
    ]
  },
  {
    name: "Google reCAPTCHA",
    category: "security_compliance",
    website: "https://google.com/recaptcha",
    html: [
      /google\.com\/recaptcha\/api\.js/i,
      /gstatic\.com\/recaptcha\//i
    ]
  }
];
