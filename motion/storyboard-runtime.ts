import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ACESFilmicToneMapping, AmbientLight, Box3, CanvasTexture, DirectionalLight, Mesh, MeshBasicMaterial,
  PerspectiveCamera, PlaneGeometry, PMREMGenerator, Scene, Vector3, WebGLRenderer, type Material, type Texture,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createCore } from "../scene/core";
import { createChoreography } from "./choreography";

type Chapter = { id: string; time: number };

function createShadow() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(51,42,32,.48)");
  gradient.addColorStop(.26, "rgba(53,45,36,.34)");
  gradient.addColorStop(.52, "rgba(68,57,47,.15)");
  gradient.addColorStop(.79, "rgba(75,66,55,.04)");
  gradient.addColorStop(1, "rgba(75,66,55,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const shadow = new Mesh(new PlaneGeometry(7.2, 5.2), new MeshBasicMaterial({
    map: new CanvasTexture(canvas), transparent: true, depthWrite: false, toneMapped: false,
  }));
  shadow.rotation.x = -Math.PI / 2;
  return shadow;
}

function disposeScene(scene: Scene) {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const entries: Material[] = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of entries) {
      materials.add(material);
      if ("map" in material && material.map) textures.add(material.map as Texture);
    }
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
}

const compactQuery = "(max-width: 780px) and (orientation: portrait)";
const diagnosticsEnabled = process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_STORYBOARD_DIAGNOSTICS === "1";

function smoothMaximum(a: number, b: number, width: number) {
  const overlap = Math.max(0, width - Math.abs(a - b)) / width;
  return Math.max(a, b) + overlap * overlap * width * .25;
}

export function mountStoryboard(element: HTMLElement, mount: HTMLElement, chapters: Chapter[]) {
  gsap.registerPlugin(ScrollTrigger);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { alpha: true, antialias: true });
  if (!context) throw new Error("WebGL 2 context creation failed.");
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.01;

  const scene = new Scene();
  const camera = new PerspectiveCamera(31, 1, .1, 100);
  const target = new Vector3();

  const generator = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = generator.fromScene(room, .08, .1, 100, { size: 128 });
  scene.environment = environment.texture;
  scene.environmentIntensity = .71;
  room.dispose();
  generator.dispose();

  const key = new DirectionalLight("#fff4e6", 2.05);
  key.position.set(-5, 6, 2);
  const edge = new DirectionalLight("#e3edff", 1.08);
  edge.position.set(4, 3, -6);
  scene.add(key, edge, new AmbientLight("#fffaf0", .25));

  const core = createCore(Math.min(renderer.capabilities.getMaxAnisotropy(), 12));
  const shadow = createShadow();
  scene.add(core.root, shadow);
  const { timeline, view, copy, parts, applyPose } = createChoreography(core);
  const bounds = diagnosticsEnabled ? parts.map(({ group }) => new Box3().setFromObject(group, true)) : [];
  const coverWorld = new Vector3();
  const nav = Array.from(element.querySelectorAll<HTMLAnchorElement>("[data-nav]"));
  const panels = Array.from(element.querySelectorAll<HTMLElement>(".chapter"));
  const previousCopy = copy.map(() => ({ top: NaN, bottom: NaN, y: NaN }));
  const rail = element.querySelector<HTMLElement>(".rail");
  const counter = element.querySelector("[data-counter]");
  const caption = element.querySelector("[data-caption]");
  const captions = ["Assembled", "In disassembly", "Project display"];
  const compactLayout = window.matchMedia(compactQuery);
  const restoreKey = `smt-storyboard:${window.location.pathname}`;
  let chapter = -1;
  let progress = 0;
  let renderedProgress = 0;
  let frame = 0;
  let ready = false;
  let width = 1;
  let height = 1;
  let preferredRatio = 1;
  let ratio = 1;
  let slowFrames = 0;
  let lastFrameTime = 0;
  let submitMs = 0;
  let disposed = false;
  let focusFrame = 0;

  function paintCopy() {
    const next = progress < .255 ? 0 : progress < .755 ? 1 : 2;
    if (chapter !== next) {
      chapter = next;
      element.dataset.chapter = String(chapter);
      if (counter) counter.textContent = String(chapter + 1).padStart(2, "0");
      if (caption) caption.textContent = captions[chapter];
      nav.forEach((link, index) => {
        if (index === chapter) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    panels.forEach((panel, index) => {
      const { top, bottom, y } = copy[index];
      const visible = top + bottom < 99.99;
      panel.toggleAttribute("data-visible", visible);
      const inert = !visible || index !== chapter;
      if (panel.inert !== inert) panel.inert = inert;
      const previous = previousCopy[index];
      if (previous.top !== top) panel.style.setProperty("--wipe-top", `${top}%`);
      if (previous.bottom !== bottom) panel.style.setProperty("--wipe-bottom", `${bottom}%`);
      if (previous.y !== y) panel.style.setProperty("--copy-y", `${y}px`);
      previous.top = top;
      previous.bottom = bottom;
      previous.y = y;
    });
  }

  function paint() {
    timeline.progress(progress, true);
    const compact = compactLayout.matches;
    const short = height < 570;
    applyPose(compact);
    const tilt = Math.sin(core.root.rotation.x);
    core.cover.getWorldPosition(coverWorld);
    const carriedCover = Math.max(0, coverWorld.y - 1.65) * Math.max(0, tilt) * .45;
    const screenX = compact ? .50 : view.screenX;
    const portraitY = view.portraitY + (short ? .055 : 0);
    const screenY = compact ? portraitY : view.screenY;
    const verticalRoom = compact ? (short ? .36 : .43) : (short ? .57 : .65);
    const horizontalRoom = compact ? .88 - view.portraitWidthInset : .55;
    const framing = smoothMaximum(
      view.fitWidth / (horizontalRoom * width / height),
      view.fitHeight * (compact ? .85 : 1) / verticalRoom,
      .25,
    );
    const radius = smoothMaximum(
      view.radius * (compact ? .94 : 1), framing / (2 * Math.tan(camera.fov * Math.PI / 360)), .45,
    );
    const orbitXZ = Math.cos(view.elevation) * radius;
    target.set(view.targetX, view.targetY + carriedCover, view.targetZ);
    camera.position.set(
      target.x + Math.sin(view.azimuth) * orbitXZ,
      target.y + Math.sin(view.elevation) * radius,
      target.z + Math.cos(view.azimuth) * orbitXZ,
    );
    const offsetX = (.5 - screenX) * width;
    const offsetY = (.5 - screenY) * height;
    const projection = camera.view;
    if (projection?.width !== width || projection.height !== height ||
      projection.offsetX !== offsetX || projection.offsetY !== offsetY) {
      camera.setViewOffset(width, height, offsetX, offsetY, width, height);
    }
    camera.lookAt(target);
    const spread = Math.max(0, -.50 - core.base.position.y);
    shadow.position.y = Math.min(core.base.position.y * core.root.scale.y - .20, -.66) - tilt * 1.10;
    shadow.scale.set(1 + spread * .10, 1 + spread * .15 - tilt * .22, 1);
    shadow.material.opacity = .94 - spread * .20 - tilt * .15;
    core.screenMesh.visible = core.screen.opacity > 0;
    paintCopy();
    const started = diagnosticsEnabled ? performance.now() : 0;
    renderer.render(scene, camera);
    if (diagnosticsEnabled) submitMs = performance.now() - started;
    renderedProgress = progress;
    rail?.style.setProperty("--progress", String(progress));
    canvas.dataset.progress = progress.toFixed(4);
  }

  function queuePaint() {
    if (frame || disposed) return;
    frame = requestAnimationFrame((time) => {
      frame = 0;
      const interval = time - lastFrameTime;
      const advance = Math.abs(progress - renderedProgress);
      slowFrames = interval > 24 && interval < 85 && advance > 0 && advance < .06 ? slowFrames + 1 : 0;
      if (slowFrames === 8 && ratio > 1.01) {
        ratio = Math.max(1, ratio * .84);
        renderer.setDrawingBufferSize(width, height, ratio);
        slowFrames = 0;
      }
      lastFrameTime = time;
      paint();
    });
  }

  function sync(value: number) {
    if (value === progress) return;
    progress = value;
    if (ready) queuePaint();
  }

  function resize() {
    const size = mount.getBoundingClientRect();
    if (!size.width || !size.height) return;
    const compact = compactLayout.matches;
    const pixelBudget = compact ? 1_400_000 : 3_600_000;
    const nextRatio = Math.min(window.devicePixelRatio, compact ? 1.75 : 1.55, Math.sqrt(pixelBudget / (size.width * size.height)));
    if (width === size.width && height === size.height && nextRatio === preferredRatio) return;
    width = size.width;
    height = size.height;
    preferredRatio = ratio = nextRatio;
    slowFrames = 0;
    renderer.setDrawingBufferSize(width, height, ratio);
    if (ready) queuePaint();
  }

  function inspect(event: Event) {
    const reply = (event as CustomEvent<(sample: unknown) => void>).detail;
    const point = new Vector3();
    const transforms = parts.map(({ group }, index) => {
      const { min, max } = bounds[index];
      const projected = { left: 1, right: -1, top: -1, bottom: 1 };
      for (const x of [min.x, max.x]) {
        for (const y of [min.y, max.y]) {
          for (const z of [min.z, max.z]) {
            point.set(x, y, z).applyMatrix4(group.matrixWorld).project(camera);
            projected.left = Math.min(projected.left, point.x);
            projected.right = Math.max(projected.right, point.x);
            projected.top = Math.max(projected.top, point.y);
            projected.bottom = Math.min(projected.bottom, point.y);
          }
        }
      }
      return {
        name: group.name, id: group.uuid, localPosition: group.position.toArray(),
        worldPosition: group.getWorldPosition(point).toArray(), rotation: group.rotation.toArray().slice(0, 3),
        scale: group.scale.toArray(), projected,
      };
    });
    reply({
      scrollY: window.scrollY, scrollTriggerProgress: trigger.progress, renderedProgress: Number(canvas.dataset.progress),
      timelineProgress: timeline.progress(), camera: camera.position.toArray(), target: target.toArray(),
      root: { id: core.root.uuid, rotation: core.root.rotation.toArray().slice(0, 3), scale: core.root.scale.toArray() },
      parts: transforms, displayOpacity: core.screen.opacity,
      drawCalls: renderer.info.render.calls, canvasPixels: canvas.width * canvas.height,
      triangles: renderer.info.render.triangles, submitMs,
      trigger: { start: trigger.start, end: trigger.end }, chapter,
    });
  }

  mount.append(canvas);
  resize();
  const trigger = ScrollTrigger.create({
    trigger: element,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => sync(self.progress),
    onRefresh: (self) => {
      resize();
      sync(self.progress);
    },
  });

  function seek(fraction: number) {
    const position = Math.round(trigger.start + (trigger.end - trigger.start) * fraction);
    window.scrollTo(0, position);
    ScrollTrigger.update();
  }

  function onHash() {
    const entry = chapters.find(({ id }) => id === window.location.hash.slice(1));
    if (entry) seek(entry.time);
  }

  function rememberPosition() {
    try {
      // Chrome can clamp scrollY during unload before the displayed pose has changed.
      sessionStorage.setItem(restoreKey, String(renderedProgress));
    } catch {
      // Native scroll restoration remains available when storage is blocked.
    }
  }

  function restorePosition() {
    try {
      const saved = sessionStorage.getItem(restoreKey);
      if (saved !== null && Number.isFinite(Number(saved))) seek(gsap.utils.clamp(0, 1, Number(saved)));
    } catch {
      // The trigger already reflects the browser's restored scroll position.
    }
  }

  function onClick(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
    const entry = chapters.find(({ id }) => id === link?.hash.slice(1));
    if (!link || !entry) return;
    event.preventDefault();
    if (window.location.hash !== link.hash) window.history.pushState(null, "", link.hash);
    seek(entry.time);
    cancelAnimationFrame(focusFrame);
    focusFrame = requestAnimationFrame(() => {
      const heading = document.getElementById(entry.id)?.querySelector<HTMLElement>("h1, h2");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    });
  }

  function onContextLost() {
    dispose();
    element.dataset.mode = "unavailable";
  }

  sync(trigger.progress);
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navigation?.type === "reload") restorePosition();
  else if (navigation?.type === "navigate" && window.location.hash) onHash();
  paint();
  element.dataset.mode = "live";
  ready = true;

  const observer = new ResizeObserver(resize);
  observer.observe(mount);
  element.addEventListener("click", onClick);
  if (diagnosticsEnabled) element.addEventListener("smt:inspect", inspect);
  window.addEventListener("hashchange", onHash);
  window.addEventListener("pagehide", rememberPosition);
  canvas.addEventListener("webglcontextlost", onContextLost);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    cancelAnimationFrame(focusFrame);
    observer.disconnect();
    trigger.kill();
    timeline.kill();
    element.removeEventListener("click", onClick);
    element.removeEventListener("smt:inspect", inspect);
    window.removeEventListener("hashchange", onHash);
    window.removeEventListener("pagehide", rememberPosition);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.remove();
    element.dataset.chapter = "0";
    rail?.style.removeProperty("--progress");
    for (const panel of panels) {
      panel.inert = false;
      panel.removeAttribute("data-visible");
      panel.style.removeProperty("--wipe-top");
      panel.style.removeProperty("--wipe-bottom");
      panel.style.removeProperty("--copy-y");
    }
    nav.forEach((link) => link.removeAttribute("aria-current"));
    if (counter) counter.textContent = "01";
    if (caption) caption.textContent = captions[0];
    environment.dispose();
    disposeScene(scene);
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return dispose;
}
