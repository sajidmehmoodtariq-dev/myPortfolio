import { portfolioIdentity } from "@/content/portfolio";
import { HeroAssembly } from "./hero-assembly";
import { HeroMotion } from "./hero-motion";
import { SignalSpline } from "./signal-spline";
import "./hero.css";

export function Hero({ chapterCount }: { chapterCount: string }) {
  return (
    <section id="intro" className="hero" aria-labelledby="intro-heading">
      <div className="hero-field" data-hero-field aria-hidden="true" />
      <div className="exhibit-container hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow" data-hero-marker><span />Sajid Mehmood Tariq / Software Engineer</p>
          <h1 id="intro-heading">
            <span data-hero-line>Software that goes</span>{" "}
            <span data-hero-line>beyond the interface.</span>
          </h1>
          <p className="hero-description" data-hero-detail>
            I design and build thoughtful digital products, from production platforms to intelligent developer tools.
          </p>
          <div className="hero-actions" data-hero-detail>
            <a className="hero-primary" href="#work">
              Explore Work
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v11m-4-4 4 4 4-4" /></svg>
            </a>
            <a className="hero-secondary" href={portfolioIdentity.github}>
              GitHub
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7" /></svg>
            </a>
          </div>
        </div>
        <HeroAssembly />
      </div>
      <SignalSpline
        layer="front"
        motion="entrance"
        desktop="M 0 864 C 155 865 244 881 404 796 S 655 717 754 670 C 819 639 860 606 898 602 C 945 597 933 662 890 703 C 866 727 832 724 819 756"
        mobile="M 0 876 C 151 879 278 843 420 800 C 536 765 628 752 738 749 C 832 747 855 779 820 821 C 796 851 730 859 743 887"
      />
      <SignalSpline
        layer="handoff"
        motion="scroll"
        desktop="M 819 756 C 795 815 832 874 827 925 C 825 955 818 974 818 1000"
        mobile="M 743 887 C 755 913 781 934 773 952 C 768 969 760 979 760 1000"
      />
      <div className="exhibit-container hero-register" data-hero-marker aria-hidden="true">
        <span><i /> 01 / Introduction</span>
        <span>01 — {chapterCount}</span>
      </div>
      <HeroMotion />
    </section>
  );
}
