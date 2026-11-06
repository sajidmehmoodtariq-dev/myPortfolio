import { portfolioIdentity } from "./portfolio";

export type ProjectSlug = "pgc-dha" | "resumeiq" | "ledger" | "folio" | "nudge";

type Source = { label: string; href: string };

export type Project = {
  slug: ProjectSlug;
  name: string;
  category: string;
  summary: string;
  focus: string;
  tools: readonly string[];
  repository: string;
  problem: string;
  context: string;
  role: string;
  solution: string;
  architecture: string;
  decisions: string;
  outcome: string;
  sources: readonly Source[];
  visual: { kind: "demo" | "screenshot"; description: string; source?: Source };
};

function repository(name: string, revision: string) {
  const url = `${portfolioIdentity.github}/${name}`;
  return {
    url,
    source: (label: string, path: string): Source => ({
      label,
      href: `${url}/blob/${revision}/${path}`,
    }),
  };
}

const pgc = repository("PGC-DHA", "c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8");
const resume = repository("ResumeIQ", "04ae2266f8f078303216ba50e87444e589b75614");
const ledger = repository("Ledger", "6798f0bb10462b01615354f0b6db995cb65f86d4");
const folio = repository("Folio", "e5af889183ceccba8ad87820b6a3709395894047");
const nudge = repository("Nudge", "7fc459413a355a97f5c296c37a153f00db92f9bb");

export const projects: readonly Project[] = [
  {
    slug: "pgc-dha",
    name: "PGC-DHA",
    category: "Institutional management system",
    summary: "An institutional workspace for following admissions enquiries, assigning students to classes, and reviewing reports.",
    focus: "Role-based access and staged admissions workflows",
    tools: ["React", "Express", "MongoDB"],
    repository: pgc.url,
    problem: "Admissions staff need to track how an enquiry progresses while academic and administrative staff work with class assignments and reports.",
    context: "The project documentation describes separate workflows for reception, institute administration, IT, teaching, and coordination. Student and admissions records require careful access control.",
    role: "The repository credits Sajid Mehmood Tariq as developer. The division of implementation and deployment responsibilities is pending confirmation.",
    solution: "The application organizes enquiries by status and provides student records, class assignments, and a permission-gated reporting area.",
    architecture: "A React client talks to an Express API backed by MongoDB through Mongoose. Authenticated endpoints handle class and student operations, and the enquiry report is mounted behind a reporting permission check.",
    decisions: "The client defines enquiry statuses centrally. Access checks also run on the API, where class mutations check the caller’s role after authentication.",
    outcome: "The reviewed source contains the enquiry status model, authenticated student and class endpoints, and the enquiry report entry point. Deployment status, adoption, and operational impact are pending confirmation.",
    sources: [
      pgc.source("Project documentation and developer credit", "README.md"),
      pgc.source("Enquiry status definitions", "client/src/constants/enquiryLevels.js"),
      pgc.source("Enquiry report permission check", "client/src/components/reports/EnquiryReports.jsx"),
      pgc.source("API and MongoDB entry point", "server/server.js"),
      pgc.source("Class route access checks", "server/routes/classes.js"),
      pgc.source("Student workflow endpoints", "server/routes/students.js"),
    ],
    visual: { kind: "demo", description: "Admissions stages and role views, illustrated with synthetic records." },
  },
  {
    slug: "resumeiq",
    name: "ResumeIQ",
    category: "AI-powered career toolkit",
    summary: "A resume workbench that compares a candidate’s experience with a job description, offers model-assisted feedback, and exports a PDF.",
    focus: "Semantic matching, evidence in experience, and PDF generation",
    tools: ["React", "FastAPI", "FastEmbed", "ReportLab"],
    repository: resume.url,
    problem: "A resume may describe relevant work in different terms from a job listing. A useful comparison needs to surface that relationship and make gaps understandable.",
    context: "The repository documentation calls the toolkit ResumeMatcher. It accepts PDF or pasted resume text and keeps scoring, optional model feedback, and PDF export as separate steps.",
    role: "The repository provides implementation evidence. Sajid’s individual contribution and release responsibilities are pending confirmation.",
    solution: "The analysis flow reports semantic fit, skill coverage, and experience quality. Separate endpoints provide language-model feedback and render downloadable resume PDFs.",
    architecture: "A React frontend calls a FastAPI backend. The scorer extracts text, embeds it with FastEmbed and a BGE model, and uses cosine similarity for semantic comparisons. Model adapters include Gemini. ReportLab generates the PDF.",
    decisions: "The scoring logic distinguishes skills mentioned in work experience from skills listed without supporting context. PDF export can run independently of model feedback.",
    outcome: "The repository contains upload and score endpoints, the embedding-based scorer, provider adapters, and the PDF generation endpoint. Scoring accuracy and job-search outcomes are pending confirmation.",
    sources: [
      resume.source("Product documentation", "README.md"),
      resume.source("Upload and scoring routes", "backend/routers/resume.py"),
      resume.source("Semantic scorer and skill grounding", "backend/services/scorer.py"),
      resume.source("Language-model adapters", "backend/llm_feedback.py"),
      resume.source("PDF renderer", "backend/pdf_generator.py"),
    ],
    visual: { kind: "demo", description: "A synthetic resume and job-description comparison illustrating the scoring signals." },
  },
  {
    slug: "ledger",
    name: "Ledger",
    category: "VS Code developer tool",
    summary: "A VS Code extension that records terminal runs so developers can revisit the output and compare the code that produced it.",
    focus: "Execution capture, SHA-256 snapshots, and run comparison",
    tools: ["VS Code API", "TypeScript", "SHA-256"],
    repository: ledger.url,
    problem: "When output lives only in terminal scrollback, it can be hard to tell which version of a file produced a particular result.",
    context: "The extension works within a VS Code workspace. Automatic capture uses terminal shell integration and applies a command filter to limit noise.",
    role: "The repository provides implementation evidence. Sajid’s individual contribution and distribution responsibilities are pending confirmation.",
    solution: "Ledger connects captured command output and exit status to a code snapshot when one is available. A run history and diff panel let developers compare past results.",
    architecture: "Terminal event handlers collect output and capture file context. The snapshot helper hashes normalized text with SHA-256, VS Code workspace state stores bounded history, and the diff panel compares code and stdout.",
    decisions: "The extension keeps run history scoped to the workspace and caps stored records. Code and output have separate diffs so a source change can be read alongside a change in behavior.",
    outcome: "The reviewed source contains terminal capture, file hashing, workspace history, and a run comparison view. Marketplace adoption and usage outcomes are pending confirmation.",
    sources: [
      ledger.source("Extension entry point", "src/extension.ts"),
      ledger.source("Terminal shell capture", "src/terminalCapture.ts"),
      ledger.source("Snapshot hashing and line comparison", "src/codeSnapshot.ts"),
      ledger.source("Workspace history storage", "src/storage.ts"),
      ledger.source("Code and output diff panel", "src/runDiffPanel.ts"),
    ],
    visual: { kind: "demo", description: "Two synthetic runs illustrating code snapshots and output comparison." },
  },
  {
    slug: "folio",
    name: "Folio",
    category: "Offline document question answering",
    summary: "A local PDF question-answering pipeline that traces answers and supporting excerpts back to specific pages.",
    focus: "Local retrieval, page provenance, and source-quote checks",
    tools: ["Python", "FAISS", "llama.cpp"],
    repository: folio.url,
    problem: "A reader asking a question about a long PDF needs a way to trace the answer back to the original page and inspect the evidence.",
    context: "The reviewed implementation is a Python pipeline that loads local model weights and processes extracted PDF text. Offline inference assumes the needed models and dependencies are already available.",
    role: "The repository provides implementation evidence. Sajid’s individual contribution and release scope are pending confirmation.",
    solution: "Folio retrieves relevant passages, supplies them to a local language model, and returns an answer with page references. A second pass proposes a quote for comparison with the source.",
    architecture: "The pipeline extracts and chunks PDF pages, embeds the chunks, and retrieves candidates with FAISS before reranking. The answerer uses llama.cpp and preserves page numbers through the verification step.",
    decisions: "Answer generation and quote checking run separately. Quote verification compares the proposed text with retrieved passages and returns the matching source sentence and page when it finds a match.",
    outcome: "The source implements retrieval, local generation, and page-aware quote checking. Answer accuracy, supported document coverage, and end-user results are pending confirmation.",
    sources: [
      folio.source("Retrieval and reranking pipeline", "src/retrieval.py"),
      folio.source("Embedding and FAISS indexing", "src/embed_store.py"),
      folio.source("Local answering and page references", "src/answer.py"),
      folio.source("Source quote verification", "src/verify.py"),
    ],
    visual: { kind: "demo", description: "An illustrative answer linked to an exact passage from an original sample document." },
  },
  {
    slug: "nudge",
    name: "Nudge",
    category: "React Native reminder application",
    summary: "A mobile reminder app that parses reminder text, stores tasks locally, and schedules device notifications.",
    focus: "Reminder input, local persistence, and notification scheduling",
    tools: ["React Native", "SQLite", "Notifee"],
    repository: nudge.url,
    problem: "A quick reminder needs to capture the user’s intent, schedule a time, and present an action when the reminder is due.",
    context: "The repository includes React Native navigation, an input sheet, a reminder parser, and Android notification permission handling. Device-wide behavior and distribution status are pending confirmation.",
    role: "The repository provides implementation evidence. Sajid’s individual contribution and store release responsibilities are pending confirmation.",
    solution: "Nudge parses reminder input, keeps upcoming and completed tasks in local storage, and schedules notifications on the device.",
    architecture: "The React Native app coordinates input and navigation. SQLite holds reminder records, and Notifee manages timestamp-triggered notifications and cancellation.",
    decisions: "The reminder record and the scheduled notification are distinct. The service stores a notification ID so the matching trigger can be managed when reminder state changes.",
    outcome: "The source shows local persistence and notification scheduling. The repository screenshot shows the due-reminder screen with snooze and dismiss actions. Device coverage and delivery reliability are pending confirmation.",
    sources: [
      nudge.source("Input and app navigation", "App.tsx"),
      nudge.source("SQLite schema", "src/reminders/db.ts"),
      nudge.source("Reminder lifecycle", "src/reminders/reminderService.ts"),
      nudge.source("Notification permissions and triggers", "src/notifications/notificationService.ts"),
    ],
    visual: {
      kind: "screenshot",
      description: "Nudge’s Android due-reminder screen with snooze and dismiss actions.",
      source: nudge.source("Original Android screenshot", "src/assets/screenshots/notification.jpg"),
    },
  },
];

export const clientProject = {
  name: "Client Job Portal",
  category: "ServiceM8-integrated recruitment platform",
  focus: "ServiceM8 integration, OAuth, and role-based recruitment workflows",
  status: "Public case study pending",
} as const;
