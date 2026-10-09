export const dishes = [
  { id: "doro-wot", name: "Doro Wot", category: "Main", price: 12 },
  { id: "tibs", name: "Tibs", category: "Main", price: 11 },
  { id: "shiro", name: "Shiro", category: "Vegetarian", price: 9 },
  { id: "kitfo", name: "Kitfo", category: "Main", price: 13 },
  { id: "injera", name: "Injera", category: "Side", price: 3 },
  { id: "misir-wot", name: "Misir Wot", category: "Vegetarian", price: 8 },
  { id: "gomen", name: "Gomen", category: "Vegetarian", price: 7 },
  { id: "key-wot", name: "Key Wot", category: "Main", price: 12 },
  { id: "firfir", name: "Firfir", category: "Main", price: 9 },
  { id: "atkilt-wot", name: "Atkilt Wot", category: "Vegetarian", price: 8 },
  { id: "beyaynetu", name: "Beyaynetu", category: "Vegetarian", price: 14 },
  { id: "ayib", name: "Ayib", category: "Side", price: 4 },
  { id: "kolo", name: "Kolo", category: "Side", price: 3 },
];

// Every dish photo in public/images/dishes is 1200×900. next/image needs the real size to
// reserve the box before the file arrives, and to pick which resized copy to serve.
export const DISH_PHOTO = { width: 1200, height: 900 };

// The card grid is `minmax(220px, 1fr)` inside a 1040px page, so a card photo is roughly:
// one column on phones, two up to ~760px, three up to the page max, then ~200px each.
export const DISH_CARD_SIZES =
  "(max-width: 504px) calc(100vw - 4.5rem), (max-width: 760px) calc(50vw - 3rem), (max-width: 1040px) calc(33vw - 3rem), 200px";

export async function getDishes() {
  return dishes;
}

export function getDishById(id) {
  return dishes.find((dish) => dish.id === id);
}

export const SEARCH_PAGE_SIZE = 3;

// Case-insensitive match on name or category, then one page of the matches.
export function searchDishes(term, page = 1) {
  const needle = term.trim().toLowerCase();
  const matches = dishes.filter(
    (dish) => dish.name.toLowerCase().includes(needle) || dish.category.toLowerCase().includes(needle)
  );

  const totalPages = Math.max(1, Math.ceil(matches.length / SEARCH_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * SEARCH_PAGE_SIZE;

  return {
    items: matches.slice(start, start + SEARCH_PAGE_SIZE),
    page: currentPage,
    totalPages,
    total: matches.length,
  };
}
