"use client";

import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const setup: SceneSetup = (hero, gsap, media) => {
  media.add({ all: "all", reduced: "(prefers-reduced-motion: reduce)" }, ({ conditions }) => {
    const rig = hero.querySelector<HTMLElement>("[data-hero-rig]");
    if (!rig) return;
    const reduced = Boolean(conditions?.reduced);

    const tail = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "bottom 100%",
        end: "bottom 72%",
        scrub: true,
      },
    });
    // Each path has a normalized length of 1. Keep fractional dash offsets.
    tail.fromTo('[data-signal="scroll"]', { strokeDashoffset: 1 }, {
      strokeDashoffset: 0,
      autoRound: false,
      ease: "none",
      duration: 1,
    });
    if (hero.hasAttribute("data-hero-entered") || window.scrollY > 32 || hero.contains(document.activeElement) ||
      (location.hash && location.hash !== "#intro")) return;
    hero.dataset.heroEntered = "";

    const entrance = gsap.timeline({ defaults: { ease: "power2.out" } });
    entrance
      .from("[data-hero-field]", { opacity: 0.28, duration: 0.8 }, 0)
      .from(".assembly-frame", { opacity: 0, duration: 0.55 }, 0.08)
      .from("[data-hero-line]", { y: reduced ? 0 : 22, duration: 0.72, stagger: 0.14 }, 0.16)
      .fromTo(rig, { "--entrance-yaw": reduced ? "0deg" : "-12deg" }, { "--entrance-yaw": "0deg", duration: 1.3 }, 0.28)
      .fromTo(".assembly-layer--base, .assembly-layer--cap", { "--spread": reduced ? 0.64 : 0.28 }, {
        "--spread": 1, duration: 0.94, stagger: 0.13, ease: "power3.inOut",
      }, 0.32)
      .fromTo(".assembly-layer:not(.assembly-layer--base, .assembly-layer--cap)", { "--spread": reduced ? 0.52 : 0.19 }, {
        "--spread": 1, duration: 0.88, stagger: 0.09, ease: "power3.inOut",
      }, 0.52)
      .from('.signal-spline--rear [data-signal="entrance"]', { strokeDashoffset: 1, autoRound: false, duration: 0.76 }, 0.88)
      .from('.signal-spline--front [data-signal="entrance"]', { strokeDashoffset: 1, autoRound: false, duration: 0.47 }, 1.64)
      .fromTo(".assembly-leaders path", { strokeDasharray: "1 2", strokeDashoffset: 1 }, {
        strokeDashoffset: 0, autoRound: false, duration: 0.4,
      }, 1.62)
      .from(".assembly-leaders circle, .assembly-label, .hero-register", {
        opacity: 0, y: reduced ? 0 : 5, duration: 0.32, stagger: 0.035,
      }, 1.81)
      .from("[data-hero-detail]", { y: reduced ? 0 : 13, duration: 0.5, stagger: 0.1 }, 1.42);

    const settle = () => entrance.progress(1);
    hero.addEventListener("focusin", settle);
    hero.addEventListener("pointerdown", settle);
    return () => {
      hero.removeEventListener("focusin", settle);
      hero.removeEventListener("pointerdown", settle);
    };
  });

  media.add("(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const rig = hero.querySelector<HTMLElement>("[data-hero-rig]");
    if (!rig) return;

    const camera = { x: 0, y: 0 };
    const render = () => {
      rig.style.setProperty("--camera-x", `${camera.x}deg`);
      rig.style.setProperty("--camera-y", `${camera.y}deg`);
    };
    const tiltX = gsap.quickTo(camera, "x", { duration: 0.55, ease: "power3.out", onUpdate: render });
    const tiltY = gsap.quickTo(camera, "y", { duration: 0.55, ease: "power3.out", onUpdate: render });

    const reset = () => {
      tiltX(0);
      tiltY(0);
    };
    const point = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      tiltX(gsap.utils.clamp(-3, 3, 3 - (event.clientY / window.innerHeight) * 6));
      tiltY(gsap.utils.clamp(-4, 4, (event.clientX / window.innerWidth) * 8 - 4));
    };

    hero.addEventListener("pointermove", point, { passive: true });
    hero.addEventListener("pointerleave", reset);
    return () => {
      hero.removeEventListener("pointermove", point);
      hero.removeEventListener("pointerleave", reset);
      rig.style.removeProperty("--camera-x");
      rig.style.removeProperty("--camera-y");
    };
  });
};

export function HeroMotion() {
  const marker = useSceneMotion(".hero", setup, undefined, true);

  return <span ref={marker} hidden />;
}
