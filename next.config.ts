//C:\estrella\next.config.ts
/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const baseConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

const withPwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPwaConfig(baseConfig);
