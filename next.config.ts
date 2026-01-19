import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pyyunvvonfrbpprziuvq.supabase.co', // আপনার সুপাবেস প্রজেক্টের হোস্টনেম
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;