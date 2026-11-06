import type { ReactNode } from "react";

type ExhibitSectionProps = {
  id: string;
  title: string;
  number: number;
  children?: ReactNode;
};

export function ExhibitSection({
  id,
  title,
  number,
  children,
}: ExhibitSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="exhibit-section" tabIndex={-1}>
      <div className="exhibit-container">
        <span aria-hidden="true" className="exhibit-index">
          {String(number).padStart(2, "0")}
        </span>
        <h2 id={headingId}>{title}</h2>
        {children}
      </div>
    </section>
  );
}
