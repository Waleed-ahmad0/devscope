import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com', 
      'lh3.googleusercontent.com',   
      'platform-lookaside.fbsbx.com', 
      'cdn.discordapp.com',          
    ],
  },
};

export default nextConfig;