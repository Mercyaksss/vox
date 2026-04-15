/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: '*.pinata.cloud',
        pathname: '/ipfs/**',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // ← Add this block
  sassOptions: {
    silenceDeprecations: ['import'],
  },
};

export default nextConfig;