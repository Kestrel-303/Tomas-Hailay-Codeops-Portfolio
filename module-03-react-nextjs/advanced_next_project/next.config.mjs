/** @type {import('next').NextConfig} */
// Every image is served from public/, so next/image needs no remotePatterns: /_next/image
// refuses every remote URL, and can't be used to proxy arbitrary images through this server.
const nextConfig = {};

export default nextConfig;
