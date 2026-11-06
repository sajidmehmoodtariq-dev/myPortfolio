const sourceRoot = "https://github.com/sajidmehmoodtariq-dev/PGC-DHA/blob/c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8";

export const systemLayers = [
  {
    id: "react",
    title: "React client",
    summary: "The enquiry view composes the list and report entry point. It uses permission checks to decide which interface sections to show.",
    source: `${sourceRoot}/client/src/components/enquiry/EnquiryManagementContainer.jsx`,
  },
  {
    id: "state",
    title: "Application state",
    summary: "The enquiry hook tracks cached results, loading and refresh states, and errors. It requests comprehensive data and date-based breakdowns from the API.",
    source: `${sourceRoot}/client/src/hooks/useEnquiryData.js`,
  },
  {
    id: "api",
    title: "Express API",
    summary: "The server mounts the enquiry router under /api/enquiries. The comprehensive-data endpoint assembles the data used by the enquiry view.",
    source: `${sourceRoot}/server/routes/principalEnquiries.js`,
  },
  {
    id: "auth",
    title: "Authentication and authorization",
    summary: "The enquiry router runs session validation before handling requests. The shared middleware attaches the authenticated user and session. For example, the student route applies a separate IT role check to registration and progression writes.",
    source: `${sourceRoot}/server/routes/students.js`,
    relatedSource: `${sourceRoot}/server/middleware/auth.js`,
  },
  {
    id: "data",
    title: "MongoDB data layer",
    summary: "Mongoose defines user records, including student fields and references to class records. The enquiry router uses queries and aggregation pipelines to turn stored records into filtered summaries.",
    source: `${sourceRoot}/server/models/User.js`,
  },
  {
    id: "reports",
    title: "Reporting",
    summary: "The enquiry report is behind a reporting permission in the client. Its report view fetches filtered records and offers PDF and spreadsheet exports.",
    source: `${sourceRoot}/client/src/pages/admin/StudentReport.jsx`,
    relatedSource: `${sourceRoot}/client/src/components/reports/EnquiryReports.jsx`,
  },
] as const;
