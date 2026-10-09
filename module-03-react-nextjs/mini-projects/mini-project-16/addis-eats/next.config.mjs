/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image only resizes remote images from hosts listed here. Anything else is refused,
    // so the /_next/image endpoint can't be used to proxy arbitrary URLs through our server.
    // The one remote image is the home hero from Wikimedia Commons, pinned to its own folder.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/9/98/**',
      },
    ],
  },
};

export default nextConfig;
