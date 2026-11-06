"use client";

import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const setup: SceneSetup = (root, gsap, media) => {
  media.add("all", () => {
    for (const feature of root.querySelectorAll("[data-work-feature]")) {
      const text = feature.querySelectorAll("[data-work-reveal]");
      const mask = feature.querySelector("[data-work-mask]");

      if (text.length || mask) {
        const reveal = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: feature, start: "top 86%", once: true },
        });
        if (text.length) {
          reveal.from(text, {
            y: 10, duration: 0.48, stagger: 0.065,
          }, 0);
        }
        if (mask) {
          reveal.from(mask, {
            clipPath: "inset(0 0 8% 0)", duration: 0.72,
          }, 0.1);
        }
      }

      gsap.fromTo(feature.querySelectorAll(".work-signal path"), {
        strokeDashoffset: 1,
      }, {
        strokeDashoffset: 0,
        autoRound: false,
        ease: "none",
        scrollTrigger: {
          trigger: feature, start: "top 70%", end: "bottom 70%", scrub: true,
        },
      });
    }
  });

  media.add("(min-width: 64rem)", () => {
    for (const visual of root.querySelectorAll("[data-work-visual]")) {
      const rig = visual.querySelector("[data-work-rig]");
      if (!rig) continue;
      gsap.fromTo(rig, { yPercent: 2, rotationX: 3 }, {
        yPercent: -2,
        rotationX: 0,
        ease: "none",
        scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
  });
};

export function WorkMotion() {
  const marker = useSceneMotion(".selected-work", setup, ".selected-work");

  return <span ref={marker} hidden />;
}
