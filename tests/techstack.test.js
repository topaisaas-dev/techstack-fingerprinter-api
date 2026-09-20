import test from "node:test";
import assert from "node:assert/strict";
import { SIGNATURES } from "../src/signatures.ts";

function validateUrl(rawUrl) {
  let target = rawUrl.trim();
  if (!target.startsWith("http://") && !target.startsWith("https://")) {
    target = "https://" + target;
  }
  try {
    const parsed = new URL(target);
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
      hostname === "169.254.169.254"
    ) {
      return { valid: false, error: "Access to private, loopback, or cloud metadata IP addresses is strictly forbidden." };
    }
    return { valid: true, normalizedUrl: parsed.toString(), domain: hostname.replace(/^www\./, "") };
  } catch {
    return { valid: false, error: `Invalid URL: ${rawUrl}` };
  }
}

function analyze(url, domain, statusCode, responseTime, headers, html) {
  const detected = [];
  const detectedNames = new Set();
  const categories = {
    ecommerce: [],
    cms: [],
    frameworks: [],
    analytics_tracking: [],
    marketing_crm: [],
    payments: [],
    hosting_cdn: [],
    security_compliance: []
  };

  for (const sig of SIGNATURES) {
    if (detectedNames.has(sig.name)) continue;
    let matched = false;

    if (sig.headers) {
      for (const [k, p] of Object.entries(sig.headers)) {
        const val = headers[k.toLowerCase()];
        if (val && p instanceof RegExp && p.test(val)) {
          matched = true;
          break;
        }
      }
    }

    if (!matched && sig.html) {
      for (const p of sig.html) {
        if (p instanceof RegExp && p.test(html)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      detectedNames.add(sig.name);
      detected.push(sig.name);
      if (categories[sig.category]) {
        categories[sig.category].push(sig.name);
      }
    }
  }

  return { domain, statusCode, count: detected.length, categories, detected };
}

test("Anti-SSRF: Valid public URLs pass", () => {
  const r1 = validateUrl("example.com");
  assert.equal(r1.valid, true);
  assert.equal(r1.domain, "example.com");

  const r2 = validateUrl("https://www.shopify.com/pricing");
  assert.equal(r2.valid, true);
  assert.equal(r2.domain, "shopify.com");
});

test("Anti-SSRF: Blocks private IPs, localhost and AWS metadata", () => {
  assert.equal(validateUrl("localhost").valid, false);
  assert.equal(validateUrl("http://127.0.0.1:8080").valid, false);
  assert.equal(validateUrl("http://192.168.1.50").valid, false);
  assert.equal(validateUrl("http://10.0.0.1").valid, false);
  assert.equal(validateUrl("http://169.254.169.254/latest/meta-data/").valid, false);
});

test("Detection: Shopify, Klaviyo, React, and Cloudflare", () => {
  const headers = {
    "server": "cloudflare",
    "cf-ray": "890abcd-CDG",
    "x-shopify-stage": "production"
  };
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.shopify.com/s/files/1/theme.js"></script>
        <script src="https://static.klaviyo.com/onsite/js/klaviyo.js"></script>
      </head>
      <body>
        <div id="root" data-reactroot=""></div>
      </body>
    </html>
  `;

  const res = analyze("https://store.example.com", "store.example.com", 200, 35, headers, html);
  assert.ok(res.count >= 4);
  assert.ok(res.categories.ecommerce.includes("Shopify"));
  assert.ok(res.categories.marketing_crm.includes("Klaviyo"));
  assert.ok(res.categories.frameworks.includes("React"));
  assert.ok(res.categories.hosting_cdn.includes("Cloudflare"));
});

test("Detection: WordPress, WooCommerce, Stripe, and Google Analytics 4", () => {
  const headers = { "server": "nginx" };
  const html = `
    <html>
      <head>
        <link rel="stylesheet" href="/wp-content/plugins/woocommerce/assets/css/woocommerce.css">
        <script src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
        <script src="https://js.stripe.com/v3/"></script>
      </head>
      <body>
        <h1>Store</h1>
      </body>
    </html>
  `;

  const res = analyze("https://wpstore.com", "wpstore.com", 200, 42, headers, html);
  assert.ok(res.categories.cms.includes("WordPress"));
  assert.ok(res.categories.ecommerce.includes("WooCommerce"));
  assert.ok(res.categories.analytics_tracking.includes("Google Analytics 4"));
  assert.ok(res.categories.payments.includes("Stripe"));
});
