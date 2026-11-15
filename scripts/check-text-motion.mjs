import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { storyDuration } from "../content/storyboard.ts";

const folder = "qa-artifacts/text-motion";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ channel: process.env.STORYBOARD_BROWSER_CHANNEL || "chrome" });
const base = process.env.STORYBOARD_URL || "http://127.0.0.1:3138";
const report = { browser: browser.version(), viewports: [] };

async function ready(page) {
  await page.waitForFunction(() => document.querySelector("canvas")?.dataset.settled === "true");
  await page.locator(".chapters").evaluate(async root => {
    await Promise.all(root.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})));
  });
}

async function go(page, time) {
  await page.evaluate(t => scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * t)), time / storyDuration);
  await page.waitForFunction(t => Math.abs(Number(document.querySelector("canvas")?.dataset.progress) - t) < .001,
    time / storyDuration);
  await ready(page);
}

async function transition(page, from, to, outgoing, incoming, name, width) {
  await go(page, from);
  const capture = page.evaluate(async ({ time, outgoing, incoming }) => {
    const previous = document.querySelector(outgoing);
    const next = document.querySelector(incoming);
    const values = [];
    scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * time));
    const began = performance.now();
    while (performance.now() - began < 2700) {
      function animatedHeading(panel) {
        let child = panel.querySelector("h1,h2,h3") || panel.firstElementChild;
        while (child.parentElement !== panel) child = child.parentElement;
        return child;
      }
      const oldHeading = animatedHeading(previous);
      const heading = animatedHeading(next);
      const oldStyle = getComputedStyle(oldHeading);
      const style = getComputedStyle(heading);
      values.push({ ms: performance.now() - began, outgoingVisible: previous.hasAttribute("data-text-visible"),
        incomingVisible: next.hasAttribute("data-text-visible"), opacity: Number(style.opacity),
        oldOpacity: Number(oldStyle.opacity), transform: style.transform, clipPath: style.clipPath,
        outgoingInert: previous.inert, incomingInert: next.inert });
      await new Promise(requestAnimationFrame);
    }
    return values;
  }, { time: to / storyDuration, outgoing, incoming });
  await page.waitForTimeout(850);
  await page.screenshot({ path: `${folder}/${width}-${name}-intermediate.png` });
  const frames = await capture;
  assert(frames.some(f => f.incomingVisible && f.opacity > .05 && f.opacity < .95), `${name}: intermediate incoming opacity`);
  assert(frames.some(f => f.outgoingVisible && f.oldOpacity > .05 && f.oldOpacity < .95), `${name}: outgoing survives while fading`);
  assert(!frames.some(f => f.outgoingVisible && f.incomingVisible && f.opacity > .2 && f.oldOpacity > .2), `${name}: headings should not compete at readable opacity`);
  assert(new Set(frames.filter(f => f.incomingVisible).map(f => f.transform)).size > 5, `${name}: actual positional motion`);
  assert(new Set(frames.filter(f => f.incomingVisible).map(f => f.clipPath)).size > 5, `${name}: intermediate mask reveal`);
  assert.equal(frames.at(-1).outgoingVisible, false, `${name}: no lingering outgoing copy`);
  assert.equal(frames.at(-1).incomingVisible, true);
  assert.equal(frames.at(-1).opacity, 1);
  assert.equal(frames.at(-1).incomingInert, false);
  await page.screenshot({ path: `${folder}/${width}-${name}-settled.png` });
  return { name, frames };
}

try {
  for (const [width, height] of [[1440, 900], [768, 900], [390, 844], [320, 568], [844, 390]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce", hasTouch: width < 400, isMobile: width < 400,
      recordVideo: width === 1440 ? { dir: `${folder}/video`, size: { width, height } } : undefined });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    await page.locator('[data-mode="live"] canvas').waitFor();
    await ready(page);
    const results = [];
    for (const item of [
      [0, .5, ".chapter--arrival", ".chapter--disassembly", "forward"],
      [.5, .91, ".chapter--disassembly", ".chapter--credentials", "credentials"],
      [.91, .5, ".chapter--credentials", ".chapter--disassembly", "reverse"],
      [.91, 1.2, ".credential-entry:nth-child(1)", ".credential-entry:nth-child(2)", "certificate"],
      [1.56, 1.82, ".project-entry:nth-child(1)", ".project-entry:nth-child(2)", "project"],
      [2.6, 3.04, ".chapter--transformation", ".chapter--system", "system"],
      [3.04, 3.185, '[data-engineering-entry="trace"]:nth-child(1)', '[data-engineering-entry="trace"]:nth-child(2)', "request"],
      [3.7, 4.1, ".chapter--system", ".chapter--lab", "lab"],
      [4.1, 4.33, '[data-engineering-entry="lab"]:nth-child(1)', '[data-engineering-entry="lab"]:nth-child(2)', "experiment"],
      [4.56, 4.9, ".chapter--lab", ".chapter--about", "profile"],
      [4.9, 5.1, '[data-engineering-entry="about"]:nth-child(1)', '[data-engineering-entry="about"]:nth-child(2)', "about"],
      [5.3, 6.04, ".chapter--about", ".chapter--finale", "finale"],
    ]) {
      results.push(await transition(page, ...item, width));
    }
    // Interrupt an entrance before it finishes and reverse it. Values should continue from the painted pose.
    await go(page, .5);
    const interruption = await page.evaluate(async () => {
      const heading = document.querySelector(".chapter--disassembly h2");
      scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 95));
      const before = Number(getComputedStyle(heading).opacity);
      scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * .5 / 6.13));
      await new Promise(requestAnimationFrame);
      return { before, after: Number(getComputedStyle(heading).opacity) };
    });
    assert(Math.abs(interruption.after - interruption.before) < .35, "Interrupted text must continue from its painted pose");
    await ready(page);
    await page.setViewportSize({ width: height, height: width });
    await ready(page);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    report.viewports.push({ width, height, results, interruption });
    const recording = page.video();
    await page.close();
    if (recording) await recording.saveAs(`${folder}/text-transitions.webm`);
    console.log(`${width}px chapter exits, staggered reveals, reverse, selectors, interruption and resize passed`);
  }
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto(base);
  await reduced.locator('[data-mode="live"] canvas').waitFor();
  await go(reduced, .91);
  await transition(reduced, .91, .5, ".chapter--credentials", ".chapter--disassembly", "os-reduced-still-cinematic", 1280);
  await reduced.goto(base + "/?view=reading");
  await reduced.locator('[data-mode="reading"]').waitFor();
  assert.equal(await reduced.locator("canvas").count(), 0);
  await reduced.close();
  report.cinematicUnderReducedPreference = report.readingMode = true;
  await writeFile(`${folder}/report.json`, JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
