"use client";

import { useRef } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Case studies", href: "/work" },
  { label: "About", href: "#about" },
  { label: "Notes", href: "#notes" },
  { label: "Contact", href: "#contact" },
] as const;

export function SiteHeader({ onHomepage = true, showNotes = false }: { onHomepage?: boolean; showNotes?: boolean }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);
  const home = onHomepage ? "" : "/";
  const visibleLinks = showNotes ? links : links.filter(({ href }) => href !== "#notes");

  return (
    <header className="site-header">
      <div className="exhibit-container header-inner">
        <a className="site-brand" href={`${home}#intro`} aria-label="SMT. The Engineering Exhibit">
          <span className="brand-mark" aria-hidden="true">SMT<span>.</span></span>
          <span className="brand-caption">The Engineering Exhibit</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {visibleLinks.map(({ label, href }) => <a key={href} href={href.startsWith("#") ? `${home}${href}` : href}>{label}</a>)}
        </nav>
        <details
          className="mobile-nav"
          ref={menu}
          onBlur={(event) => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
              event.currentTarget.open = false;
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu.current?.open) {
              event.preventDefault();
              menu.current.open = false;
              toggle.current?.focus();
            }
          }}
        >
          <summary ref={toggle}>
            Menu
            <span className="menu-glyph" aria-hidden="true" />
          </summary>
          <nav aria-label="Primary" data-lenis-prevent-wheel>
            {visibleLinks.map(({ label, href }, index) => (
              <a key={href} href={href.startsWith("#") ? `${home}${href}` : href} onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                if (menu.current) menu.current.open = false;
                if (onHomepage && href.startsWith("#")) document.getElementById(href.slice(1))?.focus({ preventScroll: true });
              }}>
                <span aria-hidden="true">0{index + 1}</span>{label}
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
