import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const url = process.env.STORYBOARD_URL ?? "http://localhost:3000";
const label = process.argv[2] ?? "after";
const root = `qa-artifacts/refinement/${label}`;
const stops = [0, 15, 30, 50, 70, 85, 100];
const browser = await chromium.launch({
  channel: process.env.STORYBOARD_BROWSER_CHANNEL || undefined,
  args: process.env.STORYBOARD_SOFTWARE === "1" ? ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] : [],
});
const report = { browser: browser.version(), viewports: [] };
const layouts = [
  { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { width: 768, height: 1024, deviceScaleFactor: 1.5 },
  { width: 1440, height: 900, deviceScaleFactor: 1 },
  { width: 1920, height: 1080, deviceScaleFactor: 1 },
];

async function sample(page, percent) {
  return page.evaluate(async (p) => {
    const canvas = document.querySelector(".core-surface canvas");
    const target = p / 100;
    const time = performance.now();
    const painted = () => Math.abs(Number(canvas.dataset.progress) - target) < .001;
    scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * target));
    for (let i = 0; !painted() && i < 80; i++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    if (!painted()) throw new Error(`Expected progress ${target}, got ${canvas.dataset.progress}`);
    const latencyMs = performance.now() - time;
    let scene;
    document.querySelector("main").dispatchEvent(new CustomEvent("smt:inspect", { detail: (value) => { scene = value; } }));
    return { percent: p, latencyMs, css: [canvas.clientWidth, canvas.clientHeight], buffer: [canvas.width, canvas.height], ...scene };
  }, percent);
}

function pose(frame) {
  return [frame.camera, frame.target, frame.root.rotation, frame.root.scale, frame.displayOpacity,
    frame.parts.map(({ localPosition, rotation, scale }) => [localPosition, rotation, scale])];
}

try {
  for (const layout of layouts) {
    const { width, height } = layout;
    const page = await browser.newPage({ viewport: { width, height }, ...layout });
    const issues = [];
    page.on("pageerror", (error) => issues.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") issues.push(message.text());
    });
    const folder = `${root}/${width}x${height}`;
    await mkdir(folder, { recursive: true });
    await page.goto(url);
    await page.locator('[data-mode="live"] canvas').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const forward = [];
    for (const percent of stops) {
      forward.push(await sample(page, percent));
      await page.screenshot({ path: `${folder}/${String(percent).padStart(3, "0")}.png`, scale: "device" });
    }
    assert(forward.every((frame) => frame.parts?.length === 6), "Use the diagnostic build.");
    const reverse = [];
    for (const percent of [...stops].reverse()) reverse.push(await sample(page, percent));
    assert.deepEqual(forward.map(pose), [...reverse].reverse().map(pose));
    assert(forward.every((frame) => frame.root.id === forward[0].root.id));
    let maxProjectedExtent = 0;
    if (label === "after") {
      for (let percent = 0; percent <= 100; percent += 5) {
        const frame = await sample(page, percent);
        const extent = Math.max(...frame.parts.flatMap(({ projected }) => Object.values(projected).map(Math.abs)));
        assert(extent < 1.01, `Part outside frame at ${width} × ${height} / ${percent}%: ${extent}`);
        maxProjectedExtent = Math.max(maxProjectedExtent, extent);
      }
    }

    await sample(page, 0);
    const sweep = await page.evaluate(async () => {
      const canvas = document.querySelector(".core-surface canvas");
      const travel = document.documentElement.scrollHeight - innerHeight;
      const tasks = [];
      const observer = new PerformanceObserver((list) => tasks.push(...list.getEntries().map((entry) => entry.duration)));
      observer.observe({ type: "longtask" });
      const frames = [];
      for (let step = 0; step <= 240; step++) {
        const target = step <= 120 ? step / 120 : (240 - step) / 120;
        const start = performance.now();
        scrollTo(0, Math.round(travel * target));
        const timestamp = await new Promise((resolve) => requestAnimationFrame(resolve));
        frames.push({ target, painted: Number(canvas.dataset.progress), timestamp, delayMs: performance.now() - start });
      }
      await new Promise((resolve) => setTimeout(resolve, 60));
      observer.disconnect();
      return { frames, longTasksMs: tasks };
    });
    const frameIntervals = sweep.frames.slice(1).map((frame, index) => frame.timestamp - sweep.frames[index].timestamp);
    const sorted = [...frameIntervals].sort((a, b) => a - b);
    const percentile = (fraction) => sorted[Math.ceil(sorted.length * fraction) - 1];
    const summary = {
      medianMs: percentile(.5), p95Ms: percentile(.95), maxMs: sorted.at(-1),
      over25Ms: frameIntervals.filter((value) => value > 25).length,
      maxProgressLag: Math.max(...sweep.frames.map(({ target, painted }) => Math.abs(target - painted))),
      longTasks: sweep.longTasksMs.length,
    };
    assert.equal(sweep.frames.at(-1).target, 0);
    await sample(page, 0);
    assert.deepEqual(issues, []);
    report.viewports.push({ width, height, dpr: layout.deviceScaleFactor, forward, reverse, sweep, summary, maxProjectedExtent, issues });
    console.log(`${width}x${height} ${forward[0].buffer.join("x")} ${JSON.stringify(summary)}`);
    await page.close();
  }

  await writeFile(`${root}/report.json`, JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
