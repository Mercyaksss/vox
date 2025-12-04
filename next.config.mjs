/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ← Your existing ones (kept exactly as you had them)
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

      // ← NEW ONES – these fix the Pinata error
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
      // Optional but recommended – many projects use these gateways too
      {
        protocol: 'https',
        hostname: '*.pinata.cloud', // covers cloudflare-ipfs.com, etc.
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;eslint: { 
  ignoreDuringBuilds: true, 
}, 
