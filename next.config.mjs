/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
