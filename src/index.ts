import { Hono } from "hono";
import { cors } from "hono/cors";
import { detectTechStack, validateUrl } from "./detector";
import { SIGNATURES } from "./signatures";
import { OPENAPI_SPEC } from "./openapi_spec";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-RapidAPI-Key", "X-RapidAPI-Host", "X-RapidAPI-Proxy-Secret"]
  })
);

// OpenAPI Specification for RapidAPI Studio Import
app.get("/openapi.json", (c) => {
  return c.json(OPENAPI_SPEC);
});

// Healthcheck
app.get("/v1/health", (c) => {
  return c.json({
    status: "ok",
    service: "techstack-fingerprinter",
    version: "1.0.0",
    uptime: "100%",
    timestamp: new Date().toISOString()
  });
});

// Catalog of supported technologies
app.get("/v1/technologies", (c) => {
  const byCategory: Record<string, string[]> = {};
  SIGNATURES.forEach((sig) => {
    if (!byCategory[sig.category]) byCategory[sig.category] = [];
    byCategory[sig.category].push(sig.name);
  });
  return c.json({
    success: true,
    total_technologies: SIGNATURES.length,
    categories: byCategory
  });
});

// Primary Fingerprint Endpoint (POST)
app.post("/v1/fingerprint", async (c) => {
  try {
    const body = await c.req.json();
    const target = body.url || body.domain;
    if (!target || typeof target !== "string") {
      return c.json({ error: "Missing required 'url' or 'domain' parameter." }, 400);
    }
    const result = await detectTechStack(target);
    return c.json({ success: true, result });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to fingerprint website." }, 400);
  }
});

// Quick Detect Endpoint (GET)
app.get("/v1/detect", async (c) => {
  const target = c.req.query("url") || c.req.query("domain");
  if (!target) {
    return c.json({ error: "Missing required 'url' or 'domain' query parameter." }, 400);
  }
  try {
    const result = await detectTechStack(target);
    return c.json({ success: true, result });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to detect tech stack." }, 400);
  }
});

// Batch Fingerprint (POST, up to 5 domains)
app.post("/v1/batch", async (c) => {
  try {
    const body = await c.req.json();
    const domains = Array.isArray(body.domains) ? body.domains.slice(0, 5) : [];
    if (domains.length === 0) {
      return c.json({ error: "Missing or empty 'domains' array (max 5)." }, 400);
    }

    const tasks = domains.map(async (d: string) => {
      try {
        const res = await detectTechStack(d);
        return { domain: d, success: true, result: res };
      } catch (err: any) {
        return { domain: d, success: false, error: err.message };
      }
    });

    const results = await Promise.all(tasks);
    return c.json({ success: true, total: results.length, results });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to process batch request." }, 400);
  }
});

// Root: Interactive Playground or Technical JSON
app.get("/", (c) => {
  const accept = c.req.header("Accept") || "";
  const format = c.req.query("format") || "";

  if (accept.includes("application/json") || format === "json") {
    return c.json({
      name: "TechStack Fingerprinter API",
      description: "Sub-millisecond technographic scanner and website tech stack detector for cold outreach, Clay.com, and AI sales agents",
      version: "1.0.0",
      provider: "TopAI SaaS",
      pricing_url: "https://rapidapi.com/topaisaasdev/api/techstack-fingerprinter-api/pricing",
      endpoints: [
        { path: "/v1/fingerprint", method: "POST", desc: "Full technographic scan of a domain or URL" },
        { path: "/v1/detect", method: "GET", desc: "Quick detect via query parameter" },
        { path: "/v1/batch", method: "POST", desc: "Batch scan up to 5 domains concurrently" },
        { path: "/v1/technologies", method: "GET", desc: "List all detectable technologies by category" },
        { path: "/openapi.json", method: "GET", desc: "OpenAPI 3.0 specification" },
        { path: "/v1/health", method: "GET", desc: "Service healthcheck" }
      ]
    });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechStack Fingerprinter API - TopAI SaaS</title>
  <style>
    :root {
      --primary: #FFD600;
      --primary-hover: #e6c200;
      --bg-dark: #0a0c10;
      --card-bg: #12161f;
      --border-color: #232936;
      --text-main: #f0f3f6;
      --text-muted: #8b949e;
      --tag-bg: #1f2430;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: var(--bg-dark); color: var(--text-main); line-height: 1.6; padding: 20px; min-height: 100vh; }
    .container { max-width: 1080px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); margin-bottom: 30px; flex-wrap: wrap; gap: 16px; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand-icon { width: 44px; height: 44px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; color: #000; box-shadow: 0 4px 14px rgba(255, 214, 0, 0.25); }
    .brand-text h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .brand-text p { font-size: 13px; color: var(--text-muted); }
    .cta-links { display: flex; gap: 12px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: var(--primary); color: #000; }
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-outline { background: transparent; color: var(--text-main); border: 1px solid var(--border-color); }
    .btn-outline:hover { background: var(--card-bg); border-color: var(--text-muted); }
    
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media(max-width: 820px) { .grid { grid-template-columns: 1fr; } }
    .card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; }
    .card h2 { font-size: 17px; font-weight: 700; margin-bottom: 16px; color: var(--primary); display: flex; align-items: center; gap: 8px; }
    label { display: block; font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    input { width: 100%; padding: 12px 14px; background: #0c0f16; border: 1px solid var(--border-color); border-radius: 8px; color: #fff; font-size: 14px; margin-bottom: 16px; outline: none; }
    input:focus { border-color: var(--primary); }
    
    .quick-examples { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .quick-pill { background: var(--tag-bg); color: var(--text-muted); font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; cursor: pointer; border: 1px solid var(--border-color); transition: all 0.2s; }
    .quick-pill:hover { color: var(--primary); border-color: var(--primary); }
    
    pre { background: #0c0f16; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; font-family: "Courier New", monospace; font-size: 12px; color: #a5d6ff; overflow-x: auto; max-height: 480px; }
    .categories-box { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
    .cat-item { background: #0c0f16; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; }
    .cat-title { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .cat-badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .tech-badge { background: var(--primary); color: #000; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">
          <h1>TechStack Fingerprinter API</h1>
          <p>Instant Technographic Scanner & BuiltWith Unbundled for Cold Outreach</p>
        </div>
      </div>
      <div class="cta-links">
        <a href="/openapi.json" target="_blank" class="btn btn-outline">📄 OpenAPI Spec</a>
        <a href="/v1/health" class="btn btn-outline">● API Health: 100%</a>
        <a href="https://rapidapi.com/topaisaasdev/api/techstack-fingerprinter-api/pricing" target="_blank" class="btn btn-primary">Subscribe on RapidAPI ($0)</a>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h2>Scanner un Domaine</h2>
        <label>URL ou Nom de Domaine</label>
        <input type="text" id="target-input" value="https://stripe.com" placeholder="ex: shopify.com, webflow.com, gymshark.com">
        
        <label>Exemples Rapides</label>
        <div class="quick-examples">
          <span class="quick-pill" onclick="setExample('https://stripe.com')">Stripe.com</span>
          <span class="quick-pill" onclick="setExample('https://shopify.com')">Shopify.com</span>
          <span class="quick-pill" onclick="setExample('https://webflow.com')">Webflow.com</span>
          <span class="quick-pill" onclick="setExample('https://wordpress.org')">WordPress.org</span>
          <span class="quick-pill" onclick="setExample('https://vercel.com')">Vercel.com</span>
        </div>

        <button class="btn btn-primary" style="width:100%;" onclick="runScan()">Lancer le Scan Technographique (Sub-50ms)</button>

        <div class="categories-box" id="cat-preview" style="display:none;">
          <!-- Dynamically populated -->
        </div>
      </div>

      <div class="card">
        <h2>Résultat JSON Strict (Clay / n8n Ready)</h2>
        <pre id="json-output">// Cliquez sur Lancer le Scan pour tester l'API en direct...</pre>
      </div>
    </div>
  </div>

  <script>
    function setExample(url) {
      document.getElementById('target-input').value = url;
      runScan();
    }

    async function runScan() {
      const target = document.getElementById('target-input').value.trim();
      if (!target) return;
      document.getElementById('json-output').textContent = "// Analyse en cours des headers HTTP, balises script et DNS...";
      
      try {
        const res = await fetch('/v1/fingerprint', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ url: target })
        });
        const data = await res.json();
        document.getElementById('json-output').textContent = JSON.stringify(data, null, 2);

        if (data.success && data.result) {
          const preview = document.getElementById('cat-preview');
          preview.style.display = 'flex';
          preview.innerHTML = '';
          const cats = data.result.categories;
          for (const [k, v] of Object.entries(cats)) {
            if (v && v.length > 0) {
              const item = document.createElement('div');
              item.className = 'cat-item';
              item.innerHTML = '<span class="cat-title">' + k.replace('_', ' ') + '</span><div class="cat-badges">' + v.map(t => '<span class="tech-badge">' + t + '</span>').join('') + '</div>';
              preview.appendChild(item);
            }
          }
        }
      } catch (err) {
        document.getElementById('json-output').textContent = "// Erreur : " + err.message;
      }
    }
  </script>
</body>
</html>`;

  return c.html(html);
});

export default app;
