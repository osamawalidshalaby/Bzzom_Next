

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wjonvtrnuspwxabtrqzz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // إذا كنت تريد السماح لجميع subdomains لـ Supabase:
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

export default nextConfig