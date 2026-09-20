import { SIGNATURES, TechSignature } from "./signatures";

export interface DetectResultItem {
  name: string;
  category: string;
  confidence: "high" | "medium";
  matched_via: string;
  website?: string;
}

export interface FingerprintResponse {
  url: string;
  domain: string;
  status_code: number;
  response_time_ms: number;
  technologies_count: number;
  categories: {
    ecommerce: string[];
    cms: string[];
    frameworks: string[];
    analytics_tracking: string[];
    marketing_crm: string[];
    payments: string[];
    hosting_cdn: string[];
    security_compliance: string[];
  };
  technologies: DetectResultItem[];
  security_headers: {
    has_https: boolean;
    has_hsts: boolean;
    server_header?: string;
  };
}

export function validateUrl(rawUrl: string): { valid: boolean; normalizedUrl?: string; domain?: string; error?: string } {
  let target = rawUrl.trim();
  if (!target.startsWith("http://") && !target.startsWith("https://")) {
    target = "https://" + target;
  }

  try {
    const parsed = new URL(target);
    const hostname = parsed.hostname.toLowerCase();

    // Anti-SSRF rules
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
      hostname === "169.254.169.254" // AWS metadata
    ) {
      return { valid: false, error: "Access to private, loopback, or cloud metadata IP addresses is strictly forbidden." };
    }

    return {
      valid: true,
      normalizedUrl: parsed.toString(),
      domain: hostname.replace(/^www\./, "")
    };
  } catch (err: any) {
    return { valid: false, error: `Invalid URL or domain format: ${rawUrl}` };
  }
}

export async function detectTechStack(rawUrl: string): Promise<FingerprintResponse> {
  const check = validateUrl(rawUrl);
  if (!check.valid || !check.normalizedUrl || !check.domain) {
    throw new Error(check.error || "Invalid URL.");
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  let response: Response;
  try {
    response = await fetch(check.normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (TopAI-TechStack-Bot/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      },
      redirect: "follow"
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(`Connection timeout: ${check.domain} took more than 6000ms to respond.`);
    }
    throw new Error(`Failed to reach ${check.domain}: ${err.message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  const responseTime = Date.now() - startTime;
  const statusCode = response.status;

  // Extract headers
  const headerMap: Record<string, string> = {};
  response.headers.forEach((val, key) => {
    headerMap[key.toLowerCase()] = val;
  });

  // Read first 500 KB of HTML body
  let htmlText = "";
  try {
    const rawBody = await response.text();
    htmlText = rawBody.slice(0, 500000);
  } catch {
    htmlText = "";
  }

  return analyzeHeadersAndHtml(check.normalizedUrl, check.domain, statusCode, responseTime, headerMap, htmlText);
}

export function analyzeHeadersAndHtml(
  url: string,
  domain: string,
  statusCode: number,
  responseTime: number,
  headers: Record<string, string>,
  html: string
): FingerprintResponse {
  const detected: DetectResultItem[] = [];
  const detectedNames = new Set<string>();

  for (const sig of SIGNATURES) {
    if (detectedNames.has(sig.name)) continue;

    let matched = false;
    let matchReason = "";
    let confidence: "high" | "medium" = "high";

    // 1. Check headers
    if (sig.headers) {
      for (const [headerKey, pattern] of Object.entries(sig.headers)) {
        const headerVal = headers[headerKey.toLowerCase()];
        if (headerVal) {
          if (pattern instanceof RegExp) {
            if (pattern.test(headerVal)) {
              matched = true;
              matchReason = `header: ${headerKey}="${headerVal}"`;
              break;
            }
          } else if (typeof pattern === "string") {
            if (headerVal.toLowerCase().includes(pattern.toLowerCase())) {
              matched = true;
              matchReason = `header: ${headerKey}`;
              break;
            }
          }
        }
      }
    }

    // 2. Check HTML body if not matched yet
    if (!matched && sig.html && html.length > 0) {
      for (const pattern of sig.html) {
        if (pattern instanceof RegExp) {
          if (pattern.test(html)) {
            matched = true;
            matchReason = `html pattern: ${pattern.toString().slice(0, 40)}`;
            break;
          }
        } else if (typeof pattern === "string") {
          if (html.toLowerCase().includes(pattern.toLowerCase())) {
            matched = true;
            matchReason = `html keyword: ${pattern}`;
            break;
          }
        }
      }
    }

    if (matched) {
      detectedNames.add(sig.name);
      detected.push({
        name: sig.name,
        category: sig.category,
        confidence,
        matched_via: matchReason,
        website: sig.website
      });
    }
  }

  // Categories grouping
  const categories: FingerprintResponse["categories"] = {
    ecommerce: [],
    cms: [],
    frameworks: [],
    analytics_tracking: [],
    marketing_crm: [],
    payments: [],
    hosting_cdn: [],
    security_compliance: []
  };

  detected.forEach((item) => {
    const cat = item.category as keyof FingerprintResponse["categories"];
    if (categories[cat]) {
      categories[cat].push(item.name);
    }
  });

  return {
    url,
    domain,
    status_code: statusCode,
    response_time_ms: responseTime,
    technologies_count: detected.length,
    categories,
    technologies: detected,
    security_headers: {
      has_https: url.startsWith("https://"),
      has_hsts: Boolean(headers["strict-transport-security"]),
      server_header: headers["server"] || undefined
    }
  };
}
