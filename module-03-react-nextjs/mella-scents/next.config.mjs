/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The 15 catalogue photos are served from public/products (cdn.dummyjson.com answered with
    // 522 errors and sends no-store, so hotlinking it would leave broken photos). This entry only
    // covers a product added to the API after the snapshot, and it's pinned to the fragrance
    // folder so /_next/image can't be used to proxy anything else.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.dummyjson.com', pathname: '/product-images/fragrances/**' }],
  },
};

export default nextConfig;
