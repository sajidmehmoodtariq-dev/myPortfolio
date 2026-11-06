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
  const Heading = number === 1 ? "h1" : "h2";
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="exhibit-section">
      <div className="exhibit-container">
        <span aria-hidden="true" className="exhibit-index">
          {String(number).padStart(2, "0")}
        </span>
        <Heading id={headingId}>{title}</Heading>
        {children}
      </div>
    </section>
  );
}
