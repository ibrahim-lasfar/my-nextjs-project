import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'

const nextConfig: NextConfig = withNextIntl()({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'mg-zon.vercel.app', // Replace with your actual production domain
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Add localhost for development
      },
    ],
  },
})

export default nextConfig