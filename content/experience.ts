type ExperienceEntry = {
  id: string;
  role: string;
  tenure: string;
  work: readonly string[];
  evidence: { kind: "owner-supplied"; reference: string };
};

export const experience = [
  {
    id: "freelance-software-development",
    role: "Freelance software developer",
    tenure: "Approximately two years as of the Milestone 01 brief",
    work: ["Institutional software", "Client applications", "Developer tools", "AI projects"],
    evidence: { kind: "owner-supplied", reference: "Portfolio Milestone 01 brief" },
  },
] as const satisfies readonly ExperienceEntry[];
import { credentials } from "./credentials";
import { portfolioIdentity } from "./identity";
import type { projects } from "./projects";


export const journey: readonly { label: string; detail: string; year?: number }[] = [
  { label: "Computer science foundations", detail: "BS Computer Science at UET Lahore, New Campus (KSK)." },
  { label: "CS50x completed", detail: "Introduction to computer science.", year: credentials[0].year },
  { label: "Full-stack client work", detail: "Freelance client software." },
  { label: "CS50 AI completed", detail: "Artificial intelligence with Python.", year: credentials[1].year },
  { label: "Independent engineering", detail: "Intelligent systems and developer tools." },
];

type Capability = {
  name: string;
  example: string;
  project: (typeof projects)[number]["slug"];
  source?: string;
};

export const capabilities: readonly Capability[] = [
  { name: "Frontend engineering", example: "Role-aware reporting interfaces", project: "pgc-dha" },
  { name: "Backend systems", example: "Express routes and permission-aware workflows", project: "pgc-dha" },
  { name: "AI/ML", example: "Semantic resume-to-job matching", project: "resumeiq" },
  { name: "Mobile development", example: "Local reminders and Android scheduling", project: "nudge" },
  { name: "Developer and systems tooling", example: "Execution capture and source diffs", project: "ledger" },
  {
    name: "Infrastructure", example: "Database connection reuse in the API", project: "pgc-dha",
    source: `${portfolioIdentity.github}/PGC-DHA/blob/c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8/server/server.js#L45-L96`,
  },
];
