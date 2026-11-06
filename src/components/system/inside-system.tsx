import Image from "next/image";
import Link from "next/link";
import { systemLayers } from "@/content/system-architecture";
import { ScrollDrivenVideo } from "./scroll-driven-video";
import { SystemMotion } from "./system-motion";
import "./system.css";

export function InsideSystem() {
  return (
    <section id="system" className="inside-system" aria-labelledby="system-heading" tabIndex={-1}>
      <div className="system-scene" data-system-scene>
        <div className="system-scene__sticky" data-scroll-video-sticky>
          <div className="exhibit-container system-scene__layout">
            <header className="system-intro">
              <p className="system-kicker"><b>PGC-DHA</b> / System anatomy</p>
              <h2 id="system-heading">Inside the system<span aria-hidden="true">.</span></h2>
              <p className="system-intro__statement">How PGC-DHA handles an admissions enquiry.</p>
              <p className="system-intro__body">
                Follow the request from the React view through session checks, the Express API, and MongoDB.
              </p>
              <a className="system-link" href="#system-layers">Trace the request <span aria-hidden="true">↓</span></a>
            </header>

            <figure className="system-figure">
              <div className="system-figure__frame">
                <span className="system-figure__registration" aria-hidden="true">FIG 03 / Exploded assembly</span>
                <ScrollDrivenVideo sceneSelector=".system-scene" desktopSrc="/system/assembly.mp4"
                  compactSrc="/system/assembly-mobile.mp4" fps={24}>
                  <Image
                    src="/system/assembly-opening.webp"
                    width={1120}
                    height={630}
                    unoptimized
                    alt=""
                    className="system-figure__poster"
                  />
                </ScrollDrivenVideo>
              </div>
              <figcaption>
                <strong>Concept render</strong>
                <span>The assembly illustrates how a system separates into layers. The walkthrough below follows the actual PGC-DHA implementation.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div id="system-layers" className="system-explanation" data-system-explanation tabIndex={-1}>
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
              <details key={layer.id} name="pgc-dha-layers">
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
