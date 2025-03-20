/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // Enables static export (Fixes "next export" issue)
  images: {
    unoptimized: true, // Fixes image optimization issue in static exports
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anfgdvhvikwdfqiigzkp.supabase.co",
        pathname: "/storage/v1/object/public/nft-images/**",
      },
    ],
  },
};

export default nextConfig;
