import { NO_INDEX } from "../../lib/site";

// The cart page is a client component, and client components can't export metadata, so the
// cart's title and description live in this layout. Every visitor's cart is different (it's in
// their browser), so it's kept out of search results.
export const metadata = {
  title: "Your cart",
  description: "The dishes you've picked so far, with quantities you can change and a running total before checkout.",
  robots: NO_INDEX,
};

export default function CartLayout({ children }) {
  return children;
}
