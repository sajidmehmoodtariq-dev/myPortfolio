"use client";

import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const videoSource = "/system/assembly.mp4";
const frameDuration = 1 / 24;
const seekInterval = 80;

function prepareScrubber(video: HTMLVideoElement, frame: HTMLElement) {
  let nearby = false;
  let started = false;
  let failed = false;
  let target = 0;
  let lastSeek = -Infinity;
  let timer: number | undefined;

  function showFrame() {
    if (!failed) frame.dataset.systemReady = "";
  }

  function clearTimer() {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
  }

  function fallback() {
    failed = true;
    clearTimer();
    delete frame.dataset.systemReady;
  }

  function seekLatest() {
    if (failed || !nearby || timer !== undefined || video.seeking ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

    if (Math.abs(video.currentTime - target) < frameDuration / 2) {
      showFrame();
      return;
    }

    const wait = seekInterval - (performance.now() - lastSeek);
    if (wait > 0) {
      timer = window.setTimeout(() => {
        timer = undefined;
        seekLatest();
      }, wait);
      return;
    }

    lastSeek = performance.now();
    try {
      video.currentTime = target;
    } catch {
      fallback();
    }
  }

  function onSeeked() {
    showFrame();
    seekLatest();
  }

  const observer = new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    if (!nearby || failed) return;
    if (!started) {
      started = true;
      video.preload = "auto";
      video.src = videoSource;
    }
    seekLatest();
  }, { rootMargin: "400px 0px" });

  video.addEventListener("loadeddata", seekLatest);
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("error", fallback);
  observer.observe(frame);

  return {
    setTime(seconds: number) {
      target = Math.round(seconds / frameDuration) * frameDuration;
      seekLatest();
    },
    dispose() {
      observer.disconnect();
      fallback();
      video.removeEventListener("loadeddata", seekLatest);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", fallback);
      if (started) {
        video.preload = "none";
        video.removeAttribute("src");
        video.load();
      }
    },
  };
}

const setup: SceneSetup = (system, gsap, media) => {
  media.add("all", () => {
    const explanation = system.querySelector("[data-system-explanation]");
    const intro = explanation?.querySelector(".system-explanation__intro");
    if (explanation && intro) {
      gsap.from(intro, {
        y: 8, ease: "none",
        scrollTrigger: { trigger: explanation, start: "top 90%", end: "top 65%", scrub: true },
      });
    }
    for (const part of system.querySelectorAll("[data-system-scene], [data-system-explanation]")) {
      const draw = gsap.timeline({
        scrollTrigger: { trigger: part, start: "top 70%", end: "bottom 70%", scrub: true },
      });
      draw.fromTo(part.querySelectorAll(".system-signal path"), { strokeDashoffset: 1 }, {
        strokeDashoffset: 0, autoRound: false, ease: "none", duration: 1,
      });
    }
  });

  media.add("(min-width: 64rem) and (min-height: 42rem)", () => {
    const scene = system.querySelector("[data-system-scene]");
    const frame = system.querySelector<HTMLElement>("[data-system-frame]");
    const video = system.querySelector<HTMLVideoElement>("[data-system-video]");
    if (!scene || !frame || !video?.canPlayType('video/mp4; codecs="avc1.4D401F"') ||
      !("IntersectionObserver" in window)) return;

    const scrubber = prepareScrubber(video, frame);
    const playhead = { time: 0 };

    // Stretch the expansion over more scroll distance than the compact opening.
    gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: () => scrubber.setTime(playhead.time),
      scrollTrigger: { trigger: scene, start: "top 80%", end: "bottom 88%", scrub: 0.16 },
    })
      .to(playhead, { time: 0.85, duration: 0.12 })
      .to(playhead, { time: 3.25, duration: 0.46 })
      .to(playhead, { time: 4.75, duration: 0.14 })
      .to(playhead, { time: 6.9, duration: 0.28 });

    return scrubber.dispose;
  });
};

export function SystemMotion() {
  const marker = useSceneMotion(".inside-system", setup, ".inside-system");

  return <span ref={marker} hidden />;
}
