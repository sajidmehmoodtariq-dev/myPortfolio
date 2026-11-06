"use client";

import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const setup: SceneSetup = (hero, gsap, media) => {
  media.add("all", () => {
    const rig = hero.querySelector<HTMLElement>("[data-hero-rig]");
    const next = hero.nextElementSibling;
    if (!rig) return;

    const tail = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "bottom 100%",
        end: "bottom 58%",
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
    if (next) {
      tail.fromTo(next, { "--signal-join": 0 }, {
        "--signal-join": 0.88,
        ease: "none",
        duration: 0.03,
      }, 0.97);
    }

    if (hero.hasAttribute("data-hero-entered") || window.scrollY > 32 || hero.contains(document.activeElement) ||
      (location.hash && location.hash !== "#intro")) return;
    hero.dataset.heroEntered = "";

    const entrance = gsap.timeline({ defaults: { ease: "power2.out" } });
    entrance
      .from("[data-hero-field]", { opacity: 0.35, duration: 0.7 }, 0)
      .from("[data-hero-marker]:not(.hero-eyebrow)", { opacity: 0, y: 5, duration: 0.38, stagger: 0.028 }, 0.08)
      .from("[data-hero-line]", { y: 12, duration: 0.62, stagger: 0.12 }, 0.23)
      .fromTo(rig, { "--spread": 0.16 }, { "--spread": 1, duration: 1.02 }, 0.23)
      .from("[data-hero-layer]", { opacity: 0.15, duration: 0.53, stagger: 0.044 }, 0.24)
      .from('.signal-spline--rear [data-signal="entrance"]', { strokeDashoffset: 1, autoRound: false, duration: 0.47 }, 0.45)
      .from('.signal-spline--front [data-signal="entrance"]', { strokeDashoffset: 1, autoRound: false, duration: 0.41 }, 0.92)
      .from("[data-hero-detail]", { y: 5, duration: 0.43, stagger: 0.1 }, 0.74);

    const settle = () => entrance.progress(1);
    hero.addEventListener("focusin", settle);
    hero.addEventListener("pointerdown", settle);
    return () => {
      hero.removeEventListener("focusin", settle);
      hero.removeEventListener("pointerdown", settle);
    };
  });

  media.add("(min-width: 64rem) and (hover: hover) and (pointer: fine)", () => {
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
  const marker = useSceneMotion(".hero", setup);

  return <span ref={marker} hidden />;
}
