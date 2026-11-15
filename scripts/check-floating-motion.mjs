import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.STORYBOARD_URL || "http://127.0.0.1:3138";
const folder = "qa-artifacts/float-motion";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const report = [];
try {
  for (const [width, height, reducedMotion] of [[1838, 1028, null], [390, 844, "reduce"], [1440, 900, "no-preference"]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion,
      isMobile: width === 390, hasTouch: width === 390,
      recordVideo: width === 1838 ? { dir: folder + "/video", size: { width: 1440, height: 806 } } : undefined });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    await page.locator('[data-mode="live"] canvas').waitFor();
    const inheritedPreference = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reducedMotion === "reduce") assert(inheritedPreference);
    const entrance = await page.locator("canvas").evaluate(async canvas => {
      const poses = [];
      for (let i = 0; i < 90; i++) {
        poses.push({ opacity: Number(getComputedStyle(canvas).opacity), transform: getComputedStyle(canvas).transform });
        await new Promise(requestAnimationFrame);
      }
      return poses;
    });
    assert(entrance.some(p => p.opacity > .05 && p.opacity < .9), "Object must float in under the inherited OS preference");
    const wheelDistance = await page.evaluate(() => Math.round((document.documentElement.scrollHeight - innerHeight) * .50 / 6.13));
    await page.mouse.wheel(0, wheelDistance);
    const frames = await page.evaluate(async () => {
      const values = [];
      const began = performance.now();
      while (performance.now() - began < 1900) {
        let scene;
        document.querySelector(".storyboard").dispatchEvent(new CustomEvent("smt:inspect", { detail: value => { scene = value; } }));
        const heading = document.querySelector(".chapter--disassembly h2");
        const style = getComputedStyle(heading);
        values.push({ ms: performance.now() - began, progress: scene.renderedProgress, target: scene.targetProgress,
          camera: scene.camera, cover: scene.parts[0].localPosition, optic: scene.parts[1].localPosition,
          text: { opacity: Number(style.opacity), transform: style.transform, clip: style.clipPath } });
        await new Promise(requestAnimationFrame);
      }
      return values;
    });
    assert(frames.some(f => f.progress > .001 && f.progress < f.target - .002), "Object must interpolate, including with reduced motion reported by the OS");
    assert(new Set(frames.map(f => JSON.stringify(f.camera))).size > 10);
    assert(new Set(frames.map(f => JSON.stringify(f.cover))).size > 10);
    assert(new Set(frames.map(f => JSON.stringify(f.optic))).size > 10);
    // Wheel distance differs with mobile viewport travel. Seek the Disassembly stop
    // through the real chapter link to validate the text handoff on every layout.
    await page.getByRole("link", { name: "Disassembly", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("canvas")?.dataset.settled === "true");
    await page.locator(".chapters").evaluate(root => Promise.all(root.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {}))));
    await page.screenshot({ path: `${folder}/${width}-disassembled.png` });
    await page.getByRole("link", { name: "Credentials", exact: true }).click();
    await page.waitForTimeout(850);
    const midText = await page.locator(".chapter--credentials h2").evaluate(el => ({ opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform }));
    assert(midText.opacity > 0 && midText.opacity < 1, "Text must be visibly entering under the actual OS preference");
    await page.screenshot({ path: `${folder}/${width}-floating.png` });
    await page.waitForTimeout(1900);
    await page.mouse.wheel(0, -160);
    await page.waitForTimeout(1200);
    await page.getByRole("link", { name: "The Making of SMT, arrival" }).click();
    await page.waitForFunction(() => document.querySelector("canvas")?.dataset.settled === "true");
    await page.waitForTimeout(1400);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    report.push({ width, height, inheritedPreference, entrance, frames, midText });
    const video = page.video();
    await page.close();
    if (video) await video.saveAs(`${folder}/native-preference-floating.webm`);
    console.log(`${width}px inherited reduced=${inheritedPreference}: object entrance, camera/parts interpolation, text glide, reverse passed`);
  }
  await writeFile(`${folder}/report.json`, JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
