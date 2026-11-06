"use client";

import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const setup: SceneSetup = (system, gsap, media) => {
  media.add("all", () => {
    const introBlock = system.querySelector(".system-intro");
    if (introBlock) {
      gsap.from(introBlock.children, {
        y: 18, stagger: 0.055, duration: 0.56, ease: "power3.out",
        scrollTrigger: { trigger: introBlock, start: "top 88%", once: true },
      });
    }
    const explanation = system.querySelector("[data-system-explanation]");
    const intro = explanation?.querySelector(".system-explanation__intro");
    if (explanation && intro) {
      gsap.from(intro, {
        y: 8, ease: "none",
        scrollTrigger: { trigger: explanation, start: "top 90%", end: "top 65%", scrub: true },
      });
    }
  });
};

export function SystemMotion() {
  const marker = useSceneMotion(".inside-system", setup, ".inside-system");

  return <span ref={marker} hidden />;
}
