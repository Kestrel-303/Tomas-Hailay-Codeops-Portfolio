import { absoluteUrl } from "../lib/site";

// /robots.txt: keep crawlers out of the cart and checkout (as the exercise asks), plus the other
// signed-in pages and the API, and point them at the sitemap.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/orders", "/kitchen", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
