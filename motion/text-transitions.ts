type TextPose = { opacity: string | number; transform: string; clipPath: string };

// Scroll selects the content; bounded compositor animations finish each handoff even
// when a wheel/touch input crosses the chapter's timeline interval in one frame.
export function createTextTransitions(panels: HTMLElement[]) {
  const running = new Map<HTMLElement, Animation[]>();
  const container = panels[0]?.parentElement;
  let sizing: Animation | undefined;
  let selected = -2;

  function stop(panel: HTMLElement) {
    running.get(panel)?.forEach((animation) => animation.cancel());
    running.delete(panel);
  }

  function show(index: number, immediate = false) {
    if (index === selected) return;
    const first = selected === -2;
    selected = index;
    const fit = container && getComputedStyle(container).getPropertyValue("--fit-text").trim() === "1";
    const previousHeight = fit ? container.getBoundingClientRect().height : 0;
    sizing?.cancel();
    sizing = undefined;
    if (index >= 0) panels.forEach((panel, current) => panel.toggleAttribute("data-text-current", current === index));

    panels.forEach((panel, panelIndex) => {
      const incoming = panelIndex === index;
      const present = panel.hasAttribute("data-text-visible");
      panel.inert = !incoming;
      if (!incoming && !present) return;

      const children = Array.from(panel.children).filter((child): child is HTMLElement =>
        child instanceof HTMLElement && getComputedStyle(child).display !== "none");
      // Read the currently painted pose before cancellation so interrupted reveals
      // and quick reverse scrolling can continue without resetting to a keyframe.
      const poses: TextPose[] = children.map((child) => {
        const style = getComputedStyle(child);
        return { opacity: style.opacity, transform: style.transform, clipPath: style.clipPath };
      });
      stop(panel);

      if (first || immediate) {
        panel.toggleAttribute("data-text-visible", incoming);
        return;
      }

      panel.setAttribute("data-text-visible", "");
      const animations = children.map((child, childIndex) => {
        const heading = child.matches("h1, h2, h3") || child.querySelector("h1, h2, h3") !== null;
        const start = present ? poses[childIndex] : {
          opacity: 0,
          transform: "translateY(42px)",
          clipPath: heading ? "inset(0px -10px 100% -10px)" : "inset(-8px -10px -10px -10px)",
        };
        const end = incoming ? {
          opacity: 1, transform: "translateY(0px)", clipPath: "inset(-8px -10px -10px -10px)",
        } : {
          opacity: 0, transform: "translateY(-30px)", clipPath: "inset(-8px -10px -10px -10px)",
        };
        return child.animate([start, end], {
          duration: incoming ? (heading ? 1000 : 850) : 500,
          delay: incoming ? 420 + Math.min(childIndex, 5) * 55 : 0,
          easing: incoming ? "cubic-bezier(.22,.61,.36,1)" : "cubic-bezier(.4,0,.6,1)",
          fill: "both",
        });
      });
      running.set(panel, animations);
      Promise.all(animations.map((animation) => animation.finished)).then(() => {
        if (running.get(panel) !== animations) return;
        if (panelIndex !== selected) panel.removeAttribute("data-text-visible");
        stop(panel);
      }, () => {});
    });
    if (fit && !first && !immediate) {
      const height = container.getBoundingClientRect().height;
      if (Math.abs(height - previousHeight) > 1) {
        sizing = container.animate([{ height: `${previousHeight}px` }, { height: `${height}px` }], {
          duration: 850, easing: "cubic-bezier(.22,.61,.36,1)",
        });
      }
    }
  }

  return {
    show,
    dispose() {
      sizing?.cancel();
      panels.forEach((panel) => {
        stop(panel);
        panel.removeAttribute("data-text-visible");
        panel.removeAttribute("data-text-current");
      });
    },
  };
}
