

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp", "image/avif"], // دعم الصور الحديثة
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wjonvtrnuspwxabtrqzz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      // إذا كنت تريد السماح لجميع subdomains لـ Supabase:
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,

};

export default nextConfig