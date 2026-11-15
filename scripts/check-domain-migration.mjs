import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { createHash } from "node:crypto";

const base = process.env.STORYBOARD_URL || "http://127.0.0.1:3138";
const origin = "https://sajidmehmoodtariq.dev";
const preview = process.env.MIGRATION_QA_PREVIEW === "1";
const directory = "qa-artifacts/domain-migration";
await mkdir(directory, { recursive: true });
const sitemapResponse = await fetch(base + "/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 9, "Only the nine currently published pages belong in the sitemap");
assert.equal(new Set(urls).size, urls.length);
assert(!urls.some(url => url.includes("/notes")), "Do not list unpublished writing");
const robotsResponse = await fetch(base + "/robots.txt");
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert(robots.includes(preview ? "Disallow: /" : "Allow: /"));
for (const path of ["/", "/sitemap.xml", "/robots.txt", "/credentials/cs50x.pdf", "/social/home"]) {
  const response = await fetch(base + path, { method: "HEAD" });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), preview ? "noindex, nofollow" : null,
    `Indexing headers must match the build environment at ${path}`);
}
const browser = await chromium.launch({ channel: "chrome" });
const report = { environment: preview ? "preview" : "production", origin, sitemap: urls, robots, pages: [] };
const socialImages = new Map();
try {
  const page = await browser.newPage({ javaScriptEnabled: false });
  for (const address of urls) {
    const expected = new URL(address);
    assert.equal(expected.origin, origin);
    assert(!expected.pathname.includes("//"));
    const response = await page.goto(base + expected.pathname);
    assert.equal(response.status(), 200);
    const metadata = await page.evaluate(() => ({
      canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(el => el.getAttribute("href")),
      og: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
      twitter: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
      image: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
      twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute("content"),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content"),
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
      links: [...document.querySelectorAll('[href], [src], meta[content]')].map(el => el.getAttribute("href") || el.getAttribute("src") || el.getAttribute("content")),
    }));
    assert.equal(metadata.canonical.length, 1);
    assert.equal(new URL(metadata.canonical[0]).href, expected.href);
    assert.equal(new URL(metadata.og).href, expected.href);
    assert.equal(metadata.twitter, "summary_large_image");
    const project = expected.pathname.startsWith("/work/") ? expected.pathname.split("/").at(-1) : "home";
    assert.equal(metadata.image, `${origin}/social/${project}`);
    assert.equal(metadata.twitterImage, metadata.image);
    const imageResponse = await fetch(base + `/social/${project}`);
    assert.equal(imageResponse.status, 200);
    assert.match(imageResponse.headers.get("content-type"), /image\/png/);
    const imageBytes = Buffer.from(await imageResponse.arrayBuffer());
    assert.equal(imageBytes.readUInt32BE(16), 1200);
    assert.equal(imageBytes.readUInt32BE(20), 630);
    socialImages.set(project, { slug: project, bytes: imageBytes.length, sha256: createHash("sha256").update(imageBytes).digest("hex") });
    assert.match(metadata.robots, preview ? /noindex, nofollow/ : /^index, follow$/);
    assert.equal(metadata.schema.length, project === "home" ? 1 : 2);
    const graph = metadata.schema.find(schema => schema["@graph"])["@graph"];
    if (project !== "home") {
      const breadcrumbs = metadata.schema.find(schema => schema["@type"] === "BreadcrumbList");
      assert(breadcrumbs);
      assert.deepEqual(breadcrumbs.itemListElement.map(item => item.position), [1, 2, 3]);
      assert.deepEqual(breadcrumbs.itemListElement.map(item => item.item), [origin + "/", origin + "/work", expected.href]);
      assert(breadcrumbs.itemListElement.every(item => item["@type"] === "ListItem" && item.name));
    }
    for (const entity of graph) {
      assert.equal(new URL(entity.url).origin, origin);
      assert.equal(new URL(entity["@id"]).origin, origin);
    }
    const person = graph.find(entity => entity["@type"] === "Person");
    assert.deepEqual(person.sameAs, ["https://github.com/sajidmehmoodtariq-dev", "https://www.linkedin.com/in/sajid-mehmood-tariq/"]);
    assert(!metadata.links.some(link => link && /^http:\/\//i.test(link)), "No mixed-content URLs");
    assert(!metadata.links.some(link => link && /https?:\/\/https?:\/\//i.test(link)), "No duplicate URL prefixes");
    if (expected.pathname === "/") {
      assert.equal(await page.locator('a[href="https://github.com/sajidmehmoodtariq-dev"]').count(), 1);
      assert.equal(await page.locator('a.contact-primary').getAttribute("href"), person.sameAs[1]);
      await page.screenshot({ path: `${directory}/homepage-${report.environment}-build.png` });
    }
    report.pages.push({ path: expected.pathname, canonical: metadata.canonical[0], openGraph: metadata.og,
      twitter: metadata.twitter, structuredDataOrigins: graph.map(entity => new URL(entity.url).origin) });
  }
  assert.equal((await fetch(base + "/notes")).status, 404);
  assert.equal((await fetch(base + "/work/unknown-project")).status, 404);
  assert.equal((await fetch(base + "/social/unknown-project")).status, 404);
  assert.equal(socialImages.size, 6);
  assert.equal(new Set([...socialImages.values()].map(image => image.sha256)).size, 6);
  report.socialImages = [...socialImages.values()];
  await page.close();
  await writeFile(`${directory}/generated-seo${preview ? "-preview" : ""}.json`, JSON.stringify(report, null, 2));
  console.log(`${report.environment}: nine distinct canonical/OG URLs, Person/WebSite JSON-LD, Twitter cards, sitemap, robots, unchanged contact links and 404 exclusions passed.`);
} finally {
  await browser.close();
}
