/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Product image uploads can include several files per submission
      // (each capped at 1MB by the app itself), so the combined multipart
      // body needs more headroom than Next's 1mb default.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
