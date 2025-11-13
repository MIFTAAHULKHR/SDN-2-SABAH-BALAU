// next.config.ts
import type { NextConfig } from "next";

// 1. Impor bundle analyzer
// (Menggunakan 'require' di sini tidak apa-apa untuk file config)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // 2. Tambahkan reactStrictMode
};

// 3. Ekspor config yang sudah dibungkus
export default withBundleAnalyzer(nextConfig);