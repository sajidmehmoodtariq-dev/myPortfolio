"use client";

import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const setup: SceneSetup = (main, gsap, media) => {
  media.add("all", () => {
    for (const chapter of main.querySelectorAll("[data-closing-chapter]")) {
      const terminal = chapter.querySelector("[data-contact-terminal]");
      const draw = gsap.timeline({
        scrollTrigger: {
          trigger: chapter,
          start: "top 70%",
          end: terminal ? "max" : "bottom 70%",
          scrub: true,
        },
      });
      draw.fromTo(chapter.querySelectorAll(".closing-signal path"), { strokeDashoffset: 1 }, {
        strokeDashoffset: 0, autoRound: false, ease: "none", duration: 1,
      });
      if (terminal) draw.from(terminal, { opacity: 0.3, duration: 0.15 }, 0.85);

      const entries = chapter.querySelectorAll("[data-note-reveal]");
      if (entries.length) {
        gsap.from(entries, {
          y: 8, duration: 0.42, stagger: 0.06, ease: "power2.out",
          scrollTrigger: { trigger: chapter, start: "top 85%", once: true },
        });
      }
    }
  });
};

export function FinaleMotion() {
  const marker = useSceneMotion("main", setup, "[data-closing-chapter]");

  return <span ref={marker} hidden />;
}
