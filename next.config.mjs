/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com', // Allow Firebase Storage images
      'testing-five-kohl.vercel.app',    // Allow your Vercel domain
    ],
  },
}

module.exports = nextConfig;
