import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { requestStops, storyDuration } from "../content/storyboard.ts";

const base = process.env.STORYBOARD_URL || "http://127.0.0.1:3138";
const folder = "qa-artifacts/motherboard";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const report = [];

async function seek(page, time) {
  await page.evaluate(t => scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * t)), time / storyDuration);
  await page.waitForFunction(t => {
    const canvas = document.querySelector("canvas");
    return canvas?.dataset.settled === "true" && Math.abs(Number(canvas.dataset.progress) - t) < .001;
  }, time / storyDuration);
  await page.locator(".chapters").evaluate(root => Promise.all(root.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {}))));
  return page.evaluate(() => {
    let result;
    document.querySelector(".storyboard").dispatchEvent(new CustomEvent("smt:inspect", { detail: value => { result = value; } }));
    return result;
  });
}

try {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [844, 390]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: null,
      hasTouch: width === 390, isMobile: width === 390,
      recordVideo: width === 1440 ? { dir: folder + "/video", size: { width, height } } : undefined });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    await page.locator('[data-mode="live"] canvas').waitFor();
    const initial = await seek(page, 0);
    await seek(page, 2.60);
    const states = [];
    for (const [index, stop] of requestStops.entries()) {
      const state = await seek(page, stop.at);
      const parts = Object.fromEntries(state.parts.map(part => [part.name, part]));
      assert.equal(state.root.id, initial.root.id);
      assert.deepEqual(state.parts.map(p => p.id), initial.parts.map(p => p.id));
      assert.equal(state.engineering.traceParent, "logic-assembly");
      assert.equal(state.engineering.trace, index);
      assert(parts["logic-assembly"].localPosition[1] > parts["optical-interface"].localPosition[1] + .4);
      assert(parts["logic-assembly"].localPosition[1] > parts["precision-bezel"].localPosition[1] + .4);
      assert(Math.max(...state.parts.flatMap(p => Object.values(p.projected).map(Math.abs))) < 1.01, "Assembly must remain inside the viewport");
      assert(state.engineering.signal);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.screenshot({ path: `${folder}/${width}-${stop.id}.png` });
      states.push(state);
    }
    assert.equal(new Set(states.map(s => JSON.stringify(s.engineering.signal))).size, 5);
    assert.deepEqual(states[0].engineering.signal, states[5].engineering.signal);
    for (const index of [3, 1, 0]) {
      const reverse = await seek(page, requestStops[index].at);
      assert.deepEqual(reverse.engineering, states[index].engineering);
      assert.deepEqual(reverse.parts.map(p => p.localPosition), states[index].parts.map(p => p.localPosition));
    }
    await page.getByRole("navigation", { name: "Request stages" }).getByRole("link", { name: "Data", exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.id === "trace-data-title");
    const lab = await seek(page, 4.10);
    assert(lab.engineering.cartridges);
    await page.screenshot({ path: `${folder}/${width}-lab-exit.png` });
    const finale = await seek(page, 6.04);
    assert.deepEqual(finale.parts.map(p => [p.localPosition, p.rotation]), initial.parts.map(p => [p.localPosition, p.rotation]));
    assert.deepEqual(errors, []);
    report.push({ width, height, states, lab, finale });
    const video = page.video();
    await page.close();
    if (video) await video.saveAs(`${folder}/motherboard-request.webm`);
    console.log(`${width}px: exposed PCB, six request stages, board-mounted signal, reverse, Lab exit and reassembly passed`);
  }
  await writeFile(`${folder}/report.json`, JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
