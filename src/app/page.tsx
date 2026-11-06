import { ExhibitSection } from "@/components/exhibit-section";
import { exhibitSections } from "@/content/sections";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      {exhibitSections.map((section, index) => (
        <ExhibitSection key={section.id} {...section} number={index + 1} />
      ))}
    </main>
  );
}
