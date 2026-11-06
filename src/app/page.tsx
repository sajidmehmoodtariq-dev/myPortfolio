import { Finale } from "@/components/finale/finale";
import { Hero } from "@/components/hero/hero";
import { SiteHeader } from "@/components/site-header";
import { InsideSystem } from "@/components/system/inside-system";
import { SelectedWork } from "@/components/work/selected-work";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <SelectedWork />
        <InsideSystem />
        <Finale />
      </main>
    </>
  );
}
