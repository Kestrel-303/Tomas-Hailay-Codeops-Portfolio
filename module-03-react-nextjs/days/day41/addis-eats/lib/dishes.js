// `summary` is one sentence about the dish. The dish page shows it, and its metadata, Open Graph
// card and JSON-LD all read it from this same object, so they can't disagree with the page.
export const dishes = [
  { id: "doro-wot", name: "Doro Wot", category: "Main", price: 12, summary: "Chicken slow-simmered in a deep red berbere and onion sauce, served with a hard-boiled egg." },
  { id: "tibs", name: "Tibs", category: "Main", price: 11, summary: "Cubes of beef seared with onion, rosemary and green chili, brought to the table sizzling." },
  { id: "shiro", name: "Shiro", category: "Vegetarian", price: 9, summary: "A smooth, spiced chickpea-flour stew, simmered until thick and velvety." },
  { id: "kitfo", name: "Kitfo", category: "Main", price: 13, summary: "Finely minced lean beef warmed in spiced butter with mitmita chili." },
  { id: "injera", name: "Injera", category: "Side", price: 3, summary: "Soft, spongy teff flatbread with a gentle sour tang, made for scooping up every stew." },
  { id: "misir-wot", name: "Misir Wot", category: "Vegetarian", price: 8, summary: "Red lentils cooked down with berbere and onion into a rich, spicy stew." },
  { id: "gomen", name: "Gomen", category: "Vegetarian", price: 7, summary: "Collard greens braised with garlic, ginger and a little green chili." },
  { id: "key-wot", name: "Key Wot", category: "Main", price: 12, summary: "Beef braised slowly in a dark, fiery berbere sauce until it falls apart." },
  { id: "firfir", name: "Firfir", category: "Main", price: 9, summary: "Torn injera tossed in a spiced berbere and butter sauce, a classic Addis breakfast." },
  { id: "atkilt-wot", name: "Atkilt Wot", category: "Vegetarian", price: 8, summary: "Cabbage, carrots and potatoes braised gently with turmeric and garlic." },
  { id: "beyaynetu", name: "Beyaynetu", category: "Vegetarian", price: 14, summary: "A colourful vegetarian platter of several stews and salads served together on injera." },
  { id: "ayib", name: "Ayib", category: "Side", price: 4, summary: "Fresh, mild Ethiopian cottage cheese that cools down the spicier dishes." },
  { id: "kolo", name: "Kolo", category: "Side", price: 3, summary: "Roasted barley and peanuts, a crunchy snack traditionally served with coffee." },
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
