import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { aboutStops, chapters, credentialStops, credentialWindow, finaleSettled, finaleStart, finaleStop, labStops, projectInterval, projectSlugs, projectStops, requestStops, storyDuration } from "../content/storyboard.ts";

const base = process.env.STORYBOARD_URL ?? "http://localhost:3000";
const directory = "qa-artifacts/motion";
const disassembly = chapters[1].time * 100;
const selectedWork = chapters[3].time * 100;
const galleryCutaway = 2.86 / storyDuration * 100;
const milestones = [0, .19, .39, chapters[1].time * storyDuration, .97, projectStops[0].at, 2.86]
  .map((time) => time / storyDuration * 100);
const viewports = [[1440, 900], [768, 900], [390, 844], [844, 390]];
const certificates = [
  ["CS50x", "cs50x", "https://cs50.harvard.edu/certificates/f5aa59ca-26eb-4289-af0e-ccf00f4feb78"],
  ["CS50 AI", "cs50ai", "https://cs50.harvard.edu/certificates/fd45fc07-954c-46de-bcbe-1e4597d3426c"],
];
const browser = await chromium.launch({
  channel: process.env.STORYBOARD_BROWSER_CHANNEL || undefined,
  args: process.env.STORYBOARD_SOFTWARE === "1" ? ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] : [],
});
const report = { browser: browser.version(), viewports: [] };

async function painted(page, percent) {
  try {
    await page.waitForFunction((p) => {
      const canvas = document.querySelector(".core-surface canvas");
      return canvas?.dataset.settled === "true" && Math.abs(Number(canvas.dataset.progress) - p / 100) < .001;
    },
    percent, { timeout: 10000 });
    await page.locator(".core-surface canvas").evaluate((canvas) =>
      Promise.all(canvas.getAnimations().map((animation) => animation.finished.catch(() => {}))));
    await page.locator(".chapters").evaluate((chapters) =>
      Promise.all(chapters.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {}))));
  } catch (error) {
    const state = await page.evaluate(() => {
      let sample;
      document.querySelector(".storyboard")?.dispatchEvent(new CustomEvent("smt:inspect", { detail: (value) => { sample = value; } }));
      return {
        scrollY, hash: location.hash, progress: document.querySelector(".core-surface canvas")?.dataset.progress,
        trigger: sample?.trigger, scrollTriggerProgress: sample?.scrollTriggerProgress,
      };
    });
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
  await page.waitForFunction(() => document.querySelector(".core-surface canvas")?.dataset.settled === "true");
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
    sample.project.index, sample.engineering, sample.closing, sample.archive.matOpacity, sample.archive.pages.map(({ x, opacity }) => [x, opacity]),
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
  const start = await page.evaluate(() => scrollY);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 195, y: 724 }] });
  for (const y of [690, 650, 605, 555, 510]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 195, y }] });
    await page.waitForTimeout(30);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForFunction((start) => scrollY > start + 40 &&
    Number(document.querySelector(".core-surface canvas")?.dataset.progress) > .003, start);
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
      await page.screenshot({ path: `${folder}/${percent.toFixed(2).padStart(6, "0")}.png` });
    }

    const [arrival, , , exploded, , display, exit] = samples;
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
    assert.equal(exit.displayOpacity, 0);

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

    await go(page, milestones[4]);
    await page.reload();
    await painted(page, milestones[4]);
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

    const projectLink = page.getByRole("navigation", { name: "Storyboard chapters" }).getByRole("link", { name: "Selected Work" });
    if (width === 390) await projectLink.tap();
    else {
      await projectLink.focus();
      await page.keyboard.press("Enter");
    }
    await painted(page, selectedWork);
    await page.waitForFunction(() => document.activeElement?.id === "transformation-title");
    await page.waitForURL("**/#transformation");

    const beforeResize = await inspect(page);
    await page.setViewportSize({ width: width === 1440 ? 1100 : width + 25, height });
    await page.waitForFunction((oldPixels) => {
      const c = document.querySelector(".core-surface canvas");
      return c && c.width * c.height !== oldPixels;
    }, beforeResize.canvasPixels);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await painted(page, selectedWork);
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

  const credentialCaptures = "qa-artifacts/milestone-03";
  report.credentials = [];
  report.pdfDownloads = [];
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width === 390, isMobile: width === 390 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const folder = `${credentialCaptures}/${width}x${height}`;
    await mkdir(folder, { recursive: true });
    await page.goto(base);
    await page.locator('[data-mode="live"] canvas').waitFor();
    const checkpoint = await inspect(page);
    const samples = [];
    for (const stage of [0, 25, 50, 75, 100]) {
      const percent = (credentialWindow.start + (credentialWindow.end - credentialWindow.start) * stage / 100) / storyDuration * 100;
      await go(page, percent);
      if (stage === 25 || stage === 75) {
        await page.waitForFunction((index) => {
          let frame;
          document.querySelector(".storyboard").dispatchEvent(new CustomEvent("smt:inspect", { detail: (value) => { frame = value; } }));
          return frame?.archive.pages[index].visible;
        }, stage === 25 ? 0 : 1);
      }
      const sample = await inspect(page);
      assert.equal(sample.root.id, checkpoint.root.id);
      for (const paper of sample.archive.pages) assert(Math.abs(paper.aspect - 792 / 612) < 1e-6);
      samples.push({ stage, percent, ...sample });
      await page.screenshot({ path: `${folder}/${String(stage).padStart(3, "0")}.png` });
    }
    assert(samples[1].archive.pages[0].opacity > .95);
    assert(samples[2].archive.pages[0].x < -.05);
    assert(samples[3].archive.pages[1].opacity > .99);
    assert(samples[4].archive.matOpacity < .01);
    await go(page, selectedWork);
    assert.equal((await inspect(page)).displayOpacity, 1);
    await page.screenshot({ path: `${folder}/selected-work.png` });
    for (const sample of [...samples].reverse()) {
      await go(page, sample.percent);
      assert.deepEqual(motion(await inspect(page)), motion(sample));
    }

    const archiveNav = page.getByRole("navigation", { name: "Storyboard chapters" }).getByRole("link", { name: "Credentials" });
    await archiveNav.focus();
    await page.keyboard.press("Enter");
    await painted(page, credentialStops[0].time * 100);
    await page.waitForFunction(() => document.activeElement?.id === "credentials-title");
    for (const [index, [code, file, verify]] of certificates.entries()) {
      const selector = page.getByRole("navigation", { name: "Choose a certificate" }).getByRole("link", { name: code, exact: true });
      if (width === 390) await selector.tap();
      else {
        await selector.focus();
        await page.keyboard.press("Enter");
      }
      await painted(page, credentialStops[index].time * 100);
      await page.waitForFunction((id) => document.activeElement?.id === `${id}-title`, credentialStops[index].id);
      const pdfLink = page.getByRole("link", { name: `View full certificate — ${code}` });
      const verifyLink = page.getByRole("link", { name: `Verify credential — ${code}` });
      const pdfPath = `/credentials/${file}.pdf`;
      const viewerPath = `/certificates/${credentialStops[index].id}`;
      assert.equal(await pdfLink.getAttribute("href"), viewerPath);
      assert.equal(await verifyLink.getAttribute("href"), verify);
      assert.equal(await verifyLink.getAttribute("target"), "_blank");
      for (const link of [pdfLink, verifyLink]) {
        const box = await link.boundingBox();
        assert(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= width && box.y + box.height <= height);
      }
      if (width === 768) continue;
      const popupEvent = page.context().waitForEvent("page");
      if (width === 390) await pdfLink.tap();
      else await pdfLink.click();
      const viewer = await popupEvent;
      await viewer.waitForURL(`**${viewerPath}`);
      const preview = viewer.getByRole("img", { name: new RegExp(`^${code} certificate`) });
      await preview.evaluate((image) => image.decode());
      assert.equal(await preview.evaluate((image) => image.naturalWidth), 2200);
      const downloadLink = viewer.getByRole("link", { name: "Download original PDF" });
      assert.equal(await downloadLink.getAttribute("href"), pdfPath);
      await viewer.screenshot({ path: `${folder}/${file}-viewer.png` });
      if (width === 1440) {
        const original = await page.request.get(new URL(pdfPath, base).href);
        assert.equal(original.status(), 200);
        assert.match(original.headers()["content-type"], /application\/pdf/);
        assert.equal(original.headers()["content-disposition"], `attachment; filename="${file}.pdf"`);
        const source = await readFile(`public${pdfPath}`);
        assert((await original.body()).equals(source));
        const downloadEvent = viewer.waitForEvent("download");
        await downloadLink.click();
        const download = await downloadEvent;
        assert.equal(download.suggestedFilename(), `${file}.pdf`);
        const failure = await download.failure();
        if (failure === null) assert((await readFile(await download.path())).equals(source));
        else assert.equal(failure, "canceled");
        report.pdfDownloads.push({ file, httpBytesMatch: true, browserSave: failure ?? "complete" });
      }
      await viewer.close();
      if (width !== 1440) continue;
      await page.context().route(verify, (route) => route.fulfill({ body: "Verification destination checked." }));
      const verificationEvent = page.context().waitForEvent("page");
      await verifyLink.click();
      const verification = await verificationEvent;
      await verification.waitForURL(verify);
      await verification.close();
    }
    assert.deepEqual(errors, []);
    report.credentials.push({ width, height, samples });
    await page.close();
  }

  report.gallery = [];
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [844, 390]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width === 390, isMobile: width === 390 });
    const folder = `qa-artifacts/milestone-04/${width}x${height}`;
    const issues = [];
    page.on("pageerror", (error) => issues.push(error.message));
    await mkdir(folder, { recursive: true });
    await page.goto(base);
    await page.locator('[data-mode="live"] canvas').waitFor();
    const checkpoint = await inspect(page);
    await go(page, (credentialWindow.end - .02) / storyDuration * 100);
    await page.screenshot({ path: `${folder}/archive-exit.png` });
    const samples = [];
    for (const [index, { id, time, at }] of projectStops.entries()) {
      const slug = projectSlugs[index];
      await go(page, time * 100);
      if (slug === "nudge") await page.waitForFunction(() => document.querySelector('a[data-project-link][aria-current]')?.hash === "#project-nudge" &&
        performance.getEntriesByName(new URL("/work/nudge-notification.jpg", location.href).href).length > 0);
      const sample = await inspect(page);
      assert.equal(sample.project.index, index);
      assert.equal(sample.root.id, checkpoint.root.id);
      assert.deepEqual(sample.parts.map((part) => part.id), checkpoint.parts.map((part) => part.id));
      assert.equal(sample.displayOpacity, 1);
      assert.equal(sample.archive.matOpacity, 0);
      if (slug === "nudge") {
        await page.waitForFunction(() => {
          let snapshot;
          document.querySelector(".storyboard").dispatchEvent(new CustomEvent("smt:inspect", { detail: (value) => { snapshot = value; } }));
          return snapshot.project.imageReady;
        });
      }
      const article = page.locator(`#${id}`);
      assert.equal(await article.locator(".project-count").innerText(), `0${index + 1} / 05`);
      await page.screenshot({ path: `${folder}/${slug}.png` });
      const caseLink = article.getByRole("link", { name: "Read case study" });
      assert.equal(await caseLink.getAttribute("href"), `/work/${slug}`);
      assert(await caseLink.evaluate((link) => {
        const box = link.getBoundingClientRect();
        return link.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
      }), `Case link clipped at ${width} × ${height}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      if (index > 0) {
        assert(distance(samples[index - 1].camera, sample.camera) > .65);
        assert(distance(samples[index - 1].parts[1].localPosition, sample.parts[1].localPosition) > .025);
      }
      samples.push({ slug, ...await inspect(page) });
      if (index > 0) {
        await go(page, (at - projectInterval / 2) / storyDuration * 100);
        assert((await inspect(page)).displayOpacity < .02);
        if (index === 1) await page.screenshot({ path: `${folder}/gallery-handoff.png` });
      }
    }
    await go(page, galleryCutaway);
    const exit = await inspect(page);
    assert.equal(exit.displayOpacity, 0);
    assert(distance(exit.parts[1].worldPosition, samples[4].parts[1].worldPosition) > .2);
    await page.screenshot({ path: `${folder}/gallery-exit.png` });
    for (let index = projectStops.length - 1; index >= 0; index--) {
      await go(page, projectStops[index].time * 100);
      assert.deepEqual(motion(await inspect(page)), motion(samples[index]));
    }
    const selectors = page.getByRole("navigation", { name: "Choose a project" });
    const folio = selectors.getByRole("link", { name: "Folio" });
    if (width === 390) await folio.tap();
    else {
      await folio.focus();
      await page.keyboard.press("Enter");
    }
    await painted(page, projectStops[3].time * 100);
    await page.waitForFunction(() => document.activeElement?.id === "project-folio-title");
    await page.getByRole("link", { name: "Previous project" }).click();
    await painted(page, projectStops[2].time * 100);
    await page.getByRole("link", { name: "Next project" }).click();
    await painted(page, projectStops[3].time * 100);
    const allWork = page.getByRole("link", { name: "View all work" });
    if (width === 390) await allWork.tap();
    else await allWork.click();
    await page.waitForURL("**/work");
    for (const slug of projectSlugs) {
      assert(await page.locator(`a[href="/work/${slug}"]`).isVisible());
      assert.equal((await page.request.get(`${base}/work/${slug}`)).status(), 200);
    }
    await page.getByRole("link", { name: /Folio/ }).click();
    await page.waitForURL("**/work/folio");
    assert(await page.getByRole("heading", { name: "Folio" }).isVisible());
    await page.getByRole("link", { name: /back to/i }).click();
    await painted(page, projectStops[3].time * 100);
    assert.deepEqual(issues, []);
    report.gallery.push({ width, height, samples, exit });
    console.log(`${width} × ${height}: five exhibits, reverse poses, direct controls, and work routes verified`);
    await page.close();
  }

  report.engineering = [];
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [844, 390], [320, 568]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width <= 390, isMobile: width <= 390 });
    const folder = `qa-artifacts/milestone-06/${width}x${height}`;
    const issues = [];
    page.on("pageerror", (error) => issues.push(error.message));
    await mkdir(folder, { recursive: true });
    await page.goto(base);
    const canvas = page.locator('[data-mode="live"] canvas');
    await canvas.waitFor();
    const handle = await canvas.elementHandle();
    const checkpoint = await inspect(page);
    const samples = [];
    const cues = [...requestStops, ...labStops];
    for (const [index, { id, time }] of cues.entries()) {
      await go(page, time * 100);
      const sample = await inspect(page);
      samples.push({ id, ...sample });
      assert.equal(sample.root.id, checkpoint.root.id);
      assert.deepEqual(sample.parts.map(({ id: part }) => part), checkpoint.parts.map(({ id: part }) => part));
      const trace = index < requestStops.length;
      assert.equal(sample.engineering.trace, trace ? index : -1);
      assert.equal(sample.engineering.lab, trace ? -1 : index - requestStops.length);
      assert.equal(Boolean(sample.engineering.signal), trace);
      assert.equal(Boolean(sample.engineering.cartridges), !trace);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert(limit(sample) < 1.01, `Layer outside frame at ${width}px / ${id}`);
      const dossier = page.locator(`#${id}[data-active]`);
      const source = dossier.getByRole("link", { name: /^Read / });
      await page.screenshot({ path: `${folder}/${id}.png` });
      assert.match(await source.getAttribute("href"), /^https:\/\/github\.com\/sajidmehmoodtariq-dev\//);
      assert(await source.evaluate((link) => {
        const box = link.getBoundingClientRect();
        return link.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
      }), `Source link clipped at ${width} × ${height} / ${id}`);
    }
    assert.equal(new Set(samples.slice(0, requestStops.length - 1).map(({ engineering }) => JSON.stringify(engineering.signal))).size, requestStops.length - 1);
    assert(distance(samples[0].engineering.signal, samples[requestStops.length - 1].engineering.signal) < .001);
    assert(samples.slice(-labStops.length).every(({ engineering }, index) => engineering.cartridges[index][1] > .1));
    for (let i = cues.length - 1; i >= 0; i--) {
      await go(page, cues[i].time * 100);
      assert.deepEqual(motion(await inspect(page)), motion(samples[i]));
    }
    assert(await page.evaluate((initial) => initial === document.querySelector(".core-surface canvas"), handle));
    const request = page.getByRole("navigation", { name: "Request stages" }).getByRole("link", { name: "Auth" });
    if (width <= 390) await request.tap();
    else {
      await request.focus();
      await page.keyboard.press("Enter");
    }
    await painted(page, requestStops[3].time * 100);
    await page.waitForFunction(() => document.activeElement?.id === "trace-auth-title");
    await page.getByRole("link", { name: /Next Engineering Lab/ }).click();
    await painted(page, labStops[0].time * 100);
    const experiment = page.getByRole("navigation", { name: "Lab experiments" }).getByRole("link", { name: "Micro-VLM" });
    if (width <= 390) await experiment.tap();
    else await experiment.click();
    await painted(page, labStops[2].time * 100);
    await page.waitForFunction(() => document.activeElement?.id === "lab-micro-vlm-title");
    await page.getByRole("link", { name: "Read without motion" }).click();
    await page.waitForURL("**/?view=reading#engineering-lab");
    await page.locator('[data-mode="reading"]').waitFor();
    assert.equal(await page.locator("canvas").count(), 0);
    assert.equal(await page.locator("#engineering-lab article:visible").count(), labStops.length);
    await page.locator("#engineering-lab").getByRole("link", { name: "Return to animation" }).click();
    await painted(page, labStops[0].time * 100);
    assert.deepEqual(issues, []);
    report.engineering.push({ width, height, samples });
    console.log(`${width} × ${height}: request trace, lab modules, reverse poses, and reading mode verified`);
    await page.close();
  }

  report.closing = [];
  const linkedin = "https://www.linkedin.com/in/sajid-mehmood-tariq/";
  const github = "https://github.com/sajidmehmoodtariq-dev";
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [844, 390], [320, 568]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width <= 390, isMobile: width <= 390,
      reducedMotion: width === 320 ? "reduce" : "no-preference" });
    const folder = `qa-artifacts/milestone-07/${width}x${height}`;
    const issues = [];
    page.on("pageerror", (error) => issues.push(error.message));
    await mkdir(folder, { recursive: true });
    await page.goto(base);
    const canvas = page.locator('[data-mode="live"] canvas');
    await canvas.waitFor();
    const handle = await canvas.elementHandle();
    const arrival = await inspect(page);
    const samples = [];
    const cues = [
      ...aboutStops.map(({ id, at }) => [id, at]),
      ["camera-pullback", 5.62], ["cover-clearance", finaleStart + .25], ["cover-return", finaleStart + .35],
      ["finale", finaleStop], ["hold", storyDuration],
    ];
    for (const [id, at] of cues) {
      const percent = at / storyDuration * 100;
      await go(page, percent);
      const sample = await inspect(page);
      samples.push({ id, percent, ...sample });
      assert.equal(sample.root.id, arrival.root.id);
      assert.deepEqual(sample.parts.map(({ id: part }) => part), arrival.parts.map(({ id: part }) => part));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert(limit(sample) < 1.01, `Finale layer outside frame at ${width}px / ${id}: ${limit(sample)}`);
      await page.screenshot({ path: `${folder}/${id}.png` });
    }
    const [profile, journey, skills, pullback, clearance, returnPose, finale, hold] = samples;
    assert.deepEqual([profile.closing.about, journey.closing.about, skills.closing.about], [0, 1, 2]);
    assert(clearance.parts[0].localPosition[2] < -3.4 && clearance.parts[0].localPosition[1] > .73);
    assert(returnPose.parts[0].localPosition[2] > clearance.parts[0].localPosition[2]);
    if (width > 320) assert(distance(pullback.camera, pullback.target) > distance(skills.camera, skills.target));
    assert.equal(finale.closing.reassembled, true);
    assert.deepEqual(finale.camera, arrival.camera);
    assert.deepEqual(finale.target, arrival.target);
    assert.deepEqual(finale.root, arrival.root);
    assert.deepEqual(finale.closing.light, arrival.closing.light);
    assert.deepEqual(finale.latchOffsets, arrival.latchOffsets);
    assert.deepEqual(finale.parts.map(({ localPosition, rotation, scale }) => [localPosition, rotation, scale]),
      arrival.parts.map(({ localPosition, rotation, scale }) => [localPosition, rotation, scale]));
    assert.deepEqual(motion(hold), motion(finale));
    assert.equal(hold.sceneRenders, finale.sceneRenders);
    for (const sample of [...samples].reverse()) {
      await go(page, sample.percent);
      assert.deepEqual(motion(await inspect(page)), motion(sample));
    }
    assert(await page.evaluate((initial) => initial === document.querySelector(".core-surface canvas"), handle));
    const about = page.getByRole("navigation", { name: "About sections" });
    const journeyLink = about.getByRole("link", { name: "Journey" });
    if (width <= 390) await journeyLink.tap();
    else { await journeyLink.focus(); await page.keyboard.press("Enter"); }
    await painted(page, aboutStops[1].time * 100);
    await page.waitForFunction(() => document.activeElement?.id === "about-journey-title");
    assert.deepEqual(await page.locator("#about-journey time").allTextContents(), ["2025", "2026"]);
    const aboutContact = page.locator("#about .engineering-actions").getByRole("link", { name: "Contact" });
    assert(await aboutContact.evaluate((link) => {
      const box = link.getBoundingClientRect();
      return link.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
    }), `About actions clipped at ${width} × ${height}`);
    await about.getByRole("link", { name: "Skills" }).click();
    await painted(page, aboutStops[2].time * 100);
    assert.equal(await page.locator("#about-skills li a").count(), 6);
    for (const href of new Set(await page.locator('#about-skills a[href^="/work/"]').evaluateAll(links => links.map(link => link.getAttribute("href"))))) {
      assert.equal((await page.request.get(base + href)).status(), 200);
    }
    await go(page, (finaleSettled - .055) / storyDuration * 100);
    assert.equal(await page.getByRole("link", { name: "Message me on LinkedIn" }).count(), 0);
    const contact = page.getByRole("navigation", { name: "Storyboard chapters" }).getByRole("link", { name: "Contact" });
    if (width <= 390) await contact.tap();
    else { await contact.focus(); await page.keyboard.press("Enter"); }
    await painted(page, finaleStop / storyDuration * 100);
    await page.waitForFunction(() => document.activeElement?.id === "finale-title");
    assert.equal(await page.getByRole("link", { name: "Message me on LinkedIn" }).getAttribute("href"), linkedin);
    assert.equal(await page.getByRole("link", { name: "LinkedIn", exact: true }).getAttribute("href"), linkedin);
    assert.equal(await page.getByRole("link", { name: "GitHub", exact: true }).getAttribute("href"), github);
    await page.getByRole("link", { name: "Read without motion" }).click();
    await page.waitForURL("**/?view=reading#finale");
    await page.locator('[data-mode="reading"]').waitFor();
    assert.equal(await page.locator("canvas").count(), 0);
    assert.equal(await page.locator("#about article:visible").count(), 3);
    await page.locator("#finale").getByRole("link", { name: "Return to animation" }).click();
    await painted(page, finaleStop / storyDuration * 100);
    const back = page.getByRole("link", { name: "Back to beginning" });
    if (width <= 390) await back.tap();
    else { await back.focus(); await page.keyboard.press("Enter"); }
    await painted(page, 0);
    await page.waitForFunction(() => document.activeElement?.id === "arrival-title");
    if (width === 844 || width === 320) {
      for (let repeat = 0; repeat < 3; repeat++) {
        await contact.click();
        await painted(page, finaleStop / storyDuration * 100);
        if (width === 320) await back.tap();
        else { await back.focus(); await page.keyboard.press("Enter"); }
        await painted(page, 0);
        const beginning = await inspect(page);
        assert.equal(beginning.scrollY, 0);
        assert.equal(beginning.trigger.start, 0);
      }
    }
    assert.equal(await page.getByRole("link", { name: "Engineering Notes" }).count(), 0);
    assert.equal((await page.request.get(base + "/notes")).status(), 404);
    assert.equal((await page.request.get(base + "/notes/unpublished")).status(), 404);
    assert.deepEqual(issues, []);
    report.closing.push({ width, height, samples });
    console.log(`${width} × ${height}: About, reassembly, contact, reading view, and return verified`);
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
  await go(reduced, disassembly);
  const open = await inspect(reduced);
  assert(distance(open.parts[0].worldPosition, initial.parts[0].worldPosition) > 1);
  await reduced.screenshot({ path: `${directory}/automatic-motion.png` });
  await reduced.emulateMedia({ reducedMotion: "no-preference" });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  assert.equal((await inspect(reduced)).root.id, open.root.id);
  await reduced.reload();
  await painted(reduced, disassembly);
  assert.deepEqual(motion(await inspect(reduced)), motion(open));
  await go(reduced, 100);
  assert.equal((await inspect(reduced)).displayOpacity, 0);
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
  await painted(direct, disassembly);
  await direct.goto(`${base}/#cs50-ai`);
  await painted(direct, credentialStops[1].time * 100);
  assert(await direct.getByRole("link", { name: "View full certificate — CS50 AI" }).isVisible());
  await direct.goto(`${base}/#project-nudge`);
  await painted(direct, projectStops[4].time * 100);
  assert.equal((await inspect(direct)).project.index, 4);
  await direct.close();

  const noScript = await browser.newPage({ javaScriptEnabled: false });
  await noScript.goto(base);
  assert.equal(await noScript.locator("canvas").count(), 0);
  assert(await noScript.getByRole("heading", { name: "Things I've brought to life." }).isVisible());
  assert.equal(await noScript.getByRole("link", { name: "Read case study" }).count(), 5);
  assert.equal(await noScript.locator(".engineering-dossier:visible").count(), requestStops.length + labStops.length + aboutStops.length);
  for (const [code] of certificates) assert(await noScript.getByRole("link", { name: `View full certificate — ${code}` }).isVisible());
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

