"use client";

import { useCallback, type ReactNode } from "react";
import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const wideScene = "(min-width: 64rem) and (min-height: 42rem)";

function prepareVideo(video: HTMLVideoElement, frame: HTMLElement, source: string, fps: number) {
  let progress = 0;
  let attached = false;
  let failed = false;
  let raf = 0;
  let ready = false;
  let pending = false;

  function fallback() {
    failed = true;
    cancelAnimationFrame(raf);
    frame.dataset.videoState = "fallback";
  }

  function schedule() {
    if (!failed && attached && !raf) raf = requestAnimationFrame(sync);
  }

  function showFrame() {
    ready = true;
    frame.dataset.videoState = "ready";
  }

  function sync() {
    raf = 0;
    if (failed || pending || video.seeking ||
      !Number.isFinite(video.duration) || !video.seekable.length) return;

    // Seeking exactly to duration can display the end-of-stream blank frame.
    const lastFrame = Math.max(0, Math.ceil(video.duration * fps - 0.001) - 1);
    const target = Math.round(progress * lastFrame) / fps;
    if (Math.abs(video.currentTime - target) < 0.5 / fps) {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) showFrame();
      return;
    }

    const ranges = video.seekable;
    let seekable = false;
    for (let i = 0; i < ranges.length; i++) {
      if (target >= ranges.start(i) && target < ranges.end(i)) {
        seekable = true;
        break;
      }
    }
    if (!seekable) return;

    try {
      pending = true;
      video.currentTime = target;
    } catch {
      fallback();
    }
  }

  function onSeeked() {
    pending = false;
    if (failed) return;
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) showFrame();
    schedule();
  }

  function onWaiting() {
    if (!failed && ready) frame.dataset.videoState = "buffering";
  }

  const listeners = {
    loadedmetadata: schedule,
    loadeddata: schedule,
    canplay: schedule,
    progress: schedule,
    seeking: onWaiting,
    seeked: onSeeked,
    waiting: onWaiting,
    error: fallback,
  };
  for (const [event, listener] of Object.entries(listeners)) {
    video.addEventListener(event, listener);
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.intersectionRatio >= 0.12)) return;
    observer.disconnect();
    attached = true;
    frame.dataset.videoState = "loading";
    video.preload = "auto";
    video.src = source;
  }, { rootMargin: "0px 0px -18% 0px", threshold: 0.12 });
  observer.observe(frame);

  return {
    update(value: number) {
      progress = value;
      schedule();
    },
    dispose() {
      failed = true;
      observer.disconnect();
      cancelAnimationFrame(raf);
      for (const [event, listener] of Object.entries(listeners)) {
        video.removeEventListener(event, listener);
      }
      delete frame.dataset.videoState;
      if (attached) {
        video.removeAttribute("src");
        video.preload = "none";
        video.load();
      }
    },
  };
}

type ScrollDrivenVideoProps = {
  sceneSelector: string;
  desktopSrc: string;
  compactSrc: string;
  fps: number;
  children: ReactNode;
};

export function ScrollDrivenVideo({
  sceneSelector, desktopSrc, compactSrc, fps, children,
}: ScrollDrivenVideoProps) {
  const setup = useCallback<SceneSetup>((scene, gsap, media) => {
    const frame = scene.querySelector<HTMLElement>("[data-scroll-video]");
    const video = frame?.querySelector("video");
    if (!frame || !video || !("IntersectionObserver" in window) ||
      !video.canPlayType('video/mp4; codecs="avc1.4D401F"')) return;

    media.add({
      all: "all",
      wide: wideScene,
      pinned: `${wideScene} and (prefers-reduced-motion: no-preference)`,
    }, (context) => {
      const wide = Boolean(context.conditions?.wide);
      const pinned = Boolean(context.conditions?.pinned);
      const scrubber = prepareVideo(video, frame, wide ? desktopSrc : compactSrc, fps);
      const sticky = scene.querySelector("[data-scroll-video-sticky]");
      const fitsCompactDwell = () => frame.offsetHeight < window.innerHeight * 0.52;
      const playhead = { progress: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: () => scrubber.update(playhead.progress),
        scrollTrigger: {
          trigger: pinned ? scene : frame,
          start: pinned
            ? () => `top top+=${sticky ? getComputedStyle(sticky).top : "0px"}`
            : () => fitsCompactDwell() ? "bottom 82%" : "top 56%",
          end: pinned ? "bottom bottom" : () => fitsCompactDwell() ? "top 16%" : "bottom 28%",
          scrub: pinned ? 0.14 : true,
        },
      });
      timeline.to(playhead, { progress: 1, duration: pinned ? 0.8 : 0.9 })
        .to({}, { duration: pinned ? 0.2 : 0.1 });
      scrubber.update(playhead.progress);

      return scrubber.dispose;
    });
  }, [desktopSrc, compactSrc, fps]);
  const marker = useSceneMotion(sceneSelector, setup, "[data-scroll-video]", true);

  return (
    <div className="scroll-driven-video" data-scroll-video>
      {children}
      <video muted playsInline preload="none" disablePictureInPicture aria-hidden="true" tabIndex={-1} />
      <span ref={marker} hidden />
    </div>
  );
}
