import { ExhibitSection } from "@/components/exhibit-section";
import { Hero } from "@/components/hero/hero";
import { SiteHeader } from "@/components/site-header";
import { exhibitSections } from "@/content/sections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        {exhibitSections.slice(1).map((section, index) => (
          <ExhibitSection key={section.id} {...section} number={index + 2} />
        ))}
      </main>
    </>
  );
}
