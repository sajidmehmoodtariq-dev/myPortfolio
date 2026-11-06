import { portfolioIdentity } from "@/content/portfolio";
import { HeroAssembly } from "./hero-assembly";
import { HeroMotion } from "./hero-motion";
import { SignalSpline } from "./signal-spline";
import "./hero.css";

export function Hero({ chapterCount }: { chapterCount: string }) {
  return (
    <section id="intro" className="hero" aria-labelledby="intro-heading">
      <div className="hero-field" data-hero-field aria-hidden="true" />
      <SignalSpline
        layer="rear"
        motion="entrance"
        desktop="M -500 864 H 0 C 142 864 245 881 404 796 S 620 658 686 584 C 745 518 763 390 818 293 C 846 244 892 239 901 299 C 914 402 871 620 810 685"
        mobile="M 0 876 C 157 875 283 835 407 796 C 528 758 662 638 817 635 C 985 632 877 737 725 795"
      />
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
        desktop="M 810 685 C 757 742 688 778 674 742 C 657 698 708 675 752 680 C 791 684 806 718 819 768"
        mobile="M 725 795 C 635 829 483 873 441 852 C 400 831 502 806 605 824 C 674 836 722 865 743 887"
      />
      <SignalSpline
        layer="handoff"
        motion="scroll"
        desktop="M 819 768 C 832 818 838 869 828 918 C 822 945 818 973 818 1000"
        mobile="M 743 887 C 761 906 781 931 773 952 C 768 969 760 979 760 1000"
      />
      <div className="exhibit-container hero-register" data-hero-marker aria-hidden="true">
        <span><i /> 01 / Introduction</span>
        <span>01 — {chapterCount}</span>
      </div>
      <HeroMotion />
    </section>
  );
}
