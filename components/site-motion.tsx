"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate([
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], {
          duration: 560,
          delay: stagger++ * 40,
          easing: "cubic-bezier(.2,.7,.2,1)",
          fill: "backwards",
        });
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
      }
    }, { threshold: .08, rootMargin: "0px 0px -20px 0px" });

    document.querySelectorAll('[data-reveal]:not([data-reveal="intro"])').forEach((element) => {
      const bounds = element.getBoundingClientRect();
      // Content already visible at hydration keeps its painted state.
      if (bounds.top >= window.innerHeight || bounds.bottom <= 0) observer.observe(element);
    });
    const cancel = () => {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    preference.addEventListener("change", cancel);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", cancel);
      cancel();
    };
  }, [pathname]);

  return null;
}
