type Claim = {
  text: string;
  status: "owner-supplied" | "readme-documented" | "source-verified" | "pending";
  source: string;
};

type ProjectRecord = {
  name: string;
  slug: string;
  repository: string;
  claims: readonly Claim[];
};

const github = "https://github.com/sajidmehmoodtariq-dev";

export const portfolioIdentity = {
  name: "Sajid Mehmood Tariq",
  role: "Software Engineer / Full-Stack Developer",
  location: "Lahore, Pakistan",
  education: "BS Computer Science, UET Lahore, New Campus (KSK)",
  github,
  linkedin: "https://www.linkedin.com/in/sajid-mehmood-tariq/",
  source: "Prompt 01 owner brief",
  status: "owner-supplied",
  claims: [
    {
      text: "Approximately two years of freelance software development experience.",
      status: "owner-supplied",
      source: "Prompt 01 owner brief",
    },
    {
      text: "Built production software for institutional and international clients.",
      status: "owner-supplied",
      source: "Prompt 01 owner brief",
    },
    {
      text: "Completed Harvard CS50x and is expanding into machine learning and applied AI.",
      status: "owner-supplied",
      source: "Prompt 01 owner brief",
    },
    {
      text: "Experience with React, Next.js, Node.js, Express, MongoDB, Python, FastAPI, React Native, C++, Rust, and developer tooling.",
      status: "owner-supplied",
      source: "Prompt 01 owner brief",
    },
  ] satisfies readonly Claim[],
} as const;

export const projects = [
  {
    name: "PGC-DHA",
    slug: "pgc-dha",
    repository: `${github}/PGC-DHA`,
    claims: [
      {
        text: "School management system.",
        status: "readme-documented",
        source: `${github}/PGC-DHA/blob/main/README.md`,
      },
      {
        text: "The API entry point mounts student and class routes and connects to MongoDB through Mongoose.",
        status: "source-verified",
        source: `${github}/PGC-DHA/blob/main/server/server.js`,
      },
    ],
  },
  {
    name: "ResumeIQ",
    slug: "resumeiq",
    repository: `${github}/ResumeIQ`,
    claims: [
      {
        text: "The README describes a resume analysis and authoring toolkit under the name ResumeMatcher.",
        status: "readme-documented",
        source: `${github}/ResumeIQ/blob/main/README.md`,
      },
      {
        text: "Confirm the intended public name and verify the resume workflow in code.",
        status: "pending",
        source: `${github}/ResumeIQ`,
      },
    ],
  },
  {
    name: "Ledger",
    slug: "ledger",
    repository: `${github}/Ledger`,
    claims: [
      {
        text: "The VS Code extension entry point registers a tree view for previous runs.",
        status: "source-verified",
        source: `${github}/Ledger/blob/main/src/extension.ts`,
      },
    ],
  },
  {
    name: "Folio",
    slug: "folio",
    repository: `${github}/Folio`,
    claims: [
      {
        text: "The README describes a local PDF question-answering tool with page citations.",
        status: "readme-documented",
        source: `${github}/Folio/blob/main/README.md`,
      },
    ],
  },
  {
    name: "Nudge",
    slug: "nudge",
    repository: `${github}/Nudge`,
    claims: [
      {
        text: "The React Native app entry point renders a stack navigator.",
        status: "source-verified",
        source: `${github}/Nudge/blob/main/App.tsx`,
      },
      {
        text: "Verify the product workflow and candidate screenshots.",
        status: "pending",
        source: `${github}/Nudge`,
      },
    ],
  },
] as const satisfies readonly ProjectRecord[];
