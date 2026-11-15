import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const base = process.env.STORYBOARD_URL || "http://127.0.0.1:3138";
const folder = "qa-artifacts/seo/final";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const axe = await readFile("node_modules/axe-core/axe.min.js", "utf8");
const slugs = ["pgc-dha", "resumeiq", "ledger", "folio", "nudge"];
const report = { ssr: [], browsers: [] };
try {
  const html = await browser.newPage({ javaScriptEnabled: false });
  const titles = new Set();
  const descriptions = new Set();
  for (const path of ["/", ...slugs.map(slug => `/work/${slug}`)]) {
    const response = await html.goto(base + path);
    assert.equal(response.status(), 200);
    assert.equal(await html.locator("h1").count(), 1);
    assert.equal(await html.locator("main#main-content").count(), 1);
    const title = await html.title();
    const description = await html.locator('meta[name="description"]').getAttribute("content");
    assert(!titles.has(title)); titles.add(title);
    assert(!descriptions.has(description)); descriptions.add(description);
    assert(await html.locator("main").innerText());
    if (path === "/") {
      for (const slug of slugs) assert(await html.locator(`a[href="/work/${slug}"]`).count());
      for (const chapter of ["credentials", "about", "finale"]) assert(await html.locator(`a[href="#${chapter}"]`).count());
      assert(await html.getByRole("heading", { name: "Sajid Mehmood Tariq", exact: true }).isVisible());
    } else {
      for (const section of ["brief", "architecture", "decisions", "sources"]) assert(await html.locator(`#${section} h2`).isVisible());
      assert(await html.locator('a[href^="https://github.com/"]').count());
    }
    assert.equal(await html.locator("img:not([alt])").count(), 0);
    report.ssr.push({ path, title, description });
  }
  await html.close();
  for (const [width, height] of [[1440, 900], [390, 844], [320, 568]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    await page.locator('[data-mode="live"] canvas').waitFor();
    await page.waitForTimeout(1700);
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.textContent), "Skip to content");
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "main-content");
    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
    assert.deepEqual(violations, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `${folder}/${width}-arrival.png` });
    const alternative = page.locator(".motion-alternative");
    assert(await alternative.isVisible());
    await alternative.click();
    await page.locator('[data-mode="reading"]').waitFor();
    assert.equal(await page.locator("canvas").count(), 0);
    assert(await page.locator("#inside-system").isVisible());
    assert.deepEqual(errors, []);
    report.browsers.push({ width, height, violations, skipLink: true, firstChapterReadingAlternative: true, errors });
    await page.close();
  }
  const unavailable = await browser.newPage();
  await unavailable.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) { return kind === "webgl2" ? null : original.call(this, kind, ...args); };
  });
  await unavailable.goto(base);
  await unavailable.locator('[data-mode="unavailable"]').waitFor();
  assert.equal(await unavailable.getByRole("link", { name: "Read case study" }).count(), 5);
  assert(await unavailable.getByRole("button", { name: "Retry 3D stage" }).isVisible());
  await unavailable.close();
  report.webglFallback = true;
  await writeFile(`${folder}/quality.json`, JSON.stringify(report, null, 2));
  console.log("SSR discoverability, descriptive metadata, semantic content, skip navigation, visible no-motion alternative, mobile axe and static WebGL fallback passed.");
} finally { await browser.close(); }
