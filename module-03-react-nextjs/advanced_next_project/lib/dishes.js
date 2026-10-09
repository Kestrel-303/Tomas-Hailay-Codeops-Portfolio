export const DISHES = [
  {
    id: 'doro-wat',
    name: 'Doro Wat (Traditional Chicken Stew)',
    amharicName: 'ዶሮ ወጥ',
    category: 'Signature',
    price: 450,
    priceFormatted: '450 ETB',
    spiceLevel: 'Spicy 🌶️🌶️🌶️',
    isFasting: false,
    rating: 4.9,
    prepTime: '25 min',
    description: 'The iconic Ethiopian national dish. Tender chicken leg slow-simmered in a rich, berbere-infused onion gravy, accompanied by hard-boiled eggs infused with spice.',
    ingredients: ['Free-range Chicken', 'Berbere Spice', 'Niter Kibbeh (Spiced Butter)', 'Hard-boiled Eggs', 'Red Onions', 'Garlic & Ginger', 'Injera'],
    image: '🍗',
    popular: true,
  },
  {
    id: 'kitfo',
    name: 'Special Kitfo',
    amharicName: 'ክትፎ',
    category: 'Signature',
    price: 480,
    priceFormatted: '480 ETB',
    spiceLevel: 'Medium-Spicy 🌶️🌶️',
    isFasting: false,
    rating: 4.95,
    prepTime: '15 min',
    description: 'Freshly minced prime lean beef warmed with infused niter kibbeh (clarified spiced butter) and authentic mitmita spice. Served with house-made ayib (cottage cheese) and gomen.',
    ingredients: ['Prime Lean Beef', 'Mitmita Spice', 'Niter Kibbeh', 'Ayib (Cheese)', 'Collard Greens', 'Kocho / Injera'],
    image: '🥩',
    popular: true,
  },
  {
    id: 'beyaynetu',
    name: 'Yetsom Beyaynetu (Veggie Combo)',
    amharicName: 'የጾም በያይነቱ',
    category: 'Fasting / Veggie',
    price: 320,
    priceFormatted: '320 ETB',
    spiceLevel: 'Mild to Medium 🌶️',
    isFasting: true,
    rating: 4.85,
    prepTime: '10 min',
    description: 'A vibrant, colorful feast of vegan dishes arranged on soft teff injera. Features Shiro, Misir Wat (red lentils), Kik Alicha (yellow split peas), Gomen, and Beet salad.',
    ingredients: ['Misir Wat (Spicy Lentils)', 'Kik Alicha (Yellow Peas)', 'Shiro', 'Gomen (Collards)', 'Key Sir (Beetroot)', 'Fasolia (Green Beans)', 'Teff Injera'],
    image: '🥗',
    popular: true,
  },
  {
    id: 'shiro',
    name: 'Shiro Tegabere',
    amharicName: 'ሽሮ ተጋቢኖ',
    category: 'Fasting / Veggie',
    price: 260,
    priceFormatted: '260 ETB',
    spiceLevel: 'Medium 🌶️🌶️',
    isFasting: true,
    rating: 4.75,
    prepTime: '15 min',
    description: 'Velvety, rich chickpea flour stew seasoned with berbere, garlic, and sacred spices, served bubbling hot in a clay vessel (ebet/denesh).',
    ingredients: ['Sun-dried Chickpea Flour', 'Berbere', 'Garlic & Shallots', 'Vegetable Oil', 'Fresh Jalapeño', 'Injera'],
    image: '🍲',
    popular: false,
  },
  {
    id: 'special-tibs',
    name: 'Special Beef Tibs',
    amharicName: 'ስፔሻል ጥብስ',
    category: 'Tibs',
    price: 420,
    priceFormatted: '420 ETB',
    spiceLevel: 'Medium 🌶️🌶️',
    isFasting: false,
    rating: 4.88,
    prepTime: '20 min',
    description: 'Tender tenderloin beef cubes flash-sautéed in a hot pan with sliced onions, fresh rosemary sprigs, green jalapeños, and aromatic kibbeh.',
    ingredients: ['Beef Tenderloin', 'Fresh Rosemary', 'Green Jalapeño', 'Onions', 'Niter Kibbeh', 'Garlic', 'Teff Injera'],
    image: '🥘',
    popular: true,
  },
  {
    id: 'gomen-besiga',
    name: 'Gomen Be Siga',
    amharicName: 'ጎመን በሥጋ',
    category: 'Signature',
    price: 380,
    priceFormatted: '380 ETB',
    spiceLevel: 'Mild 🌶️',
    isFasting: false,
    rating: 4.7,
    prepTime: '20 min',
    description: 'Finely chopped collard greens stewed with bone-in beef chunks, garlic, ginger, and spiced butter, creating a comforting savory dish.',
    ingredients: ['Fresh Collard Greens', 'Beef Chunks', 'Garlic & Ginger', 'Niter Kibbeh', 'Cardamom', 'Injera'],
    image: '🥬',
    popular: false,
  },
  {
    id: 'misir-wat',
    name: 'Misir Wat',
    amharicName: 'ምስር ወጥ',
    category: 'Fasting / Veggie',
    price: 240,
    priceFormatted: '240 ETB',
    spiceLevel: 'Spicy 🌶️🌶️🌶️',
    isFasting: true,
    rating: 4.72,
    prepTime: '15 min',
    description: 'Split red lentils simmered low and slow in a deep berbere and onion base until thick, glossy and fiery.',
    ingredients: ['Red Lentils', 'Berbere', 'Red Onions', 'Garlic & Ginger', 'Vegetable Oil', 'Injera'],
    image: '🫘',
    popular: false,
  },
  {
    id: 'kik-alicha',
    name: 'Kik Alicha',
    amharicName: 'ክክ አልጫ',
    category: 'Fasting / Veggie',
    price: 220,
    priceFormatted: '220 ETB',
    spiceLevel: 'Mild',
    isFasting: true,
    rating: 4.6,
    prepTime: '15 min',
    description: 'A gentle, golden split-pea stew with turmeric, garlic and green pepper, the mild counterpoint to every spicy wat.',
    ingredients: ['Yellow Split Peas', 'Turmeric', 'Garlic', 'Green Pepper', 'Onions', 'Injera'],
    image: '🥣',
    popular: false,
  },
  {
    id: 'awaze-tibs',
    name: 'Awaze Tibs',
    amharicName: 'አዋዜ ጥብስ',
    category: 'Tibs',
    price: 440,
    priceFormatted: '440 ETB',
    spiceLevel: 'Spicy 🌶️🌶️🌶️',
    isFasting: false,
    rating: 4.82,
    prepTime: '20 min',
    description: 'Beef cubes seared hot and tossed in awaze, a punchy chili paste of berbere, tej honey wine and garlic.',
    ingredients: ['Beef', 'Awaze Paste', 'Onions', 'Green Jalapeño', 'Niter Kibbeh', 'Injera'],
    image: '🌶️',
    popular: false,
  },
  {
    id: 'lamb-tibs',
    name: 'Yebeg Tibs (Lamb)',
    amharicName: 'የበግ ጥብስ',
    category: 'Tibs',
    price: 460,
    priceFormatted: '460 ETB',
    spiceLevel: 'Medium 🌶️🌶️',
    isFasting: false,
    rating: 4.8,
    prepTime: '22 min',
    description: 'Tender lamb pieces pan-fried with rosemary, onions and fresh chili, finished with a spoon of spiced butter.',
    ingredients: ['Lamb', 'Fresh Rosemary', 'Onions', 'Green Chili', 'Niter Kibbeh', 'Injera'],
    image: '🍖',
    popular: false,
  },
  {
    id: 'key-wat',
    name: 'Key Wat (Beef Stew)',
    amharicName: 'ቀይ ወጥ',
    category: 'Signature',
    price: 400,
    priceFormatted: '400 ETB',
    spiceLevel: 'Spicy 🌶️🌶️🌶️',
    isFasting: false,
    rating: 4.78,
    prepTime: '25 min',
    description: 'Beef slow-cooked in a dark red berbere sauce with plenty of onions and kibbeh until it falls apart.',
    ingredients: ['Beef', 'Berbere', 'Red Onions', 'Niter Kibbeh', 'Garlic', 'Injera'],
    image: '🍛',
    popular: false,
  },
  {
    id: 'firfir',
    name: 'Firfir',
    amharicName: 'ፍርፍር',
    category: 'Signature',
    price: 280,
    priceFormatted: '280 ETB',
    spiceLevel: 'Medium 🌶️🌶️',
    isFasting: false,
    rating: 4.65,
    prepTime: '12 min',
    description: 'Torn injera soaked in a spiced berbere and kibbeh sauce, the classic Addis breakfast.',
    ingredients: ['Injera', 'Berbere', 'Niter Kibbeh', 'Onions', 'Garlic'],
    image: '🍳',
    popular: false,
  }
];

export function getAllDishes() {
  return DISHES;
}

export function getDishById(id) {
  return DISHES.find((d) => d.id === id);
}

export function getCategories() {
  return ['All', 'Signature', 'Fasting / Veggie', 'Tibs'];
}

export const MENU_PAGE_SIZE = 4;

// One page of the menu, optionally filtered by category. Out-of-range pages are clamped.
export function getMenuPage(category = 'All', page = 1) {
  const matches = category === 'All' ? DISHES : DISHES.filter((dish) => dish.category === category);
  const totalPages = Math.max(1, Math.ceil(matches.length / MENU_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * MENU_PAGE_SIZE;

  return {
    category,
    items: matches.slice(start, start + MENU_PAGE_SIZE),
    page: currentPage,
    totalPages,
    total: matches.length,
  };
}

// Case-insensitive match on the English name, Amharic name or category.
export function searchDishes(term) {
  const needle = term.trim().toLowerCase();
  const items = DISHES.filter((dish) =>
    [dish.name, dish.amharicName, dish.category].some((field) => field.toLowerCase().includes(needle)),
  );
  // The response echoes the query, so the UI can always label results with the term that produced them.
  return { q: term.trim(), items, total: items.length };
}
