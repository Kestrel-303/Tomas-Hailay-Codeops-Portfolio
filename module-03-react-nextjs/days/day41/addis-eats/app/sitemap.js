import { dishes } from "../lib/dishes";
import { absoluteUrl } from "../lib/site";

// /sitemap.xml, generated from the dish data: a new dish in lib/dishes.js is listed on the next
// build. Only public pages are here. Left out on purpose:
// - private, need signing in: /checkout, /orders, /orders/[id], /kitchen
// - personal or not worth indexing: /cart, /sign-in
export default function sitemap() {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/home"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/menu"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/search"), changeFrequency: "monthly", priority: 0.4 },
    ...dishes.map((dish) => ({ url: absoluteUrl(`/menu/${dish.id}`), changeFrequency: "monthly", priority: 0.8 })),
  ];
}
