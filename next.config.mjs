/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

if (!basePath && isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
  if (repo && !repo.endsWith(".github.io")) {
    basePath = `/${repo}`;
  }
}

const nextConfig = {
  output: "export",
  basePath: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
