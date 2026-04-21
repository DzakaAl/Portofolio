/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Limit parallelism for shared hosting with strict thread/process limits
    workerThreads: false,
    cpus: 1,
  },
  async rewrites() {
    // In production (shared hosting), all API routes are handled by Next.js directly.
    // The fallback proxy to localhost:3001 is only needed in local development
    // if you still run the separate Express backend alongside.
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    return {
      // fallback: runs LAST — after ALL Next.js routes (including dynamic [id] routes).
      fallback: [
        {
          source: "/api/:path((?!auth).*)",
          destination: "http://localhost:3001/:path*",
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
