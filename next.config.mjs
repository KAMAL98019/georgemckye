/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    // Prisma's query engine binary and sharp's native binary are loaded via
    // dynamic paths that Next's file tracer can miss — force-include them so
    // the standalone bundle actually has them at runtime.
    outputFileTracingIncludes: {
      "/*": ["./node_modules/.prisma/client/**/*", "./node_modules/sharp/**/*"],
    },
    // Limit to 1 CPU during build to prevent MySQL connection exhaustion on shared hosting
    cpus: 1,
    workerThreads: false,
    // Disable client-side Router Cache for dynamic pages (like your admin/shop pages)
    // so that clicking links always fetches fresh data instead of using stale cache.
    staleTimes: {
      dynamic: 0,
    },
  },
  webpack: (config) => {
    // jose's Edge Runtime bundle includes JWE (encrypted-JWT) compression
    // support that this app never exercises (middleware only signs/verifies
    // plain JWTs), but Next's Edge bundler still flags the unused
    // CompressionStream/DecompressionStream usage. Harmless, so silence it.
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/jose\/dist\/webapi\/lib\/deflate\.js/ },
    ];
    return config;
  },
};

export default nextConfig;
