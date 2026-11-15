import type { projects } from "./projects";

export type ProjectSlug = (typeof projects)[number]["slug"];
type Note = { title: string; detail: string };

type CaseStudy = {
  line: string;
  accent: string;
  problem: string;
  context: string;
  role: string;
  architecture: readonly Note[];
  functionality: readonly Note[];
  decision: Note;
  outcome: Note;
  figure: { type: string; caption: string };
  demo?: { label: string; href: string };
};

export const caseStudies: Record<ProjectSlug, CaseStudy> = {
  "pgc-dha": {
    line: "From first enquiry to class roster.",
    accent: "institution",
    problem: "Admissions work crosses several desks. Reception tracks enquiries, academic staff assign students, and administrators need reports that reflect the same stage and assignment data.",
    context: "The application models multiple institutional roles and a class structure organized by campus, grade, and program. The example here uses an invented record reference and omits student details.",
    role: "I’m the developer credited in the repository. My reporting work added custom date ranges and filters for records that had not advanced to the next stage, with changes to both the React views and the Express routes.",
    architecture: [
      { title: "React workspace", detail: "Role-specific screens expose enquiries, user management, classes, and reports." },
      { title: "Express API", detail: "Separate route groups handle authentication, users, students, and classes. The application uses JWTs for sign-in and permission checks for role-specific work." },
      { title: "MongoDB", detail: "Mongoose models represent institutional records, including users and classes." },
    ],
    functionality: [
      { title: "Track an enquiry", detail: "The successful path distinguishes initial interest, form purchase and return, admission payment, and admission. A separate rejected state records an alternate outcome." },
      { title: "Assign students", detail: "Class assignment supports individual and bulk workflows with grade and program validation." },
      { title: "Scope reporting by role", detail: "The enquiry report uses a permission guard. Reporting views provide filters and export paths for authorized staff." },
    ],
    decision: { title: "Treat stage and access as separate rules", detail: "The enquiry level describes where the record is in admissions. Permissions describe who can act on it or view a report. Keeping these separate lets several roles share the workflow without presenting every role with the same tools." },
    outcome: { title: "One workflow, several views", detail: "The source demonstrates an enquiry model, separate student and class API routes, and a permission-gated reporting view. Together they show how a single admissions process can support both operational work and oversight." },
    figure: { type: "Synthetic workflow", caption: "An illustrative journey through the repository’s enquiry stages. DEMO-014 is a fictional reference." },
  },
  resumeiq: {
    line: "Make the match explainable.",
    accent: "career",
    problem: "Two documents can describe similar work in different terms. A useful comparison has to account for related language while showing where the resume gives specific evidence for a required skill.",
    context: "ResumeIQ accepts text or a PDF and compares it with a job description. The repository calls the application ResumeMatcher. Its match score is an application heuristic for comparing the supplied documents.",
    role: "I revised the scoring engine and its results interface. The pinned scoring revision records the embedding upgrade, grounded skill coverage, experience heuristics, and the explanation for capped scores.",
    architecture: [
      { title: "React workbench", detail: "The frontend collects the resume and job description and displays the component scores and gaps." },
      { title: "FastAPI routes", detail: "Separate routes handle resume intake and comparison, language-model requests, and PDF generation." },
      { title: "Scoring and export services", detail: "FastEmbed supplies BGE embeddings for the scoring path. Optional providers produce suggestions, and ReportLab renders the export." },
    ],
    functionality: [
      { title: "Compare the documents", detail: "The scorer combines semantic similarity, grounded skill coverage, and experience quality when it has the relevant resume sections." },
      { title: "Ask for a rewrite", detail: "Optional model calls produce suggestions or draft prose with a configured provider key. The comparison score comes from the separate scoring path." },
      { title: "Export a PDF", detail: "The PDF route accepts resume text, accepted replacements, and a template. It applies the replacements before rendering the document." },
    ],
    decision: { title: "Reward evidence in context", detail: "Skill mentions in experience or project descriptions carry more weight than list-only mentions. The code also checks for high coverage with thin experience and can cap the score with an explanation." },
    outcome: { title: "Inspect the reason behind the score", detail: "The repository includes scoring tests for inputs such as keyword-heavy resumes. The result exposes component values and cap reasons, giving readers concrete evidence about how the heuristic reached its result." },
    figure: { type: "Illustrative comparison", caption: "Authored resume and job-description excerpts show the two processing paths. No score was computed for these excerpts." },
  },
  ledger: {
    line: "Keep the run beside the code.",
    accent: "terminal",
    problem: "Terminal scrollback preserves output but can lose its connection to the source that produced it. After another edit, it becomes difficult to reconstruct which change altered the result.",
    context: "Ledger runs inside VS Code and listens for shell integration events from the integrated terminal. Its history is scoped to the workspace, and capture depends on shell integration and the command filter.",
    role: "I implemented the VS Code extension, including execution capture, source snapshots, workspace history, and comparison views. The implementation commit and source links show how those pieces connect.",
    architecture: [
      { title: "Shell integration", detail: "VS Code start and end events delimit a run. A command filter excludes routine shell operations by default." },
      { title: "Snapshot and history", detail: "Ledger reads the editor buffer or file, normalizes line endings for SHA-256, and stores source and run output in workspace history." },
      { title: "Tree and comparison views", detail: "The activity view opens past executions. The comparison panel calculates separate diffs for source and recorded output." },
    ],
    functionality: [
      { title: "Capture a run", detail: "Supported executions record the command, output, and exit status, with a source snapshot when the extension resolves a file." },
      { title: "Reopen earlier output", detail: "Workspace storage keeps past runs available after a window reload." },
      { title: "Compare two runs", detail: "Source and output can be compared independently. The extension also offers a native VS Code source diff." },
    ],
    decision: { title: "Store the source alongside the digest", detail: "The SHA-256 digest identifies a normalized text snapshot. Keeping the source makes a diff possible, and keeping the output makes it possible to inspect what changed between the two executions." },
    outcome: { title: "A one-line change with a visible result", detail: "In the controlled Python example, changing the second list item from 2 to 3 changes stdout from 4 to 5 and produces a different SHA-256 digest. The repository’s comparison tests cover the panel separately." },
    figure: { type: "Controlled execution", caption: "Both Python variants were executed for this study. The output and hashes were measured locally. The plate reconstructs the comparison in HTML." },
    demo: { label: "VS Code package and setup", href: "https://github.com/sajidmehmoodtariq-dev/Ledger/blob/6798f0bb10462b01615354f0b6db995cb65f86d4/README.md" },
  },
  folio: {
    line: "Follow the answer back to the page.",
    accent: "document",
    problem: "A fluent answer is difficult to trust if the reader cannot find the underlying passage. PDF question answering needs a way to keep page identity through retrieval and surface the text that supports an answer.",
    context: "Folio runs retrieval and inference on the local machine. Its extraction path works with the PDF text layer, so scans without extractable text need OCR before they can contribute searchable passages.",
    role: "I built the local document-answering pipeline, including page-aware retrieval, local inference, and the quote match that connects a claimed quotation to source text.",
    architecture: [
      { title: "PDF ingestion", detail: "The extractor reads page text and the chunker carries page numbers into overlapping passages." },
      { title: "Local retrieval", detail: "Embeddings and a FAISS index find candidate passages. A local reranker selects context for the question." },
      { title: "Inference and verification", detail: "llama.cpp generates the answer. A quote-matching pass checks a proposed excerpt against the source passages." },
    ],
    functionality: [
      { title: "Index a document", detail: "Search works over extracted passages, with page references preserved alongside chunk text." },
      { title: "Answer with context", detail: "The model receives retrieved passages and page labels with the question." },
      { title: "Inspect verification", detail: "A quote match gives the reader a page and source wording. Weak or absent support can leave the answer unverified." },
    ],
    decision: { title: "Separate generating an answer from checking the quote", detail: "Generation can paraphrase or make mistakes. Comparing the proposed quote with extracted source text gives a narrower, inspectable check. It establishes a passage match, while judging the broader answer still requires reading the evidence." },
    outcome: { title: "Verify a passage against a real page", detail: "The controlled example extracts the original two-page sample and matches the cache sentence on page 1. An unrelated sentence returns no match. This check exercises extraction and quote matching with supplied text." },
    figure: { type: "Verified source passage", caption: "The quote comes from page 1 of the original CC0 sample PDF. The displayed answer is an authored example." },
    demo: { label: "Open the original sample PDF", href: "/work/folio-cache-notes.pdf" },
  },
  nudge: {
    line: "From reminder entry to ringing alarm.",
    accent: "mobile",
    problem: "Typing a reminder is only the start. The application needs to retain the intended time, schedule delivery with the operating system, and make the active alert easy to act on.",
    context: "Nudge is a React Native application. The captures show Android, where notification permission and alarm scheduling affect how the alert is delivered.",
    role: "I implemented reminder entry and the Android alarm experience, including the snooze and dismiss actions. The repository records the reminder UI and alarm management changes together.",
    architecture: [
      { title: "React Native input", detail: "The entry interface takes a reminder and time and passes the structured values into the reminder flow." },
      { title: "SQLite persistence", detail: "The reminder service writes local rows keyed by ID, including the label and scheduled timestamp." },
      { title: "Notifee and alarm screen", detail: "A timestamp trigger schedules the device alert. The alarm screen handles the active notification and its follow-up actions." },
    ],
    functionality: [
      { title: "Create and save", detail: "The reminder survives the entry UI as a record on the device and appears in the local list." },
      { title: "Schedule delivery", detail: "The app requests a platform notification at the stored time using the reminder ID." },
      { title: "Snooze or dismiss", detail: "Snooze schedules the same reminder ten minutes later and updates its stored timestamp. Dismiss stops the sound and cancels the active notification." },
    ],
    decision: { title: "Carry the same ID through the lifecycle", detail: "The reminder ID connects the SQLite row, scheduled alert, and alarm screen. Snoozing can therefore update the displayed time for the existing record while replacing the current alert." },
    outcome: { title: "The two ends of a reminder", detail: "The repository’s Android captures show both reminder entry and the resulting alarm interface. The alarm handler provides the source for what each action does." },
    figure: { type: "Android product captures", caption: "Original repository captures show the reminder entry overlay and the active alarm with Snooze and Dismiss." },
  },
};
