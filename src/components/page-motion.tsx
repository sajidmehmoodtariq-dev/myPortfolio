"use client";

import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

type Point = { x: number; y: number };

const setup: SceneSetup = (main, gsap, media) => {
  const path = main.querySelector<SVGPathElement>(".page-trajectory path");
  const tip = main.querySelector<SVGCircleElement>(".page-trajectory__tip");
  const intro = main.querySelector("#intro");
  const terminal = main.querySelector("[data-contact-terminal]");
  if (!path || !tip || !intro || !terminal) return;

  const waypoints = [
    [".work-intro", 0.57, 0.46, 0.48],
    [".work-gallery-scene", 0.28, 0.3, 0.32],
    [".work-gallery-scene", 0.62, 0.87, 0.68],
    ["#toolbox", 0.63, 0.49, 0.67],
    ["#about", 0.34, 0.53, 0.31],
    ["#notes", 0.62, 0.55, 0.67],
    ["#contact", 0.51, 0.19, 0.45],
  ] as const;

  let samples: Point[] = [];
  let mainTop = 0;
  let maxScroll = 0;
  let finalLead = 0;
  function drawCurve() {
    if (!path || !intro || !terminal) return;
    const bounds = main.getBoundingClientRect();
    mainTop = bounds.top + window.scrollY;
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const compact = !window.matchMedia("(min-width: 64rem)").matches;
    const points: Point[] = [{
      x: bounds.width * (compact ? 0.76 : 0.818),
      y: intro.getBoundingClientRect().bottom - bounds.top,
    }];
    for (const [selector, wideX, y, compactX] of waypoints) {
      const anchor = main.querySelector(selector);
      if (!anchor) continue;
      const rect = anchor.getBoundingClientRect();
      points.push({ x: bounds.width * (compact ? compactX : wideX), y: rect.top - bounds.top + rect.height * y });
    }
    const end = terminal.getBoundingClientRect();
    points.push({ x: end.left - bounds.left + end.width / 2, y: end.top - bounds.top + end.height / 2 });
    finalLead = Math.max(0, points[points.length - 1].y + mainTop - maxScroll - window.innerHeight * 0.72);

    let curve = `M ${points[0].x} ${points[0].y}`;
    for (let index = 1; index < points.length; index++) {
      const start = points[index - 1];
      const next = points[index];
      // The shared vertical tangent keeps each turn smooth at its waypoint.
      const handle = (next.y - start.y) * 0.55;
      curve += ` C ${start.x} ${start.y + handle} ${next.x} ${next.y - handle} ${next.x} ${next.y}`;
    }
    path.setAttribute("d", curve);
    const length = path.getTotalLength();
    const count = Math.max(1, Math.ceil(length / 8));
    samples = Array.from({ length: count + 1 }, (_, index) => path.getPointAtLength(length * index / count));
  }

  function paint() {
    if (!path || !tip || !samples.length) return;
    const last = samples.length - 1;
    // Ease any extra distance needed to reach the contact marker on short screens.
    const remaining = Math.max(0, maxScroll - window.scrollY);
    const y = window.innerHeight * 0.72 + window.scrollY - mainTop
      + finalLead * Math.max(0, 1 - remaining / (window.innerHeight * 0.6));

    let low = 0;
    let high = last;
    while (high - low > 1) {
      const middle = (low + high) >> 1;
      if (samples[middle].y < y) low = middle;
      else high = middle;
    }
    const a = samples[low];
    const b = samples[high];
    const mix = gsap.utils.clamp(0, 1, (y - a.y) / (b.y - a.y || 1));
    const progress = (low + mix) / last;
    path.style.strokeDashoffset = String(1 - progress);
    tip.setAttribute("cx", String(a.x + (b.x - a.x) * mix));
    tip.setAttribute("cy", String(a.y + (b.y - a.y) * mix));
    tip.style.opacity = progress > 0 && progress < 1 ? "1" : "0";
  }

  media.add("all", () => {
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        paint();
      });
    };
    const refresh = () => {
      drawCurve();
      paint();
    };
    refresh();
    const observer = new ResizeObserver(refresh);
    observer.observe(main);
    for (const section of main.querySelectorAll(":scope > section")) observer.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", refresh);
    };
  });

  media.add({ pointer: "(hover: hover) and (pointer: fine)", reduced: "(prefers-reduced-motion: reduce)" }, ({ conditions }) => {
    if (!conditions?.pointer) return;
    const reduced = Boolean(conditions.reduced);
    let disposed = false;
    let destroy: (() => void) | undefined;
    void import("lenis").then(({ default: Lenis }) => {
      if (disposed) return;
      const scroll = new Lenis({
        autoRaf: true,
        lerp: reduced ? 0.34 : 0.16,
        respectReducedMotion: false,
        stopInertiaOnNavigate: true,
      });
      destroy = () => scroll.destroy();
    }, () => {
      // The page can continue with native scrolling if the enhancement fails.
    });
    return () => {
      disposed = true;
      destroy?.();
    };
  });
};

export function PageMotion() {
  const marker = useSceneMotion(".portfolio-main", setup, undefined, true);

  return (
    <>
      <svg className="page-trajectory" aria-hidden="true" focusable="false">
        <path pathLength="1" />
      </svg>
      <svg className="page-trajectory page-trajectory--marker" aria-hidden="true" focusable="false">
        <circle className="page-trajectory__tip" r="2.25" />
      </svg>
      <span ref={marker} hidden />
    </>
  );
}
