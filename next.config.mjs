/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/potracker',
        destination: '/potracker.html',
      },
      {
        source: '/shopifyimport',
        destination: 'https://fazenda-order-import.vercel.app/',
      },
      {
        source: '/shopifyimport/:path*',
        destination: 'https://fazenda-order-import.vercel.app/:path*',
      },
    ];
  },
}

export default nextConfig
