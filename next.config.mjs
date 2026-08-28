/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // Product image uploads can include several files per submission
      // (each capped at 1MB by the app itself), so the combined multipart
      // body needs more headroom than Next's 1mb default.
      bodySizeLimit: "20mb",
    },
    // Static generation forks one Prisma connection pool per build worker;
    // shared hosting's low MySQL connection cap gets exceeded with the
    // default worker count, so keep generation serial.
    cpus: 1,
  },
};

export default nextConfig;
