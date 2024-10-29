/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, child_process: false };

    return config;
  },
};

export default nextConfig;
