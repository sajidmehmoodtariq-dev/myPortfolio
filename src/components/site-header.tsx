"use client";

import { useRef } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Notes", href: "#notes" },
  { label: "Contact", href: "#contact" },
] as const;

export function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);

  return (
    <header className="site-header">
      <div className="exhibit-container header-inner">
        <a className="site-brand" href="#intro" aria-label="SMT, introduction">
          <span className="brand-mark" aria-hidden="true">SMT<span>.</span></span>
          <span className="brand-caption">The Engineering Exhibit</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {links.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <details
          className="mobile-nav"
          ref={menu}
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
          <nav aria-label="Primary">
            {links.map(({ label, href }, index) => (
              <a key={href} href={href} onClick={() => {
                if (menu.current) menu.current.open = false;
                document.getElementById(href.slice(1))?.focus({ preventScroll: true });
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
