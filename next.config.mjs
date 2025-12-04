/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images:{
    domains: ['images.unsplash.com'],
     remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
      port: '',
      pathname: '/path/**',
    },
  ],
  },
  reactCompiler: true,
};

export default nextConfig;
