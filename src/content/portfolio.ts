type Claim = {
  text: string;
  status: "owner-supplied" | "readme-documented" | "source-verified" | "pending";
  source: string;
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
