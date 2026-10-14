import type { NextConfig } from "next";

// Set when the site is served from a sub-path, e.g. "/portfolio" on GitHub
// Pages. The deploy workflow supplies it; local builds leave it empty.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  // Exposed to the client for asset URLs Next does not prefix itself.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default config;
