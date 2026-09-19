/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local project images live in /public/images. Remote patterns are allowed so a
    // content editor can point a project "image" field at an external URL if they want.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
