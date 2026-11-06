"use client";

import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";
import { credentials, type Credential } from "@/content/credentials";
import { useSceneMotion, type SceneSetup } from "@/lib/use-scene-motion";

const setupEntrance: SceneSetup = (archive, gsap, media) => {
  media.add("all", () => {
    const frame = archive.querySelector(".credential-stage");
    const carrier = archive.querySelector(".credential-carrier");
    if (!frame || !carrier) return;

    const compact = window.matchMedia("(width < 64rem)").matches;
    gsap.from(archive.querySelector("h2"), {
      y: 20, duration: 0.62, ease: "power3.out",
      scrollTrigger: { trigger: archive.querySelector(".credential-intro"), start: "top 90%", once: true },
    });
    gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: frame, start: "top 88%", once: true },
    })
      .from(frame, { opacity: 0.35, duration: 0.55 }, 0)
      .from(carrier, {
        y: compact ? 10 : 24, rotateY: compact ? 0 : -8, rotateX: compact ? 0 : 4,
        scale: compact ? 1 : 0.96, duration: 0.9,
      }, 0.12)
      .from(archive.querySelectorAll("[data-credential-annotation]"), {
        opacity: 0, y: 4, duration: 0.4, stagger: 0.12,
      }, 0.45);
  });
};

function certificateAlt(record: Credential) {
  return `${record.issuer} course certificate for ${record.recipient}, ${record.code}, awarded in ${record.year}. ${record.completion}`;
}

const zoomLabels = ["Fit", "2×", "3×"] as const;

export function CredentialRecords() {
  const [record, setRecord] = useState<Credential>(credentials[0]);
  const [viewing, setViewing] = useState(false);
  const [zoom, setZoom] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLAnchorElement>(null);
  const marker = useSceneMotion("#credentials", setupEntrance, "#credentials");

  function openCertificate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!dialog.current || typeof dialog.current.showModal !== "function") return;

    event.preventDefault();
    setZoom(0);
    setViewing(true);
    dialog.current.showModal();
    close.current?.focus();
  }

  return (
    <>
      <fieldset className="credential-selector">
        <legend className="credential-label">Course records <span aria-hidden="true">/ 02</span></legend>
        {credentials.map((item, index) => (
          <label className="credential-option" key={item.id}>
            <input type="radio" name="credential" value={item.id} checked={item.id === record.id} onChange={() => setRecord(item)} />
            <span className="credential-option__index" aria-hidden="true">0{index + 1}</span>
            <span className="credential-option__code">{item.code}</span>
            <span className="credential-option__year">{item.year}</span>
            <span className="credential-option__mark" aria-hidden="true" />
          </label>
        ))}
      </fieldset>

      <figure className="credential-figure">
        <div className="credential-stage">
          <div className="credential-stage__labels credential-label" data-credential-annotation aria-hidden="true">
            <span>Document plate</span><span>CS50 / Archive</span>
          </div>
          <div className="credential-carrier">
            <div className="credential-mount">
              {credentials.map((item) => (
                <picture className="credential-sheet" key={item.id} data-active={item.id === record.id}>
                  <source media="(min-width: 64rem)" srcSet={item.preview} />
                  <source
                    srcSet={`${item.compactPreview} 720w, ${item.preview} 1440w`}
                    sizes="88vw"
                  />
                  <Image src={item.preview} width={1440} height={1113} alt={item.id === record.id ? certificateAlt(item) : ""} unoptimized />
                </picture>
              ))}
            </div>
          </div>
          <div className="credential-stage__labels credential-label" data-credential-annotation aria-hidden="true">
            <span>Fig. 05 / 0{credentials.indexOf(record) + 1}</span><span>Full page · 01</span>
          </div>
        </div>
        <figcaption><span className="credential-label">Source</span> Original course certificate, shown in full.</figcaption>
      </figure>

      <div className="credential-details">
        <div aria-live="polite" aria-atomic="true">
          <p className="credential-label">{record.issuer} / <time dateTime={String(record.year)}>{record.year}</time></p>
          <h3>{record.title}</h3>
          <p className="credential-details__completion">{record.completion}</p>
        </div>
        <div className="credential-actions">
          <a ref={opener} className="closing-link credential-primary" href={record.pdf} onClick={openCertificate}>
            View full certificate <span aria-hidden="true">↗</span>
          </a>
          <a className="closing-link" href={record.verificationUrl} target="_blank" rel="noopener noreferrer">
            Verify credential <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <dialog
        className="credential-dialog"
        ref={dialog}
        aria-labelledby="credential-dialog-title"
        data-lenis-prevent
        onClose={() => {
          setViewing(false);
          opener.current?.focus({ preventScroll: true });
        }}
      >
        <header className="credential-dialog__header">
          <div>
            <p className="credential-label">{record.issuer} / {record.year}</p>
            <h3 id="credential-dialog-title">{record.code} certificate</h3>
          </div>
          <button type="button" ref={close} className="closing-link" onClick={() => dialog.current?.close()}>Close <span aria-hidden="true">×</span></button>
        </header>
        <div className="credential-dialog__toolbar">
          <div className="credential-zoom" role="group" aria-label="Document zoom">
            {zoomLabels.map((label, index) => (
              <button key={label} type="button" aria-pressed={zoom === index} onClick={() => setZoom(index)}>
                {label}
              </button>
            ))}
          </div>
          <a href={record.pdf} target="_blank" rel="noopener noreferrer" className="closing-link">
            Open original PDF <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="credential-dialog__viewport" tabIndex={0} role="region" aria-label="Certificate document" data-zoom={zoom}>
          {viewing && <Image src={record.inspectionPreview} width={2200} height={1700} alt={certificateAlt(record)} unoptimized loading="eager" />}
        </div>
      </dialog>
      <span ref={marker} hidden />
    </>
  );
}
