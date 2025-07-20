/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const baseConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "kstcylneoshrkmbhnxmp.supabase.co", // ← tu dominio Supabase aquí
    ],
  },
};

const withPwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPwaConfig(baseConfig);
