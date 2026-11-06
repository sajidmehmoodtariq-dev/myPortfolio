import Image from "next/image";
import Link from "next/link";
import { systemLayers } from "@/content/system-architecture";
import { SystemMotion } from "./system-motion";
import "./system.css";

function SystemSignal({ segment }: { segment: "scene" | "layers" }) {
  const [wide, compact] = segment === "scene"
    ? [
        "M835 0 C835 170 978 220 978 460 C978 650 978 785 978 850 C978 925 924 935 924 1000",
        "M877 0 C877 70 971 125 971 280 S954 840 954 1000",
      ]
    : [
        "M924 0 C924 290 957 405 957 610 S903 830 903 1000",
        "M954 0 C954 260 971 410 971 620 S940 840 940 1000",
      ];

  return (
    <svg className="system-signal" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="system-signal__wide" d={wide} pathLength="1" />
      <path className="system-signal__compact" d={compact} pathLength="1" />
    </svg>
  );
}

export function InsideSystem() {
  return (
    <section id="system" className="inside-system" aria-labelledby="system-heading" tabIndex={-1}>
      <div className="system-scene" data-system-scene>
        <SystemSignal segment="scene" />
        <div className="system-scene__sticky">
          <div className="exhibit-container system-scene__layout">
            <header className="system-intro">
              <p className="system-kicker"><b>03</b> / System anatomy</p>
              <h2 id="system-heading">Inside the system<span aria-hidden="true">.</span></h2>
              <p className="system-intro__statement">The interface is only the beginning.</p>
              <p className="system-intro__body">
                I trace a request from the view that starts it to the rules and data that shape its response.
                PGC-DHA’s admissions workflow is one example.
              </p>
              <a className="system-link" href="#system-layers">Explore the layers <span aria-hidden="true">↓</span></a>
            </header>

            <figure className="system-figure">
              <div className="system-figure__frame" data-system-frame>
                <span className="system-figure__registration" aria-hidden="true">FIG 03 / Exploded assembly</span>
                <div className="system-figure__media">
                  <picture>
                    <source media="(max-width: 47.99rem)" srcSet="/system/assembly-compact.webp" />
                    <Image
                      src="/system/assembly.webp"
                      width={1280}
                      height={714}
                      unoptimized
                      alt=""
                      className="system-figure__poster"
                    />
                  </picture>
                  <video data-system-video muted playsInline preload="none" disablePictureInPicture aria-hidden="true" tabIndex={-1} />
                </div>
              </div>
              <figcaption>
                <strong>Concept render</strong>
                <span>A compact media stack opens into separate layers and callouts. The PGC-DHA walkthrough is below.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div id="system-layers" className="system-explanation" data-system-explanation tabIndex={-1}>
        <SystemSignal segment="layers" />
        <div className="exhibit-container system-explanation__layout">
          <div className="system-explanation__intro">
            <p className="system-kicker"><b>PGC-DHA</b> / Admissions workflow</p>
            <h3>Trace an enquiry request.</h3>
            <p>
              The React view asks for an enquiry summary. Express validates the session, reads and aggregates
              MongoDB records, and returns data for the view to display.
            </p>
            <ol className="system-flow" aria-label="Enquiry request path">
              <li>React view</li><li>Session check</li><li>MongoDB query</li><li>JSON response</li>
            </ol>
            <Link className="system-link" href="/work/pgc-dha">PGC-DHA case study <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="system-layer-list" role="group" aria-label="Architecture layers">
            {systemLayers.map((layer, index) => (
              <details key={layer.id} name="pgc-dha-layers" open={index === 0}>
                <summary>
                  <span className="system-layer__number" aria-hidden="true">0{index + 1}</span>
                  <span>{layer.title}</span>
                  <span className="system-layer__indicator" aria-hidden="true" />
                </summary>
                <div className="system-layer__body">
                  <p>{layer.summary}</p>
                  <a href={layer.source} aria-label={`Read source for ${layer.title}`}>Read source <span aria-hidden="true">↗</span></a>
                  {"relatedSource" in layer && (
                    <a href={layer.relatedSource} aria-label={`Read related source for ${layer.title}`}>Related source <span aria-hidden="true">↗</span></a>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
      <SystemMotion />
    </section>
  );
}
