import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.STORYBOARD_URL ?? "http://localhost:3000";
const directory = "qa-artifacts/motion";
const milestones = [0, 20, 35, 50, 65, 80, 100];
const viewports = [[1440, 900], [768, 900], [390, 844], [844, 390]];
const browser = await chromium.launch({
  channel: process.env.STORYBOARD_BROWSER_CHANNEL || undefined,
  args: process.env.STORYBOARD_SOFTWARE === "1" ? ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] : [],
});
const report = { browser: browser.version(), viewports: [] };

async function painted(page, percent) {
  try {
    await page.waitForFunction((p) =>
      Math.abs(Number(document.querySelector(".core-surface canvas")?.dataset.progress) - p / 100) < .001,
    percent, { timeout: 10000 });
  } catch (error) {
    const state = await page.evaluate(() => ({
      scrollY, hash: location.hash, progress: document.querySelector(".core-surface canvas")?.dataset.progress,
    }));
    throw new Error(`Could not render ${percent}% at ${page.viewportSize().width}px. Last state: ${JSON.stringify(state)}`, { cause: error });
  }
}

async function go(page, percent) {
  await page.evaluate((p) => {
    const travel = document.documentElement.scrollHeight - innerHeight;
    scrollTo(0, Math.round(travel * p / 100));
  }, percent);
  await painted(page, percent);
}

async function inspect(page) {
  const sample = await page.evaluate(() => {
    let snapshot;
    const root = document.querySelector(".storyboard");
    root.dispatchEvent(new CustomEvent("smt:inspect", { detail: (value) => { snapshot = value; } }));
    return snapshot;
  });
  assert(sample, "Run Next.js in development or build with NEXT_PUBLIC_STORYBOARD_DIAGNOSTICS=1.");
  assert(Math.abs(sample.timelineProgress - sample.renderedProgress) < .001);
  assert(Math.abs(sample.scrollTriggerProgress - sample.renderedProgress) < .001);
  return sample;
}

function motion(sample) {
  return [sample.camera, sample.target, sample.root.rotation, sample.root.scale, sample.displayOpacity,
    ...sample.parts.flatMap(({ localPosition, worldPosition, rotation, scale }) => [localPosition, worldPosition, rotation, scale])];
}

function distance(left, right) {
  return Math.hypot(...left.map((value, index) => value - right[index]));
}

function limit(sample) {
  return Math.max(...sample.parts.flatMap(({ projected }) => Object.values(projected).map(Math.abs)));
}

async function wheel(page, delta) {
  const previous = (await inspect(page)).renderedProgress;
  await page.mouse.wheel(0, delta);
  await page.waitForFunction(({ previous, delta }) => {
    const value = Number(document.querySelector(".core-surface canvas")?.dataset.progress);
    return delta > 0 ? value > previous : value < previous;
  }, { previous, delta });
  return (await inspect(page)).renderedProgress;
}

async function touch(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 195, y: 724 }] });
  for (const y of [690, 650, 605, 555, 510]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 195, y }] });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForFunction(() => Number(document.querySelector(".core-surface canvas")?.dataset.progress) > .025);
  await cdp.detach();
}

try {
  for (const [width, height] of viewports) {
    const page = await browser.newPage({
      viewport: { width, height }, hasTouch: width === 390, isMobile: width === 390,
    });
    const issues = [];
    page.on("pageerror", (error) => issues.push(error.message));
    page.on("console", (message) => {
      if (["warning", "error"].includes(message.type()) && !message.text().includes("SwiftShader")) issues.push(message.text());
    });
    await page.goto(base);
    const canvas = page.locator('[data-mode="live"] .core-surface canvas');
    await canvas.waitFor({ timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    const handle = await canvas.elementHandle();
    const folder = `${directory}/${width}x${height}`;
    await mkdir(folder, { recursive: true });
    const samples = [];
    let maxProjectedExtent = 0;

    for (const percent of milestones) {
      await go(page, percent);
      const sample = await inspect(page);
      samples.push({ percent, ...sample });
      const box = await canvas.boundingBox();
      assert(box && Math.abs(box.x) < 1 && Math.abs(box.y) < 1 && box.width === width && box.height === height,
        `Stage was not viewport-pinned at ${width}px / ${percent}%`);
      assert(await page.evaluate((initial) => initial === document.querySelector(".core-surface canvas"), handle));
      await page.screenshot({ path: `${folder}/${String(percent).padStart(3, "0")}.png` });
    }

    const [arrival, , , exploded, , , display] = samples;
    for (const sample of samples) {
      assert.equal(sample.root.id, arrival.root.id);
      assert.deepEqual(sample.parts.map((part) => part.id), arrival.parts.map((part) => part.id));
    }
    for (const [left, right] of [[arrival, exploded], [exploded, display], [arrival, display]]) {
      assert(distance(left.camera, right.camera) > 1);
      assert(distance(left.target, right.target) > .05);
      assert(left.parts.filter((part, index) => distance(part.worldPosition, right.parts[index].worldPosition) > .15).length >= 3);
    }
    assert(exploded.parts.filter((part) => distance(part.rotation, [0, 0, 0]) > .04).length >= 3);
    assert(distance(arrival.root.scale, display.root.scale) > .10);
    assert.equal(display.displayOpacity, 1);

    for (const sample of [...samples].reverse()) {
      await go(page, sample.percent);
      assert.deepEqual(motion(await inspect(page)), motion(sample), `Reverse transform mismatch at ${width}px / ${sample.percent}%`);
    }
    for (let percent = 0; percent <= 100; percent += 5) {
      await go(page, percent);
      const sample = await inspect(page);
      maxProjectedExtent = Math.max(maxProjectedExtent, limit(sample));
      assert(limit(sample) < 1.01, `Part outside frame at ${width}px / ${percent}%: ${limit(sample)}`);
    }

    await go(page, 20);
    const slowWheel = [];
    for (let step = 0; step < 5; step++) slowWheel.push(await wheel(page, 75));
    await wheel(page, -110);
    await page.keyboard.press("End");
    await painted(page, 100);
    const stopped = await inspect(page);
    await page.waitForTimeout(275);
    assert.deepEqual(motion(await inspect(page)), motion(stopped), "Pose moved after scroll stopped");

    await go(page, 65);
    await page.reload();
    await painted(page, 65);
    const reloaded = await inspect(page);
    assert.deepEqual(motion(reloaded), motion(samples[4]));

    if (width === 390) {
      await go(page, 0);
      await touch(page);
      // Let the native fling settle before activating the next chapter.
      await page.evaluate(async () => {
        let previous = scrollY;
        let idle = 0;
        while (idle < 3) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          idle = scrollY === previous ? idle + 1 : 0;
          previous = scrollY;
        }
      });
    }

    const projectLink = page.getByRole("navigation").getByRole("link", { name: /transformation/i });
    if (width === 390) await projectLink.tap();
    else {
      await projectLink.focus();
      await page.keyboard.press("Enter");
    }
    await painted(page, 96);
    await page.waitForFunction(() => document.activeElement?.id === "transformation-title");
    await page.waitForURL("**/#transformation");

    const beforeResize = await inspect(page);
    await page.setViewportSize({ width: width === 1440 ? 1100 : width + 25, height });
    await page.waitForFunction((oldPixels) => {
      const c = document.querySelector(".core-surface canvas");
      return c && c.width * c.height !== oldPixels;
    }, beforeResize.canvasPixels);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await painted(page, 96);
    const resized = await inspect(page);
    assert.equal(resized.root.id, beforeResize.root.id);
    assert.notDeepEqual(resized.parts.map((part) => part.projected), beforeResize.parts.map((part) => part.projected));
    assert.deepEqual(issues, []);

    const p95FrameMs = await page.evaluate(async () => {
      const maximum = document.documentElement.scrollHeight - innerHeight;
      const times = [];
      let previous = performance.now();
      for (let step = 0; step <= 30; step++) {
        scrollTo(0, maximum * step / 30);
        const now = await new Promise((resolve) => requestAnimationFrame(resolve));
        if (step) times.push(now - previous);
        previous = now;
      }
      return Math.round(times.sort((a, b) => a - b)[Math.ceil(times.length * .95) - 1]);
    });
    report.viewports.push({ width, height, samples, maxProjectedExtent, slowWheel, p95FrameMs, resized, issues });
    console.log(`${width} × ${height}: sampled, reversed, reloaded, resized; max projected extent ${maxProjectedExtent.toFixed(3)}`);
    await page.close();
  }

  const reduced = await browser.newPage({ viewport: { width: 1838, height: 1028 }, reducedMotion: "reduce" });
  await reduced.addInitScript(() => sessionStorage.setItem("smt-motion-choice", "off"));
  await reduced.goto(base);
  const automaticCanvas = reduced.locator('[data-mode="live"] canvas');
  await automaticCanvas.waitFor();
  assert(await reduced.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches));
  assert.equal(await reduced.locator(".masthead button").count(), 0);
  assert.deepEqual(await automaticCanvas.boundingBox(), { x: 0, y: 0, width: 1838, height: 1028 });
  const initial = await inspect(reduced);
  await go(reduced, 50);
  const open = await inspect(reduced);
  assert(distance(open.parts[0].worldPosition, initial.parts[0].worldPosition) > 1);
  await reduced.screenshot({ path: `${directory}/automatic-motion.png` });
  await reduced.emulateMedia({ reducedMotion: "no-preference" });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  assert.equal((await inspect(reduced)).root.id, open.root.id);
  await reduced.reload();
  await painted(reduced, 50);
  assert.deepEqual(motion(await inspect(reduced)), motion(open));
  await go(reduced, 100);
  assert.equal((await inspect(reduced)).displayOpacity, 1);
  await go(reduced, 0);
  assert.deepEqual(motion(await inspect(reduced)), motion(initial));
  await reduced.close();
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    window.blockWebGL = true;
    HTMLCanvasElement.prototype.getContext = function (kind, ...options) {
      return window.blockWebGL && kind === "webgl2" ? null : original.call(this, kind, ...options);
    };
  });
  await fallback.goto(base);
  await fallback.locator('[data-mode="unavailable"]').waitFor();
  assert.equal(await fallback.locator("canvas").count(), 0);
  await fallback.screenshot({ path: `${directory}/webgl-unavailable.png`, fullPage: true });
  await fallback.evaluate(() => { window.blockWebGL = false; });
  await fallback.getByRole("button", { name: "Retry 3D stage" }).click();
  await fallback.locator('[data-mode="live"] canvas').waitFor();
  await fallback.evaluate(() => {
    const canvas = document.querySelector(".core-surface canvas");
    canvas.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext();
  });
  await fallback.locator('[data-mode="unavailable"]').waitFor();
  assert.equal(await fallback.locator("canvas").count(), 0);
  await fallback.close();

  const direct = await browser.newPage();
  await direct.goto(`${base}/#disassembly`);
  await painted(direct, 50);
  await direct.close();

  const noScript = await browser.newPage({ javaScriptEnabled: false });
  await noScript.goto(base);
  assert.equal(await noScript.locator("canvas").count(), 0);
  assert(await noScript.getByRole("heading", { name: "Built beyond the classroom." }).isVisible());
  await noScript.close();

  report.automaticMotionWithReducedMotion = true;
  report.noWebGLAndRetry = true;
  report.contextLoss = true;
  report.directChapterLink = true;
  report.noJavaScript = true;
  await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}

