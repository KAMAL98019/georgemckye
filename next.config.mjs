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
