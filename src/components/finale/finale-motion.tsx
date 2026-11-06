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
      if (terminal) draw.from(terminal, { opacity: 0.25, scale: 0.6, duration: 0.12 }, 0.88);

      const heading = chapter.querySelector("h2");
      if (heading) {
        gsap.from(heading, {
          y: 22, ease: "power3.out", duration: 0.56,
          scrollTrigger: { trigger: heading, start: "top 90%", once: true },
        });
      }

      const modules = chapter.querySelectorAll(".toolbox-module");
      if (modules.length) {
        gsap.from(modules, {
          y: 16, duration: 0.56, stagger: 0.085, ease: "power3.out",
          scrollTrigger: { trigger: modules[0], start: "top 86%", once: true },
        });
      }

      const history = chapter.querySelector(".experience-timeline");
      if (history) {
        gsap.fromTo(history, { "--experience-progress": 0 }, {
          "--experience-progress": 1, ease: "none",
          scrollTrigger: { trigger: history, start: "top 83%", end: "bottom 62%", scrub: true },
        });
        gsap.from(history.children, {
          x: -10, stagger: 0.11, duration: 0.48, ease: "power2.out",
          scrollTrigger: { trigger: history, start: "top 83%", once: true },
        });
      }

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
