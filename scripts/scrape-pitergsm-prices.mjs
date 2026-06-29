import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = "https://pitergsm.ru";
const outDir = path.join(root, "data");
const cachePath = path.join(outDir, "pitergsm-price-cache.json");
const jsonPath = path.join(outDir, "pitergsm-prices.json");
const csvPath = path.join(outDir, "pitergsm-prices.csv");
const failuresPath = path.join(outDir, "pitergsm-price-failures.json");
const concurrency = Number(process.argv.find((arg) => arg.startsWith("--concurrency="))?.split("=")[1] || 5);
const limit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] || 0);

const headers = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
  accept: "text/html,application/xhtml+xml,application/xml,text/xml"
};

function decodeHtml(value = "") {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagContent(html, pattern) {
  return decodeHtml(html.match(pattern)?.[1] || "");
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeHtml(match[1]));
}

function extractLastmods(xml) {
  const map = new Map();
  for (const match of xml.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>\s*<\/url>/g)) {
    map.set(decodeHtml(match[1]), decodeHtml(match[2]));
  }
  return map;
}

async function collectProductUrls() {
  const indexXml = await fetchText(`${base}/sitemap.xml`);
  const sitemapUrls = extractLocs(indexXml);
  const products = new Map();

  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    const lastmods = extractLastmods(xml);
    for (const url of extractLocs(xml)) {
      if (!/^https:\/\/pitergsm\.ru\/catalog\/.+\/\d+\/$/.test(url)) continue;
      if (!products.has(url)) products.set(url, lastmods.get(url) || "");
    }
  }

  const urls = [...products.entries()].map(([url, lastmod]) => ({ url, lastmod }));
  urls.sort((a, b) => a.url.localeCompare(b.url, "ru", { numeric: true }));
  return limit > 0 ? urls.slice(0, limit) : urls;
}

function parseProduct(html, url, lastmod) {
  const canonical = tagContent(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || url;
  const productUrl = canonical.startsWith("http") ? canonical : `${base}${canonical}`;
  const id = productUrl.match(/\/(\d+)\/?$/)?.[1] || url.match(/\/(\d+)\/?$/)?.[1] || "";
  const name = tagContent(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)
    || tagContent(html, /<h1[^>]*>(.*?)<\/h1>/is)
    || tagContent(html, /<title[^>]*>(.*?)<\/title>/is).replace(/^Купить\s+/i, "").replace(/\s+в\s+СПБ.*$/i, "");
  const priceRaw = tagContent(html, /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']*)["']/i);
  const price = Number(String(priceRaw).replace(/[^\d.]/g, ""));
  const currency = tagContent(html, /<meta[^>]+property=["']product:price:currency["'][^>]+content=["']([^"']*)["']/i) || "RUB";
  const availability = tagContent(html, /<meta[^>]+property=["']product:availability["'][^>]+content=["']([^"']*)["']/i);
  const image = tagContent(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
  const description = tagContent(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i)
    || tagContent(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const pathParts = new URL(productUrl).pathname.split("/").filter(Boolean);
  const categoryPath = pathParts.slice(1, -1).join("/");

  return {
    id,
    name,
    price: Number.isFinite(price) ? price : null,
    currency,
    availability,
    categoryPath,
    url: productUrl,
    image,
    description,
    lastmod
  };
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeOutputs(products, failures) {
  products.sort((a, b) => a.categoryPath.localeCompare(b.categoryPath, "ru", { numeric: true }) || a.name.localeCompare(b.name, "ru", { numeric: true }));
  fs.writeFileSync(jsonPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  const columns = ["id", "name", "price", "currency", "availability", "categoryPath", "url", "image", "lastmod"];
  const csv = [
    columns.join(";"),
    ...products.map((product) => columns.map((column) => csvEscape(product[column])).join(";"))
  ].join("\n");
  fs.writeFileSync(csvPath, `\uFEFF${csv}\n`, "utf8");
  fs.writeFileSync(failuresPath, `${JSON.stringify(failures, null, 2)}\n`, "utf8");
}

fs.mkdirSync(outDir, { recursive: true });
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, "utf8")) : {};
const targets = await collectProductUrls();
const queue = targets.filter(({ url }) => !cache[url]);
let completed = targets.length - queue.length;
let activeFailures = [];

console.log(`Found ${targets.length} product URLs, cached ${completed}, queue ${queue.length}`);

async function worker(workerId) {
  while (queue.length) {
    const target = queue.shift();
    try {
      const html = await fetchText(target.url);
      const product = parseProduct(html, target.url, target.lastmod);
      cache[target.url] = product.price == null || product.price <= 0 ? { error: "price_not_found", url: target.url } : product;
    } catch (error) {
      cache[target.url] = { error: error.message, url: target.url };
    }
    completed += 1;
    if (completed % 100 === 0 || completed === targets.length) {
      fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
      console.log(`Progress ${completed}/${targets.length}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 150 + workerId * 25));
  }
}

await Promise.all(Array.from({ length: concurrency }, (_, index) => worker(index)));
fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");

const products = [];
for (const value of Object.values(cache)) {
  if (value && !value.error && value.price != null && value.price > 0) products.push(value);
  else if (value?.error) activeFailures.push(value);
}

writeOutputs(products, activeFailures);
console.log(`Saved ${products.length} products to ${csvPath}`);
console.log(`Failures/no price: ${activeFailures.length}`);
