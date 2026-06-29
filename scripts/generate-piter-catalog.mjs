import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const piterBase = "https://pitergsm.ru";
const sourceUrls = [
  "/catalog/phones/iphone/",
  "/catalog/tablets/ipad/",
  "/catalog/mac/macbook-pro/",
  "/catalog/mac/macbook-air/",
  "/catalog/mac/macbook-neo/",
  "/catalog/mac/imac/",
  "/catalog/mac/mac-mini/",
  "/catalog/mac/mac-studio/",
  "/catalog/elektronika/computers/apple-studio-display/"
];

function extractImpressions(html) {
  const items = [];
  const regex = /window\.dataLayerJsonimpressions\s*=\s*(\[.*?\]);/gs;
  let match;
  while ((match = regex.exec(html))) {
    items.push(...JSON.parse(match[1]));
  }
  return items;
}

function extractNextUrl(html) {
  const match = html.match(/class="[^"]*load_more[^"]*"[^>]*data-url="([^"]+)"/)
    || html.match(/data-url="([^"]+)"[^>]*class="[^"]*load_more[^"]*"/);
  if (!match) return "";
  return match[1].replace(/&amp;/g, "&");
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      "accept": "text/html,application/xhtml+xml"
    }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function collectPages() {
  const pages = [];
  for (const start of sourceUrls) {
    let next = start;
    const visited = new Set();
    for (let page = 1; next && page <= 20; page += 1) {
      const url = next.startsWith("http") ? next : `${piterBase}${next}`;
      if (visited.has(url)) break;
      visited.add(url);
      try {
        const html = await fetchText(url);
        pages.push({ url, html });
        next = extractNextUrl(html);
      } catch (error) {
        console.warn(`Skip ${url}: ${error.message}`);
        break;
      }
    }
  }
  return pages;
}

function sectionFor(name) {
  if (/iPhone/i.test(name)) return "iPhone";
  if (/iPad/i.test(name)) return "iPad";
  if (/MacBook|Mac mini|Mac Mini|Mac Studio|iMac|Studio Display/i.test(name)) return "Mac";
  return "";
}

function modelFor(name, section) {
  if (section === "iPhone") {
    return name.match(/iPhone\s+(SE\s*2022|\d{2}\s*Pro\s*Max|\d{2}\s*Pro|\d{2}\s*Plus|\d{2}\s*mini|\d{2}e|\d{2}|Air)/i)?.[0] || "iPhone";
  }
  if (section === "iPad") {
    if (/iPad\s+Pro/i.test(name)) return "iPad Pro";
    if (/iPad\s+Air/i.test(name)) return "iPad Air";
    if (/iPad\s+mini/i.test(name)) return "iPad mini";
    return "iPad";
  }
  if (/MacBook\s+Pro/i.test(name)) return "MacBook Pro";
  if (/MacBook\s+Air/i.test(name)) return "MacBook Air";
  if (/MacBook\s+Neo/i.test(name)) return "MacBook Neo";
  if (/Mac\s+mini|Mac\s+Mini/i.test(name)) return "Mac mini";
  if (/Mac\s+Studio/i.test(name)) return "Mac Studio";
  if (/Studio\s+Display/i.test(name)) return "Apple Studio Display";
  if (/iMac/i.test(name)) return "iMac";
  return "Mac";
}

function slugify(value) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
    х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };
  return String(value)
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => map[char] || char)
    .replace(/&quot;/g, "")
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function htmlDecode(value) {
  return String(value || "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")")
    .replace(/\s+/g, " ")
    .trim();
}

const seen = new Set();
const products = [];

const pages = await collectPages();

for (const { html } of pages) {
  for (const item of extractImpressions(html)) {
    const name = htmlDecode(item.name);
    const section = sectionFor(name);
    if (!section) continue;
    const id = `piter-${item.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const model = modelFor(name, section);
    const price = Number(item.price || 0);
    products.push({
      id,
      sku: `PITER-${item.id}`,
      slug: slugify(name),
      name,
      section,
      category: section,
      subcategory: model,
      brand: "Apple",
      retailPrice: price,
      wholesalePrice: price,
      stockQty: 3,
      imageUrl: "",
      gallery: [],
      description: name,
      attributes: {
        model,
        memory: "",
        color: "",
        sim: "",
        availability: "In stock",
        productType: section === "iPhone" ? "phone" : section === "iPad" ? "tablet" : "computer",
        source: "PiterGSM"
      }
    });
  }
}

products.sort((a, b) => {
  if (a.section !== b.section) return a.section.localeCompare(b.section);
  if (a.subcategory !== b.subcategory) return a.subcategory.localeCompare(b.subcategory, "ru", { numeric: true });
  return Number(a.retailPrice) - Number(b.retailPrice);
});

const out = `export const piterCatalogProducts = ${JSON.stringify(products, null, 2)};\n`;
fs.mkdirSync(path.join(root, "src", "generated"), { recursive: true });
fs.writeFileSync(path.join(root, "src", "generated", "piterCatalogProducts.js"), out, "utf8");
console.log(`Generated ${products.length} PiterGSM products from ${pages.length} pages`);
