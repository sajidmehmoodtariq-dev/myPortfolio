import { ExhibitSection } from "@/components/exhibit-section";
import { Hero } from "@/components/hero/hero";
import { SiteHeader } from "@/components/site-header";
import { InsideSystem } from "@/components/system/inside-system";
import { SelectedWork } from "@/components/work/selected-work";
import { exhibitSections } from "@/content/sections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <SelectedWork />
        <InsideSystem />
        {exhibitSections.slice(3).map((section, index) => (
          <ExhibitSection key={section.id} {...section} number={index + 4} />
        ))}
      </main>
    </>
  );
}
