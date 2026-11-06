"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const desktopGallery = "(min-width: 64rem) and (min-height: 48rem) and (pointer: fine)";

export function ProjectRail({ count, children }: { count: number; children: ReactNode }) {
  const scene = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const geometry = useRef<{ start: number; travel: number }>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const chapter = scene.current;
    const panel = sticky.current;
    const rail = viewport.current;
    if (!chapter || !panel || !rail) return;
    const desktop = window.matchMedia(desktopGallery);
    let raf = 0;

    function sync() {
      raf = 0;
      if (!rail?.clientWidth) return;
      const position = geometry.current;
      if (position) {
        const progress = Math.max(0, Math.min(1, (window.scrollY - position.start) / position.travel));
        rail.scrollLeft = progress * (rail.scrollWidth - rail.clientWidth);
      }
      setActive(Math.min(count - 1, Math.round(rail.scrollLeft / rail.clientWidth)));
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(sync);
    }

    function measure() {
      if (!chapter || !panel) return;
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
      const enabled = desktop.matches && count > 1 && panel.offsetHeight < window.innerHeight - header;
      chapter.toggleAttribute("data-wheel-gallery", enabled);
      if (enabled) {
        const travel = (count - 1) * Math.min(620, window.innerHeight * 0.58);
        chapter.style.minHeight = `${panel.offsetHeight + travel}px`;
        geometry.current = { start: chapter.getBoundingClientRect().top + window.scrollY - header, travel };
      } else {
        chapter.style.removeProperty("min-height");
        geometry.current = null;
      }
      schedule();
    }

    function followHash() {
      const position = geometry.current;
      if (!position || !rail) return;
      const index = Array.from(rail.children).findIndex((item) => `#${item.id}` === location.hash);
      if (index >= 0) window.scrollTo(0, position.start + position.travel * index / (count - 1));
    }

    const resize = new ResizeObserver(measure);
    resize.observe(panel);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("hashchange", followHash);
    desktop.addEventListener("change", measure);
    rail.addEventListener("scroll", schedule, { passive: true });
    measure();
    followHash();
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("hashchange", followHash);
      desktop.removeEventListener("change", measure);
      rail.removeEventListener("scroll", schedule);
      geometry.current = null;
      chapter.removeAttribute("data-wheel-gallery");
      chapter.style.removeProperty("min-height");
    };
  }, [count]);

  function goTo(index: number, immediate = false) {
    const rail = viewport.current;
    if (!rail) return;
    const target = Math.max(0, Math.min(count - 1, index));
    const behavior = immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    const position = geometry.current;
    if (position) {
      window.scrollTo({ top: position.start + position.travel * target / (count - 1), behavior });
      return;
    }
    rail.scrollTo({
      left: rail.clientWidth * target,
      behavior,
    });
  }

  return (
    <div className="work-gallery-scene" ref={scene}>
      <div className="exhibit-container work-gallery" ref={sticky}>
        <div className="work-gallery__controls">
          <span className="work-gallery__hint">
            <span>Swipe or use the arrows</span>
            <span>Scroll to browse</span>
          </span>
          <span className="work-gallery__count" aria-live="polite">{active + 1} / {count}</span>
          <button type="button" aria-label="Previous project" aria-controls="project-gallery" disabled={active === 0} onClick={() => goTo(active - 1)}>←</button>
          <button type="button" aria-label="Next project" aria-controls="project-gallery" disabled={active === count - 1} onClick={() => goTo(active + 1)}>→</button>
        </div>
        <div
          id="project-gallery"
          className="work-gallery__viewport"
          ref={viewport}
          tabIndex={0}
          role="region"
          aria-label="Project gallery"
          data-lenis-prevent-horizontal
          onFocusCapture={(event) => {
            const position = geometry.current;
            if (!position) return;
            const index = Array.from(event.currentTarget.children).findIndex((item) => item.contains(event.target));
            const shown = Math.round((window.scrollY - position.start) / position.travel * (count - 1));
            if (index >= 0 && index !== shown) goTo(index, true);
          }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            goTo(active + (event.key === "ArrowRight" ? 1 : -1));
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
