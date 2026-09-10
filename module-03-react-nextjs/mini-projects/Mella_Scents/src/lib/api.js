const BASE_URL = "https://dummyjson.com";

export const endpoints = {
  fragrances: `${BASE_URL}/products/category/fragrances?limit=0`,
  fragrance: (id) => `${BASE_URL}/products/${id}`,
};
