/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/tools/orderimport/:path*',
        destination: 'https://fazenda-order-import.vercel.app/:path*',
      },
    ];
  },
}

export default nextConfig
