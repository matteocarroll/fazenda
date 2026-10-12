/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The old domain. Send every path to the same path on fazenda.com so
      // existing links keep working and the two domains stop competing in search.
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(www\\.)?fazendacompany\\.com' }],
        destination: 'https://www.fazenda.com/:path*',
        permanent: true,
      },
      {
        source: '/thursdays',
        destination: '/events',
        permanent: true,
      },
    ];
  },
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
