import { portfolioIdentity } from "@/content/portfolio";
import { HeroAssembly } from "./hero-assembly";
import { HeroMotion } from "./hero-motion";
import { SignalSpline } from "./signal-spline";
import "./hero.css";

export function Hero() {
  return (
    <section id="intro" className="hero" aria-labelledby="intro-heading">
      <div className="hero-field" data-hero-field aria-hidden="true" />
      <SignalSpline
        layer="rear"
        motion="entrance"
        desktop="M 0 864 C 142 865 245 881 404 796 S 620 658 686 584 C 745 518 763 390 818 293 C 854 230 916 225 928 297 C 942 376 875 488 811 560"
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
        desktop="M 811 560 C 758 620 685 665 674 626 C 663 589 706 551 750 552 C 791 553 806 603 819 661"
        mobile="M 725 795 C 635 829 483 873 441 852 C 400 831 502 806 605 824 C 674 836 722 865 743 887"
      />
      <SignalSpline
        layer="handoff"
        motion="scroll"
        desktop="M 819 661 C 840 755 850 842 831 911 C 824 938 818 963 818 1000"
        mobile="M 743 887 C 761 906 781 931 773 952 C 768 969 760 979 760 1000"
      />
      <div className="exhibit-container hero-register" data-hero-marker aria-hidden="true">
        <span><i /> 01 / Introduction</span>
        <span>01 — 07</span>
      </div>
      <HeroMotion />
    </section>
  );
}
