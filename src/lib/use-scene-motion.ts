"use client";

import { useEffect, useRef } from "react";

type GSAP = typeof import("gsap").gsap;
export type SceneSetup = (root: HTMLElement, gsap: GSAP, media: ReturnType<GSAP["matchMedia"]>) => void;

let runtime: Promise<GSAP> | undefined;

function loadMotion() {
  return runtime ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return gsap;
    },
  );
}

export function useSceneMotion(selector: string, setup: SceneSetup, near?: string) {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>(selector);
    if (!root) return;

    const preference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let nearby = !near || !("IntersectionObserver" in window);
    let loading = false;
    let disposed = false;
    let revert: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;

    function sync() {
      if (!preference.matches) {
        revert?.();
        revert = undefined;
        return;
      }
      if (!root || !nearby || loading || revert) return;

      loading = true;
      loadMotion().then((gsap) => {
        loading = false;
        if (disposed || !preference.matches) return;
        const media = gsap.matchMedia(root);
        revert = () => media.revert();
        setup(root, gsap, media);
      }, () => {
        loading = false;
        // Server-rendered scenes already expose their settled state.
      });
    }

    if (!nearby && near) {
      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        nearby = true;
        observer?.disconnect();
        sync();
      }, { rootMargin: "650px 0px" });
      for (const target of root.matches(near) ? [root] : root.querySelectorAll(near)) {
        observer.observe(target);
      }
    }

    preference.addEventListener("change", sync);
    sync();

    return () => {
      disposed = true;
      observer?.disconnect();
      preference.removeEventListener("change", sync);
      revert?.();
    };
  }, [selector, setup, near]);

  return marker;
}
