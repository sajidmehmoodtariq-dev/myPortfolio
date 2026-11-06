"use client";

import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const projectMoves = [
  { mask: "inset(3% 0 14% 0)", y: 5, pitch: 6, yaw: -3 },
  { mask: "inset(0 12% 4% 0)", y: 3, pitch: 3, yaw: 5 },
  { mask: "inset(10% 0 4% 0)", y: 4, pitch: 5, yaw: -2 },
  { mask: "inset(0 0 4% 10%)", y: 3, pitch: 2, yaw: 4 },
];

const setup: SceneSetup = (root, gsap, media) => {
  media.add("all", () => {
    for (const feature of root.querySelectorAll("[data-work-feature]")) {
      const text = feature.querySelectorAll("[data-work-reveal]");
      gsap.from(text, {
        y: 18, duration: 0.56, stagger: 0.055, ease: "power3.out",
        scrollTrigger: { trigger: feature, start: "top 86%", once: true },
      });

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

    root.querySelectorAll("[data-work-visual]").forEach((visual, index) => {
      const mask = visual.querySelector("[data-work-mask]");
      const caption = visual.querySelector("figcaption");
      if (!mask || !caption) return;
      const move = projectMoves[index % projectMoves.length];
      const reveal = gsap.timeline({
        scrollTrigger: { trigger: visual, start: "top 92%", end: "top 48%", scrub: true },
      });
      reveal.fromTo(mask, { clipPath: move.mask }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" })
        .from(caption, { y: 8, ease: "power2.out" }, ">-0.25");
    });
  });

  media.add("(min-width: 64rem)", () => {
    root.querySelectorAll("[data-work-visual]").forEach((visual, index) => {
      const rig = visual.querySelector("[data-work-rig]");
      if (!rig) return;
      const move = projectMoves[index % projectMoves.length];
      const travel = gsap.timeline({
        scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: true },
      });
      travel.fromTo(rig, { yPercent: move.y, rotationX: move.pitch, rotationY: move.yaw }, {
        yPercent: 0, rotationX: 0, rotationY: 0, duration: 0.55, ease: "power2.out",
      }).to(rig, { yPercent: -move.y / 2, duration: 0.45, ease: "none" });
    });
  });
};

export function WorkMotion() {
  const marker = useSceneMotion(".selected-work", setup, ".selected-work");

  return <span ref={marker} hidden />;
}
