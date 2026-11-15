import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return ["cs50x.pdf", "cs50ai.pdf"].map((file) => ({
      source: `/credentials/${file}`,
      headers: [{ key: "Content-Disposition", value: `attachment; filename="${file}"` }],
    }));
  },
};

export default config;
