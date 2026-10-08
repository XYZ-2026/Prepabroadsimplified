import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.137.1'],
  async redirects() {
    return [
      {
        source: '/psychometric_test/:path*',
        destination: '/psychometric-test/:path*',
        permanent: true,
      },
      {
        source: '/psychometric-test/sample-report',
        destination: '/sample-report',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

