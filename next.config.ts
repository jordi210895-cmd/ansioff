/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  outputFileTracingRoot: process.cwd(),
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
