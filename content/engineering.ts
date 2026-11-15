import { portfolioIdentity } from "./identity";
import { labStops, requestStops } from "./storyboard";

const pgc = `${portfolioIdentity.github}/PGC-DHA/blob/c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8`;
const report = `${pgc}/client/src/pages/admin/StudentReport.jsx`;
const users = `${pgc}/server/routes/users.js`;

type Exhibit = {
  label: string;
  title: string;
  note: string;
  detail: string;
  source: string;
};

export const requestJourney = {
  "trace-interface": {
    label: "Interface", title: "Apply a report filter", note: "REACT / STUDENT REPORT",
    detail: "The enquiry report’s permission guard controls whether the React report appears. Applying a date range updates the filter state used to build its query.",
    source: `${pgc}/client/src/components/reports/EnquiryReports.jsx`,
  },
  "trace-request": {
    label: "Request", title: "Build the GET request", note: "GET /api/users",
    detail: "StudentReport sends the date filters with role=Student. The shared Axios client adds the /api prefix and attaches a bearer token when one is available.",
    source: `${report}#L96-L181`,
  },
  "trace-api": {
    label: "API", title: "Enter the users router", note: "EXPRESS / ROUTER MOUNT",
    detail: "Express ensures the MongoDB connection is ready, then dispatches /api/users to the users router. The router runs authentication before its handler builds the query.",
    source: `${pgc}/server/server.js#L45-L103`,
  },
  "trace-auth": {
    label: "Auth", title: "Verify the session", note: "JWT / SESSION VALIDATION",
    detail: "The middleware verifies the access token and checks the session. A valid session attaches the user to the request. A failed check returns 401 before the report query runs.",
    source: `${pgc}/server/middleware/auth.js#L6-L57`,
  },
  "trace-data": {
    label: "Data", title: "Read matching records", note: "MONGOOSE / USER.FIND",
    detail: "The handler turns query parameters into a MongoDB filter, sorts and pages the matching users, and counts them. Its projection excludes passwords and password-reset fields.",
    source: `${users}#L219-L242`,
  },
  "trace-response": {
    label: "Response", title: "Render the report", note: "JSON / REACT STATE",
    detail: "The API returns a JSON success envelope. React reads the user rows into report state and clears its loading state. A failed request clears the rows and shows an error.",
    source: `${report}#L144-L176`,
  },
} satisfies Record<(typeof requestStops)[number]["id"], Exhibit>;

export const labExhibits = {
  "lab-structura": {
    label: "Structura", title: "Structura", note: "IN DEVELOPMENT / C++ MEMORY",
    detail: "A C++ teaching tool that turns parsed code into playback steps. The memory view follows stack frames, heap allocations, and pointer references as the program advances.",
    source: `${portfolioIdentity.github}/Structura/blob/27277740702c8150c3679185e27f605a0d6a16ef/README.md`,
  },
  "lab-inkly": {
    label: "Inkly", title: "Inkly", note: "PROTOTYPE / PUBLISHING WORKFLOW",
    detail: "A MERN publishing project that models draft, review, published, and archived states. The article model sets a publication timestamp when a piece moves to published.",
    source: `${portfolioIdentity.github}/Inkly/blob/f1a0708a18c7643246dba8bb5b44975c3ea9d103/server/models/ArticleModel.js`,
  },
  "lab-micro-vlm": {
    label: "Micro-VLM", title: "Micro-VLM", note: "PROTOTYPE / MULTIMODAL MODEL",
    detail: "A PyTorch experiment that combines image patches and byte-level text tokens in one model. Its source exposes the tokenizer and vision encoder for inspection.",
    source: `${portfolioIdentity.github}/micro-vlm-from-scratch/blob/e92d2699a777de01ef5bbedc8f736bfe8c4880a1/src/model/vision.py`,
  },
} satisfies Record<(typeof labStops)[number]["id"], Exhibit>;

export const requestExhibits = requestStops.map(({ id }) => ({ id, ...requestJourney[id] }));
export const labModules = labStops.map(({ id }) => ({ id, ...labExhibits[id] }));
