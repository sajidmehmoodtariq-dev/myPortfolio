import { portfolioIdentity } from "./identity";

type EvidenceLink = { label: string; href: string };

type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  repository: string;
  stack: readonly string[];
  exhibit: string;
  evidence: readonly EvidenceLink[];
};

function repository(name: string, revision: string) {
  const url = `${portfolioIdentity.github}/${name}`;
  return {
    url,
    file: (label: string, path: string): EvidenceLink => ({ label, href: `${url}/blob/${revision}/${path}` }),
  };
}

const pgc = repository("PGC-DHA", "c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8");
const resume = repository("ResumeIQ", "04ae2266f8f078303216ba50e87444e589b75614");
const ledger = repository("Ledger", "6798f0bb10462b01615354f0b6db995cb65f86d4");
const folio = repository("Folio", "e5af889183ceccba8ad87820b6a3709395894047");
const nudge = repository("Nudge", "7fc459413a355a97f5c296c37a153f00db92f9bb");

export const projects = [
  {
    slug: "pgc-dha",
    name: "PGC-DHA",
    category: "Institutional management system",
    summary: "A school administration application for admissions enquiries, student records, class assignments, and role-based reporting.",
    repository: pgc.url,
    stack: ["React", "Express", "MongoDB"],
    exhibit: "Illustrative admissions and reporting workflow",
    evidence: [
      pgc.file("Project scope and developer credit", "README.md"),
      pgc.file("Enquiry reporting permission", "client/src/components/reports/EnquiryReports.jsx"),
      pgc.file("Enquiry states", "client/src/constants/enquiryLevels.js"),
      pgc.file("Express API and MongoDB entry point", "server/server.js"),
      { label: "Reporting filter implementation", href: `${pgc.url}/commit/46860560fbb9c6b0a92ccfc1a12604c5b3dfa0ee` },
    ],
  },
  {
    slug: "resumeiq",
    name: "ResumeIQ",
    category: "AI resume workbench",
    summary: "Compares a resume with a job description using semantic matching and supports language-model feedback and PDF export.",
    repository: resume.url,
    stack: ["Python", "FastAPI", "React", "FastEmbed", "LLM adapters"],
    exhibit: "Illustrative resume, job description, and analysis",
    evidence: [
      resume.file("Project documentation under the ResumeMatcher name", "README.md"),
      resume.file("Semantic scorer", "backend/services/scorer.py"),
      resume.file("Resume intake and scoring API", "backend/routers/resume.py"),
      resume.file("PDF generation route", "backend/routers/pdf.py"),
      resume.file("Scoring regression examples", "backend/tests/test_scoring.py"),
      { label: "Grounded scoring revision", href: `${resume.url}/commit/04ae2266f8f078303216ba50e87444e589b75614` },
    ],
  },
  {
    slug: "ledger",
    name: "Ledger",
    category: "VS Code developer tool",
    summary: "Captures terminal runs, associates them with hashed code snapshots, and compares changes in source and output.",
    repository: ledger.url,
    stack: ["TypeScript", "VS Code API", "SHA-256"],
    exhibit: "Illustrative editor, terminal capture, and diff",
    evidence: [
      ledger.file("Terminal capture and snapshot design", "README.md"),
      ledger.file("Source and output comparison panel", "src/runDiffPanel.ts"),
      ledger.file("Shell event capture", "src/terminalCapture.ts"),
      ledger.file("Source snapshot and SHA-256", "src/codeSnapshot.ts"),
      ledger.file("Comparison tests", "src/test/runDiff.test.ts"),
      { label: "Extension implementation revision", href: `${ledger.url}/commit/61d08b9609a5f5168f06924be8a3c3feebae5fa0` },
    ],
  },
  {
    slug: "folio",
    name: "Folio",
    category: "Local PDF question answering",
    summary: "Retrieves passages from a PDF and uses a local language model to answer questions with page references and a supporting quote check.",
    repository: folio.url,
    stack: ["Python", "FAISS", "llama.cpp"],
    exhibit: "Illustrative PDF retrieval and cited answer",
    evidence: [
      folio.file("Project overview", "README.md"),
      folio.file("Local answering, page references, and quote matching", "src/answer.py"),
      folio.file("Page extraction", "src/extract.py"),
      folio.file("Retrieval pipeline", "src/retrieval.py"),
      folio.file("Quote verifier", "src/verify.py"),
    ],
  },
  {
    slug: "nudge",
    name: "Nudge",
    category: "React Native reminder application",
    summary: "Stores reminders locally and schedules device notifications.",
    repository: nudge.url,
    stack: ["React Native", "SQLite", "Notifee"],
    exhibit: "Repository Android capture with a labeled lifecycle",
    evidence: [
      nudge.file("React Native project setup", "README.md"),
      nudge.file("Local reminder storage", "src/reminders/reminderService.ts"),
      nudge.file("Notification scheduling", "src/notifications/notificationService.ts"),
      nudge.file("Android reminder capture", "src/assets/screenshots/notification.jpg"),
      nudge.file("Android reminder entry capture", "src/assets/screenshots/setting_a_reminder.jpg"),
      nudge.file("SQLite schema and connection", "src/reminders/db.ts"),
      nudge.file("Snooze and dismiss actions", "src/screens/AlarmScreen.tsx"),
      { label: "Reminder and alarm implementation revision", href: `${nudge.url}/commit/75fa91821b4ad479b290f882316c40186ace96f2` },
    ],
  },
] as const satisfies readonly Project[];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
