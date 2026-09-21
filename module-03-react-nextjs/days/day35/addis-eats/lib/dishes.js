export const dishes = [
  { id: "doro-wot", name: "Doro Wot", category: "Main", price: 12 },
  { id: "tibs", name: "Tibs", category: "Main", price: 11 },
  { id: "shiro", name: "Shiro", category: "Vegetarian", price: 9 },
  { id: "kitfo", name: "Kitfo", category: "Main", price: 13 },
  { id: "injera", name: "Injera", category: "Side", price: 3 },
];

export function getDishById(id) {
  return dishes.find((dish) => dish.id === id);
}
