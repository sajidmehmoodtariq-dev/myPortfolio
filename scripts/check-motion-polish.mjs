import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.STORYBOARD_URL || "http://127.0.0.1:3138";
const folder = "qa-artifacts/motion-polish";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ channel: process.env.STORYBOARD_BROWSER_CHANNEL || "chrome" });
const report = { browser: browser.version(), viewports: [] };

async function settled(page) {
  await page.waitForFunction(() => document.querySelector(".core-surface canvas")?.dataset.settled === "true");
}

async function sample(page) {
  return page.evaluate(() => {
    let result;
    document.querySelector(".storyboard").dispatchEvent(new CustomEvent("smt:inspect", { detail: value => { result = value; } }));
    return result;
  });
}

try {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width === 390, isMobile: width === 390 });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/_next/static/chunks/*.js", async route => {
      await new Promise(resolve => setTimeout(resolve, 350));
      await route.continue();
    });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".core-surface").evaluate(el => getComputedStyle(el).backgroundImage), "none");
    const loadingTitle = await page.locator("#arrival-title").boundingBox();
    await page.screenshot({ path: `${folder}/${width}-loading.png` });
    await page.locator('[data-mode="live"] canvas').waitFor();
    const entrance = await page.locator("canvas").evaluate(async el => {
      const values = [];
      for (let i = 0; i < 95; i++) {
        values.push({ opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform });
        await new Promise(requestAnimationFrame);
      }
      return values;
    });
    assert(entrance.some(({ opacity }) => opacity > 0 && opacity < .95), "Live scene should resolve over intermediate frames");
    assert.equal(entrance.at(-1).opacity, 1);
    const readyTitle = await page.locator("#arrival-title").boundingBox();
    assert(Math.abs(loadingTitle.y - readyTitle.y) < 20, "Loading and live typography should keep the same composition");
    await page.screenshot({ path: `${folder}/${width}-ready.png` });
    await page.unrouteAll({ behavior: "wait" });
    const original = await sample(page);
    const travel = await page.evaluate(async () => {
      scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * .31));
      const frames = [];
      for (let i = 0; i < 30; i++) {
        await new Promise(requestAnimationFrame);
        let value;
        document.querySelector(".storyboard").dispatchEvent(new CustomEvent("smt:inspect", { detail: sample => { value = sample; } }));
        frames.push({ progress: value.renderedProgress, target: value.targetProgress, camera: value.camera, optic: value.parts[1].localPosition });
      }
      return frames;
    });
    assert(travel.some(({ progress, target }) => progress > .001 && progress < target - .001));
    assert.equal(new Set(travel.map(frame => JSON.stringify(frame.camera))).size > 3, true);
    await settled(page);
    const forward = await sample(page);
    assert.equal(forward.root.id, original.root.id);
    await page.screenshot({ path: `${folder}/${width}-scrolled.png` });
    await page.reload();
    await page.locator('[data-mode="live"] canvas').waitFor();
    await settled(page);
    const restored = await sample(page);
    assert.equal(restored.renderedProgress, forward.renderedProgress);
    assert.deepEqual(restored.camera, forward.camera);
    await page.getByRole("link", { name: "The Making of SMT, arrival" }).click();
    await settled(page);
    await page.waitForFunction(() => document.activeElement?.id === "arrival-title");
    assert.deepEqual((await sample(page)).camera, original.camera);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    assert.deepEqual(errors, []);
    report.viewports.push({ width, height, entrance, travel, restoredProgress: restored.renderedProgress });
    await page.close();
    console.log(`${width}px loading, live reveal, interpolated motion, reload, and reverse verified`);
  }

  const editorial = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await editorial.goto(base + "/work/folio");
  await editorial.waitForFunction(() => document.querySelector("[data-reveal]")?.getAnimations().length > 0);
  await editorial.locator("#architecture").scrollIntoViewIfNeeded();
  await editorial.waitForFunction(() => document.querySelector("#architecture").getAnimations().length > 0);
  await editorial.screenshot({ path: `${folder}/editorial.png` });
  await editorial.close();

  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto(base);
  await reduced.locator('[data-mode="live"] canvas').waitFor();
  assert.equal(await reduced.locator("canvas").evaluate(el => el.getAnimations().length > 0), true);
  await reduced.getByRole("link", { name: "Contact", exact: true }).last().click();
  await settled(reduced);
  await reduced.waitForFunction(() => document.activeElement?.id === "finale-title");
  await reduced.goto(base + "/work/folio");
  await reduced.waitForTimeout(100);
  assert.equal(await reduced.locator("[data-reveal]").first().evaluate(el => el.getAnimations().length), 0);
  await reduced.close();
  report.editorialReveals = report.reducedMotion = true;
  await writeFile(`${folder}/report.json`, JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
