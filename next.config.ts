import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.137.1'],
  async redirects() {
    return [
      {
        source: '/psychometric_test/:path*',
        destination: '/psychometric-test/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
