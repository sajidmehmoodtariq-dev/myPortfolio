"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Chapter = { id: string; name: string; time: number };

export function Storyboard({ chapters, children }: { chapters: Chapter[]; children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const retry = useRef<(() => void) | null>(null);

  useEffect(() => {
    const element = root.current;
    const mount = canvas.current;
    if (!element || !mount) return;

    let generation = 0;
    let dispose: (() => void) | undefined;

    async function configure() {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      element!.dataset.mode = "loading";

      try {
        const { mountStoryboard } = await import("../motion/storyboard-runtime");
        if (current === generation) dispose = mountStoryboard(element!, mount!, chapters);
      } catch (error) {
        if (current === generation) {
          element!.dataset.mode = "unavailable";
          console.warn("Unable to initialize the SMT Core stage.", error);
        }
      }
    }

    retry.current = () => { void configure(); };
    void configure();
    return () => {
      generation++;
      dispose?.();
      retry.current = null;
    };
  }, [chapters]);

  return (
    <main ref={root} className="storyboard" data-mode="loading" data-chapter="0">
      <div className="studio">
        <header className="masthead">
          <a className="wordmark" href="#arrival" aria-label="The Making of SMT, arrival">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <rect x="0" y="0" width="32" height="32" rx="6" fill="currentColor" />
              <path d="m8 13 8-5 8 5-8 5zM8 17l8 5 8-5m-16 4 8 5 8-5" fill="none" stroke="#f5f4f0" strokeWidth="1.35" strokeLinejoin="round" />
            </svg>
            <span>The Making of <strong>SMT</strong></span>
          </a>
          <nav aria-label="Storyboard chapters">
            {chapters.map(({ id, name }, index) => (
              <a key={id} href={`#${id}`} data-nav={index}><small>0{index + 1}</small> {name}</a>
            ))}
          </nav>
        </header>

        <figure className="stage" aria-label="SMT Core, a modular ceramic and aluminum device">
          <div className="core-surface" ref={canvas} aria-hidden="true" />
          <figcaption className="stage-caption">
            <span>SMT CORE <b>/</b> REV A</span>
            <span><i /> <b data-caption>Assembled</b></span>
          </figcaption>
        </figure>

        <div className="chapters">{children}</div>

        <aside className="mode-notice" aria-label="Storyboard viewing mode">
          <p role="status">The 3D stage is unavailable. The storyboard is shown as text and an illustration.</p>
          <button type="button" onClick={() => retry.current?.()}>Retry 3D stage</button>
        </aside>

        <footer className="register">
          <span className="scroll-label"><i aria-hidden="true">↓</i> SCROLL TO DIRECT</span>
          <div className="rail" aria-hidden="true"><span /><i /><i /><i /></div>
          <span className="register-count"><b data-counter>01</b> / 03</span>
        </footer>
      </div>
    </main>
  );
}
