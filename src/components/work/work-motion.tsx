"use client";

import { useEffect, useRef } from "react";

export function WorkMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>(".selected-work, .case-study");
    if (!root) return;

    let disposed = false;
    let revert: (() => void) | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);

        const media = gsap.matchMedia(root);
        revert = () => media.revert();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const caseIntro = root.querySelector("[data-case-intro]");
          if (caseIntro) {
            gsap.from(caseIntro.querySelectorAll("[data-work-reveal]"), {
              opacity: 0.65, y: 12, duration: 0.45, stagger: 0.065, ease: "power2.out",
            });
            return;
          }

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
                  opacity: 0.65, y: 14, duration: 0.48, stagger: 0.065,
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

        media.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
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
      },
      () => {
        // The server-rendered exhibits remain readable without the motion runtime.
      },
    );

    return () => {
      disposed = true;
      revert?.();
    };
  }, []);

  return <span hidden ref={marker} />;
}
