import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    const certificateHeaders = ["cs50x.pdf", "cs50ai.pdf"].map((file) => ({
      source: `/credentials/${file}`,
      headers: [{ key: "Content-Disposition", value: `attachment; filename="${file}"` }],
    }));
    return [
      ...(process.env.VERCEL_ENV === "preview" ? [{
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      }] : []),
      ...certificateHeaders,
    ];
  },
};

export default config;
