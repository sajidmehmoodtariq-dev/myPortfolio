import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ACESFilmicToneMapping, AmbientLight, Box3, CanvasTexture, DirectionalLight, Mesh, MeshBasicMaterial,
  PerspectiveCamera, PlaneGeometry, PMREMGenerator, Scene, Vector3, WebGLRenderer, type Material, type Texture,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createCore } from "../scene/core";
import { createEngineering } from "../scene/engineering";
import { createTextTransitions } from "./text-transitions";
import { cameraSettledAt } from "./camera";
import { createChoreography } from "./choreography";
import { aboutStart, aboutStops, credentialStops, credentialWindow, finaleSettled, finaleStart, labStart, labStops, projectAt, projectExit, projectStops, requestStops, stopAt, storyDuration, systemStart } from "../content/storyboard";

type Chapter = { id: string; time: number };

function createShadow() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(51,42,32,.53)");
  gradient.addColorStop(.22, "rgba(53,45,36,.38)");
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
      if ("roughnessMap" in material && material.roughnessMap) textures.add(material.roughnessMap as Texture);
    }
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
}

const compactQuery = "(max-width: 780px) and (orientation: portrait)";
const diagnosticsEnabled = process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_STORYBOARD_DIAGNOSTICS === "1";
const sceneSettledProgress = cameraSettledAt / storyDuration;

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
  scene.environmentIntensity = .69;
  room.dispose();
  generator.dispose();

  const key = new DirectionalLight("#fff4e6", 2.18);
  key.position.set(-5, 6, 1.5);
  const edge = new DirectionalLight("#e3edff", 1.08);
  edge.position.set(4, 3, -6);
  scene.add(key, edge, new AmbientLight("#fffaf0", .20));

  const core = createCore(Math.min(renderer.capabilities.getMaxAnisotropy(), 12), () => {
    if (disposed) return;
    sceneDirty = true;
    if (ready) queuePaint();
  });
  const shadow = createShadow();
  scene.add(core.root, shadow);
  const { timeline, view, copy, parts, applyPose, engineering, light } = createChoreography(core);
  const bounds = diagnosticsEnabled ? parts.map(({ group }) => new Box3().setFromObject(group, true)) : [];
  const engineeringScene = createEngineering([core.optic, core.bezel, core.logic, core.chassis, core.base]);
  const support = new Box3().setFromObject(core.base, true);
  const supportCenter = support.getCenter(new Vector3());
  const supportHalf = support.getSize(new Vector3()).multiplyScalar(.5);
  const supportWorld = new Vector3();
  const coverWorld = new Vector3();
  const nav = Array.from(element.querySelectorAll<HTMLAnchorElement>("[data-nav]"));
  const panels = Array.from(element.querySelectorAll<HTMLElement>(".chapter"));
  const rail = element.querySelector<HTMLElement>(".rail");
  const counter = element.querySelector("[data-counter]");
  const caption = element.querySelector("[data-caption]");
  const captions = ["Assembled", "In disassembly", "Document mount", "Project display", "Request trace", "Lab bench", "About", "Aligning the assembly"];
  const stops = [...chapters, ...credentialStops, ...projectStops, ...requestStops, ...labStops, ...aboutStops];
  const credentialPanels = Array.from(element.querySelectorAll<HTMLElement>(".credential-entry"));
  const credentialLinks = Array.from(element.querySelectorAll<HTMLAnchorElement>("[data-credential-link]"));
  const projectPanels = Array.from(element.querySelectorAll<HTMLElement>(".project-entry"));
  const projectLinks = Array.from(element.querySelectorAll<HTMLAnchorElement>("[data-project-link]"));
  const dossiers = [
    { kind: "trace", chapter: 4, stops: requestStops },
    { kind: "lab", chapter: 5, stops: labStops },
    { kind: "about", chapter: 6, stops: aboutStops },
  ].map((entry) => ({
    ...entry,
    active: -2,
    panels: Array.from(element.querySelectorAll<HTMLElement>(`[data-engineering-entry="${entry.kind}"]`)),
    links: Array.from(element.querySelectorAll<HTMLAnchorElement>(`[data-engineering-link="${entry.kind}"]`)),
  }));
  const compactLayout = window.matchMedia(compactQuery);
  const restoreKey = `smt-storyboard:${window.location.pathname}`;
  let chapter = -1;
  let activeCredential = -1;
  let activeProject = -2;
  let exiting = false;
  let reassembled = false;
  let progress = 0;
  let targetProgress = 0;
  let motionStarted = 0;
  const scrollSettlingMs = 650;
  const navigationSettlingMs = 1100;
  let motionDuration = scrollSettlingMs;
  // The owner explicitly chose automatic cinematic motion. The separate reading
  // route is the no-motion alternative; OS preferences must not silently hard-seek.
  const chapterText = createTextTransitions(panels);
  const credentialText = createTextTransitions(credentialPanels);
  const projectText = createTextTransitions(projectPanels);
  const dossierText = dossiers.map(({ panels }) => createTextTransitions(panels));
  let renderedProgress = 0;
  let renderedSceneProgress = -1;
  let sceneDirty = true;
  let sceneRenders = 0;
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
  let pendingHeading: HTMLElement | null = null;
  let seekFrame = 0;

  function paintCopy() {
    const time = progress * storyDuration;
    const next = time < .246 ? 0 : time < credentialWindow.start ? 1 : time < credentialWindow.end ? 2 :
      time < systemStart ? 3 : time < labStart ? 4 : time < aboutStart ? 5 : time < finaleStart ? 6 : 7;
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
    const closed = time >= finaleSettled;
    if (closed !== reassembled) {
      reassembled = closed;
      if (chapter === 7 && caption) caption.textContent = closed ? "Assembly complete" : captions[7];
    }
    const credential = time < credentialWindow.switch ? 0 : 1;
    credentialText.show(chapter === 2 ? credential : -1);
    if (activeCredential !== credential) {
      activeCredential = credential;
      credentialPanels.forEach((panel, index) => {
        panel.inert = index !== credential;
        panel.toggleAttribute("data-active", index === credential);
      });
      credentialLinks.forEach((link, index) => {
        if (index === credential) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    const project = chapter === 3 ? projectAt(time) : -1;
    projectText.show(project);
    const nextExit = time >= projectExit;
    if (activeProject !== project) {
      activeProject = project;
      projectPanels.forEach((panel, index) => {
        panel.inert = index !== project;
        panel.toggleAttribute("data-active", index === project);
      });
      projectLinks.forEach((link, index) => {
        if (index === project) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      if (project >= 0 && caption) caption.textContent = nextExit ? "Display opening" : projectLinks[project].textContent;
    }
    if (exiting !== nextExit) {
      exiting = nextExit;
      if (caption && project >= 0) caption.textContent = exiting ? "Display opening" : projectLinks[project].textContent;
    }
    for (const [dossierIndex, dossier] of dossiers.entries()) {
      const active = chapter === dossier.chapter ? stopAt(dossier.stops, time) : -1;
      dossierText[dossierIndex].show(active);
      if (active === dossier.active) continue;
      dossier.active = active;
      dossier.panels.forEach((panel, index) => {
        panel.inert = index !== active;
        panel.toggleAttribute("data-active", index === active);
      });
      dossier.links.forEach((link, index) => {
        if (index === active) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      if (active >= 0 && caption) caption.textContent = dossier.links[active].textContent;
    }
    const textChapter = chapter === 7 && copy[7].bottom >= 99.99 ? -1 : chapter;
    chapterText.show(textChapter);
    panels.forEach((panel, index) => panel.toggleAttribute("data-visible", index === textChapter));
  }

  function drawScene() {
    const compact = compactLayout.matches;
    const short = height < 570;
    applyPose(compact);
    key.intensity = light.key;
    edge.intensity = light.edge;
    scene.environmentIntensity = light.environment;
    const tilt = Math.sin(core.root.rotation.x);
    core.cover.getWorldPosition(coverWorld);
    const carriedCover = smoothMaximum(0, coverWorld.y - 1.65, .15) * Math.max(0, tilt) * .45;
    const screenX = compact ? .50 : view.screenX;
    const tabletOffset = Math.max(0, view.portraitY - .67) * gsap.utils.clamp(0, 1, (width / height - .51) / .31) *
      (1 - .75 * view.engineeringFrame);
    const portraitY = view.portraitY - tabletOffset + (short ? .055 : 0);
    const screenY = compact ? portraitY : view.screenY;
    const smallEngineeringStage = gsap.utils.clamp(0, 1, (680 - height) / 112);
    const verticalRoom = compact
      ? (short ? .36 : .43) - view.engineeringFrame * ((short ? .04 : .07) + smallEngineeringStage * .13)
      : (short ? .57 : .65);
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
    core.base.updateWorldMatrix(false, false);
    const matrix = core.base.matrixWorld.elements;
    supportWorld.copy(supportCenter).applyMatrix4(core.base.matrixWorld);
    const lowerEdge = supportWorld.y -
      (Math.abs(matrix[1]) * supportHalf.x + Math.abs(matrix[5]) * supportHalf.y + Math.abs(matrix[9]) * supportHalf.z);
    shadow.position.set(supportWorld.x * .8, lowerEdge - .018, supportWorld.z * .68);
    shadow.scale.set(1 + spread * .10, 1 + spread * .15 - tilt * .28, 1);
    shadow.material.opacity = .94 - spread * .20 - tilt * .08;
    if (activeProject >= 0) core.projectDisplay.show(activeProject);
    core.screenMesh.visible = core.screen.opacity > 0;
    engineeringScene.updateTrace(engineering.trace, engineering.signal, dossiers[0].active);
    engineeringScene.updateLab(engineering.lab, engineering.module, dossiers[1].active, compact);
    core.archive.mount.visible = core.archive.mat.material.opacity > 0;
    for (const page of core.archive.pages) {
      page.visible = page.material.opacity > 0 && Boolean(page.material.map?.image);
    }
    const started = diagnosticsEnabled ? performance.now() : 0;
    renderer.render(scene, camera);
    if (diagnosticsEnabled) submitMs = performance.now() - started;
    sceneRenders++;
  }

  function paint() {
    timeline.progress(progress, true);
    paintCopy();
    const sceneProgress = Math.min(progress, sceneSettledProgress);
    if (sceneDirty || sceneProgress !== renderedSceneProgress) {
      drawScene();
      renderedSceneProgress = sceneProgress;
      sceneDirty = false;
    } else submitMs = 0;
    renderedProgress = progress;
    rail?.style.setProperty("--progress", String(progress));
    canvas.dataset.progress = progress.toFixed(4);
    canvas.dataset.settled = String(progress === targetProgress);
    if (progress === targetProgress && pendingHeading) {
      pendingHeading.setAttribute("tabindex", "-1");
      pendingHeading.focus({ preventScroll: true });
      pendingHeading = null;
    }
  }

  function queuePaint() {
    if (frame || disposed) return;
    frame = requestAnimationFrame((time) => {
      frame = 0;
      const interval = time - lastFrameTime;
      const delta = interval > 80 ? 1000 / 60 : Math.max(1, interval);
      const blend = 1 - Math.exp(-delta / (motionDuration / 5));
      progress = performance.now() - motionStarted >= motionDuration
        ? targetProgress
        : progress + (targetProgress - progress) * blend;
      const advance = Math.abs(progress - renderedProgress);
      const sceneMoves = Math.min(progress, sceneSettledProgress) !== renderedSceneProgress;
      slowFrames = sceneMoves && interval > 24 && interval < 85 && advance > 0 && advance < .06 ? slowFrames + 1 : 0;
      if (slowFrames === 8 && ratio > 1.01) {
        ratio = Math.max(1, ratio * .84);
        renderer.setDrawingBufferSize(width, height, ratio);
        sceneDirty = true;
        slowFrames = 0;
      }
      lastFrameTime = time;
      paint();
      if (progress !== targetProgress) queuePaint();
    });
  }

  function sync(value: number) {
    if (value === targetProgress) return;
    targetProgress = value;
    if (!ready) {
      progress = value;
      return;
    }
    motionStarted = performance.now();
    motionDuration = scrollSettlingMs;
    queuePaint();
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
    sceneDirty = true;
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
      targetProgress, motionSettled: progress === targetProgress,
      timelineProgress: timeline.progress(), camera: camera.position.toArray(), target: target.toArray(),
      root: { id: core.root.uuid, rotation: core.root.rotation.toArray().slice(0, 3), scale: core.root.scale.toArray() },
      parts: transforms, displayOpacity: core.screen.opacity,
      project: { index: activeProject, imageReady: core.projectDisplay.imageReady },
      engineering: {
        trace: dossiers[0].active, lab: dossiers[1].active,
        traceParent: engineeringScene.trace.parent?.name,
        traceCursor: engineering.signal,
        signal: engineeringScene.trace.visible ? engineeringScene.indicator.position.toArray() : null,
        cartridges: engineeringScene.tiles.visible ? engineeringScene.modules.map(({ slot }) => slot.position.toArray()) : null,
      },
      closing: { about: dossiers[2].active, reassembled, light: [light.key, light.edge, light.environment] },
      archive: {
        matOpacity: core.archive.mat.material.opacity,
        pages: core.archive.pages.map((page) => ({
          id: page.name, x: page.position.x, opacity: page.material.opacity, visible: page.visible && core.archive.mount.visible,
          aspect: page.geometry.parameters.width / page.geometry.parameters.height,
        })),
      },
      drawCalls: renderer.info.render.calls, canvasPixels: canvas.width * canvas.height,
      triangles: renderer.info.render.triangles, submitMs, sceneRenders,
      latchOffsets: core.latches.map(({ tab }) => tab.position.x),
      trigger: { start: trigger.start, end: trigger.end }, chapter,
    });
  }

  mount.append(canvas);
  resize();
  const trigger = ScrollTrigger.create({
    trigger: element,
    // The homepage storyboard owns the full document scroll range.
    start: 0,
    end: "max",
    onUpdate: (self) => sync(self.progress),
    onRefresh: (self) => {
      resize();
      sync(self.progress);
    },
  });

  function seek(fraction: number) {
    const position = Math.round(trigger.start + (trigger.end - trigger.start) * fraction);
    window.scrollTo(0, position);
    reconcileSeek();
    if (ready) motionDuration = navigationSettlingMs;
    cancelAnimationFrame(seekFrame);
    seekFrame = requestAnimationFrame(() => {
      seekFrame = 0;
      reconcileSeek();
    });
  }

  function reconcileSeek() {
    // A document navigation can still have a ScrollTrigger refresh pending on the click frame.
    ScrollTrigger.update();
    trigger.update();
    sync(gsap.utils.clamp(0, 1, (window.scrollY - trigger.start) / (trigger.end - trigger.start)));
  }

  function onHash() {
    const entry = stops.find(({ id }) => id === window.location.hash.slice(1));
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
    const entry = stops.find(({ id }) => id === link?.hash.slice(1));
    if (!link || !entry) return;
    event.preventDefault();
    if (window.location.hash !== link.hash) window.history.pushState(null, "", link.hash);
    pendingHeading = document.getElementById(entry.id)?.querySelector<HTMLElement>("h1, h2, h3") ?? null;
    seek(entry.time);
    queuePaint();
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
    pendingHeading = null;
    cancelAnimationFrame(seekFrame);
    observer.disconnect();
    trigger.kill();
    timeline.kill();
    chapterText.dispose();
    credentialText.dispose();
    projectText.dispose();
    dossierText.forEach((transition) => transition.dispose());
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
    }
    for (const panel of [...credentialPanels, ...projectPanels, ...dossiers.flatMap(({ panels }) => panels)]) {
      panel.inert = false;
      panel.removeAttribute("data-active");
    }
    credentialLinks.forEach((link) => link.removeAttribute("aria-current"));
    projectLinks.forEach((link) => link.removeAttribute("aria-current"));
    for (const dossier of dossiers) dossier.links.forEach((link) => link.removeAttribute("aria-current"));
    nav.forEach((link) => link.removeAttribute("aria-current"));
    if (counter) counter.textContent = "01";
    if (caption) caption.textContent = captions[0];
    environment.dispose();
    core.projectDisplay.dispose();
    engineeringScene.dispose();
    disposeScene(scene);
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return dispose;
}
