import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.137.1'],
  // One high setting for every photo: the usual 75 made faces look soft, and above 84 only adds weight.
  images: { qualities: [84] },
  async headers() {
    return [
      { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      // A week: to change a photo straight away, give the new file a new name.
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
    ];
  },
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

