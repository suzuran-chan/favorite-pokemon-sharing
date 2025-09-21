import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Silence Next.js workspace root warning by pinning tracing root to this project
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
