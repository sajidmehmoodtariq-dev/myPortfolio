"use client";

import { useEffect, useRef } from "react";

export function FinaleMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const main = marker.current?.closest("main");
    if (!main) return;

    let disposed = false;
    let revert: (() => void) | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia(main);
        revert = () => media.revert();

        media.add("(prefers-reduced-motion: no-preference)", () => {
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
                opacity: 0.7, y: 10, duration: 0.42, stagger: 0.06, ease: "power2.out",
                scrollTrigger: { trigger: chapter, start: "top 85%", once: true },
              });
            }
          }
        });
      },
      () => {
        // Static paths and links are available without the motion runtime.
      },
    );

    return () => {
      disposed = true;
      revert?.();
    };
  }, []);

  return <span hidden ref={marker} />;
}
