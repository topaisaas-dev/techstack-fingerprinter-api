# TechStack Fingerprinter API

> **Sub-Millisecond Technographic Scanner & BuiltWith Unbundled for Cold Outreach & AI Sales Agents**

[![Cloudflare Workers](https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange.svg)](https://workers.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Uptime](https://img.shields.io/badge/Uptime-100%25-brightgreen.svg)](https://techstack-fingerprinter.topaisaas.workers.dev/v1/health)
[![RapidAPI](https://img.shields.io/badge/RapidAPI-Subscribe%20Free-blue.svg)](https://rapidapi.com/topaisaasdev/api/techstack-fingerprinter-api/pricing)

BuiltWith costs **$495/month**, which is prohibitive for growth teams, outbound agencies (**Clay.com, Smartlead, Instantly**), and automated scraping pipelines.

**TechStack Fingerprinter API** inspects any website in sub-50ms and extracts its full technographic profile: **eCommerce platforms (Shopify, WooCommerce), CMS (WordPress, Webflow), Frontend Frameworks (React, Next.js), Analytics (GA4, PostHog), Marketing CRMs (HubSpot, Klaviyo), Payment Gateways (Stripe), and CDNs (Cloudflare, Vercel)**.

---

## ⚡ Quick Try in 5 Seconds + Free FinOps Audit + USD Toolkits (14-Day Money-Back Guarantee)

Test the **TopAI Sovereign Edge Gateway** live right now — **no API key required**, deterministic sub-30ms response (`HTTP 200`), zero LLM token burn (Clean Web-to-Markdown Edge Extraction (`POST /v1/extract`)):

```bash
curl -sS -X POST https://topaigateway.com/v1/extract -H "Content-Type: application/json" -d '{"url":"https://example.com"}'
```

### 🔍 Free Live Diagnostics, Sample Previews & Edge MCP Server
- **Free Live FinOps & Token Waste Auditor**: Benchmark your agent token burn in 10 seconds -> [**Run Free FinOps Audit**](https://topaigateway.com/audit?utm_source=github&utm_medium=readme&utm_campaign=techstack-fingerprinter-api)
- **Interactive Sample Previews (No Signup)**: [**n8n Sovereign Workflow Starter JSON**](https://topaigateway.com/samples/topai-n8n-starter.json?utm_source=github&utm_medium=readme&utm_campaign=techstack-fingerprinter-api) · [**Cursor & Claude Code Sovereign Rules**](https://topaigateway.com/download/samples/topai-cursor-rules.txt?utm_source=github&utm_medium=readme&utm_campaign=techstack-fingerprinter-api)
- **19-Tool Edge MCP Server**: Connect Claude Desktop, Cursor, or Windsurf in 1 line -> `npx -y @topaisaas/mcp-server`

### 💳 Hero Quartet — Direct USD Checkout (14-Day No-Questions-Asked Money-Back Guarantee)

| Plan / Toolkit | USD Price | What You Unlock | Direct USD Checkout |
| :--- | :--- | :--- | :--- |
| **Pack 1: DevEx & FinOps Pro Trial** | **$0 / 7 Days** | 10,000 req/mo across 100+ sub-30ms edge APIs (`$14/mo` after trial, cancel anytime) | [**Start $0 7-Day Trial →**](https://topaigateway.com/checkout?pack=pack_1_devex&direct=true&utm_source=github&utm_medium=readme&utm_campaign=techstack-fingerprinter-api) |
| **n8n & Make 65-Workflow Super-Pack** | **$19 Once** | 65 production-hardened n8n & Make templates with zero-token edge connectors | [**Get Super-Pack ($19) →**](https://topaigateway.com/checkout?pack=bundle_n8n_make&direct=true&utm_source=github&utm_medium=readme&utm_campaign=techstack-fingerprinter-api) |
| **Runaway Token Breaker Shield** | **$29 Once** | Deterministic circuit-breaker kit to stop infinite agent loops & runaway LLM bills | [**Get Breaker Shield ($29) →**](https://topaigateway.com/checkout?pack=runaway_token_breaker&direct=true&utm_source=github&utm_medium=readme&utm_campaign=techstack-fingerprinter-api) |
| **Cursor & Claude Code 169-Tool Harness Kit** | **$49 Once** | Complete 169-tool sovereign engineering harness, offline keys, hooks & CI/CD guardrails | [**Get 169-Tool Kit ($49) →**](https://topaigateway.com/checkout?pack=bundle_cursor_harness&direct=true&utm_source=github&utm_medium=readme&utm_campaign=techstack-fingerprinter-api) |

---

## ⚡ Key Features

- 🏎️ **Sub-50ms Execution**: 0ms cold-start serverless edge running across 300+ worldwide Cloudflare locations.
- 🔍 **70+ Deep Signatures**: Inspects HTTP response headers, DOM script injections, meta tags, and CDN routing.
- 🛡️ **Built-in Anti-SSRF Protection**: Automatically filters private IPs (RFC 1918) and cloud metadata targets (`169.254.169.254`).
- 📊 **Clay & n8n Ready**: Clean, normalized JSON schema designed specifically for table enrichment and cold email personalization.
- 📦 **Batch Scanning**: Inspect up to 5 domains concurrently in a single API call (`POST /v1/batch`).

---

## 🚀 Quick Start (cURL)

### 1. Fingerprint a Domain (POST)
```bash
curl -X POST https://techstack-fingerprinter-api.p.rapidapi.com/v1/fingerprint \
  -H "Content-Type: application/json" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: techstack-fingerprinter-api.p.rapidapi.com" \
  -d '{"url": "https://gymshark.com"}'
```

**Response (Sub-50ms):**
```json
{
  "success": true,
  "result": {
    "url": "https://gymshark.com",
    "domain": "gymshark.com",
    "status_code": 200,
    "response_time_ms": 48,
    "technologies_count": 8,
    "categories": {
      "ecommerce": ["Shopify"],
      "cms": [],
      "frameworks": ["React"],
      "analytics_tracking": ["Google Analytics 4", "Google Tag Manager", "Meta Pixel"],
      "marketing_crm": ["Klaviyo"],
      "payments": ["Stripe"],
      "hosting_cdn": ["Cloudflare"],
      "security_compliance": ["OneTrust"]
    },
    "technologies": [
      { "name": "Shopify", "category": "ecommerce", "confidence": "high", "matched_via": "header: x-shopify-stage" },
      { "name": "Klaviyo", "category": "marketing_crm", "confidence": "high", "matched_via": "html pattern: static.klaviyo.com" },
      { "name": "Cloudflare", "category": "hosting_cdn", "confidence": "high", "matched_via": "header: server" }
    ],
    "security_headers": {
      "has_https": true,
      "has_hsts": true,
      "server_header": "cloudflare"
    }
  }
}
```

### 2. Quick Detect (GET)
```bash
curl "https://techstack-fingerprinter-api.p.rapidapi.com/v1/detect?domain=stripe.com" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: techstack-fingerprinter-api.p.rapidapi.com"
```

---

## 🐍 Python Example (Enriching Prospects for Cold Email)

```python
import requests

def get_prospect_stack(domain: str):
    url = "https://techstack-fingerprinter-api.p.rapidapi.com/v1/fingerprint"
    headers = {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
        "X-RapidAPI-Host": "techstack-fingerprinter-api.p.rapidapi.com"
    }
    res = requests.post(url, json={"domain": domain}, headers=headers)
    data = res.json()
    
    if data.get("success"):
        cats = data["result"]["categories"]
        is_shopify = "Shopify" in cats.get("ecommerce", [])
        has_klaviyo = "Klaviyo" in cats.get("marketing_crm", [])
        return {
            "is_ecommerce": bool(cats.get("ecommerce")),
            "ecommerce_tool": cats.get("ecommerce"),
            "email_crm": cats.get("marketing_crm"),
            "icebreaker": f"Noticed you're using {cats['ecommerce'][0]} with {cats['marketing_crm'][0]}!" if is_shopify and has_klaviyo else None
        }
    return None

print(get_prospect_stack("allbirds.com"))
```

---

## 🟨 Integration with Clay.com & n8n

1. In Clay or n8n, add an **HTTP Request / API Action**.
2. **Method**: `POST`
3. **URL**: `https://techstack-fingerprinter-api.p.rapidapi.com/v1/fingerprint`
4. **Body**: `{"domain": "{{ prospect.website }}"}`
5. Map `result.categories.ecommerce[0]` to your Clay column to filter high-intent prospects immediately!

---

## 🛡️ Service Level & Architecture

- **Cold Start**: 0 ms (Cloudflare V8 Isolates across 300+ global data centers).
- **Latency**: Sub-50ms website fetch & signature analysis.
- **Data Retention**: 100% stateless proxy. No crawled websites or user targets are stored.
