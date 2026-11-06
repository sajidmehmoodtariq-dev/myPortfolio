import { portfolioIdentity } from "./portfolio";

type Capability = {
  title: string;
  focus: string;
  examples: readonly { tools: readonly string[]; label: string; href?: string }[];
};

export const toolbox: readonly Capability[] = [
  {
    title: "Frontend",
    focus: "Interface systems & motion",
    examples: [
      { tools: ["React", "JavaScript", "Tailwind"], label: "PGC-DHA", href: "/work/pgc-dha" },
      { tools: ["Next.js", "TypeScript", "GSAP"], label: "This exhibit", href: "#intro" },
      { tools: ["Three.js"], label: "Project example pending" },
    ],
  },
  {
    title: "Backend",
    focus: "APIs & application boundaries",
    examples: [
      { tools: ["Node.js", "Express", "REST APIs", "Authentication"], label: "PGC-DHA architecture", href: "#system-layers" },
      { tools: ["Python", "FastAPI"], label: "ResumeIQ", href: "/work/resumeiq" },
    ],
  },
  {
    title: "Data & Infrastructure",
    focus: "Storage & deployment",
    examples: [
      { tools: ["MongoDB", "Vercel"], label: "PGC-DHA", href: "/work/pgc-dha" },
      { tools: ["SQL"], label: "Nudge / SQLite", href: "/work/nudge" },
      { tools: ["Redis", "Linux"], label: "Project examples pending" },
    ],
  },
  {
    title: "Other",
    focus: "Mobile, systems & applied AI",
    examples: [
      { tools: ["React Native"], label: "Nudge", href: "/work/nudge" },
      { tools: ["C++", "Rust"], label: "Structura / C++ visualization and Rust desktop shell", href: `${portfolioIdentity.github}/Structura` },
      { tools: ["Applied AI/ML"], label: "Folio", href: "/work/folio" },
      { tools: ["Developer tooling"], label: "Ledger", href: "/work/ledger" },
    ],
  },
];
