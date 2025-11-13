/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    domains: ["images.unsplash.com"],
    unoptimized: true,
  },
};

export default nextConfig;
