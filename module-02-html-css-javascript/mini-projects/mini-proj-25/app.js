// Addis Eats - Food Ordering App
const PHONE_REGEX = /^(?:\+251|0)9\d{8}$/;
const STORAGE_KEY = "addis_eats_cart";

// Application state
const state = {
  dishes: [],
  cart: [],
  search: ""
};

// DOM elements
const menuEl = document.querySelector("#menu");
const cartListEl = document.querySelector("#cart-list");
const cartTotalEl = document.querySelector("#cart-total");
const searchEl = document.querySelector("#search");
const formEl = document.querySelector("#checkout-form");
const formErrorEl = document.querySelector("#form-error");
const confirmationEl = document.querySelector("#order-confirmation");

// Fetch menu from API or local JSON file
async function loadMenu() {
  menuEl.textContent = "Loading menu...";
  try {
    const response = await fetch("menu.json");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    state.dishes = await response.json();
    render();
  } catch (error) {
    menuEl.textContent = "Could not load the menu. Please refresh.";
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

function loadCart() {
  const savedCart = localStorage.getItem(STORAGE_KEY);
  if (savedCart) {
    try {
      state.cart = JSON.parse(savedCart);
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      state.cart = []; // Fallback to an empty cart
    }
  }
}
function calculateTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderMenu() {
  const searchTerm = state.search.toLowerCase();
  const filteredDishes = state.dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm)
  );

  if (filteredDishes.length === 0) {
    menuEl.innerHTML = "<p>No dishes found.</p>";
    return;
  }

  menuEl.innerHTML = filteredDishes
    .map(
      dish => ` 
      <article class="dish-card" data-id="${dish.id}">
        <div>
          <h3>${dish.name}</h3>
          <p class="price">${dish.price} ETB</p>
        </div>
        <button class="add-btn">Add to Order</button>
      </article>
    `
    )
    .join("");
}

function renderCart() {
  if (state.cart.length === 0) {
    cartListEl.innerHTML = "<li>Your cart is empty.</li>";
    cartTotalEl.textContent = "Total: 0 ETB";
    return;
  }

  cartListEl.innerHTML = state.cart
    .map(
      item => `
      <li data-id="${item.id}">
        <div>
          <strong>${item.name}</strong><br />
          <small>${item.price} ETB x ${item.qty}</small>
        </div>
        <button class="remove-btn">Remove</button>
      </li>
    `
    )
    .join("");

  cartTotalEl.textContent = `Total: ${calculateTotal()} ETB`;
}

function render() {
  renderMenu();
  renderCart();
}

function validateCheckout(name, phone) {
  if (!name.trim()) {
    return "Please enter your name.";
  }
  if (!PHONE_REGEX.test(phone.trim())) {
    return "Enter a valid Ethiopian phone (e.g., 0911234567 or +251911234567).";
  }
  if (state.cart.length === 0) {
    return "Your cart is empty.";
  }
  return "";
}

menuEl.addEventListener("click", event => {
  if (!event.target.matches(".add-btn")) return;

  const cardElement = event.target.closest(".dish-card");
  const dishId = Number(cardElement.dataset.id);
  const selectedDish = state.dishes.find(dish => dish.id === dishId);

  const existingCartItem = state.cart.find(item => item.id === dishId);

  if (existingCartItem) {
    existingCartItem.qty += 1;
  } else {
    state.cart.push({ ...selectedDish, qty: 1 });
  }

  saveCart();
  render();
});

cartListEl.addEventListener("click", event => {
  if (!event.target.matches(".remove-btn")) return;

  const listItemElement = event.target.closest("li");
  const dishId = Number(listItemElement.dataset.id);

  state.cart = state.cart.filter(item => item.id !== dishId);

  saveCart();
  render();
});

searchEl.addEventListener("input", event => {
  state.search = event.target.value;
  renderMenu();
});

formEl.addEventListener("submit", event => {
  event.preventDefault();

  const nameValue = document.querySelector("#customer-name").value;
  const phoneValue = document.querySelector("#customer-phone").value;
  const areaValue = document.querySelector("#delivery-area").value;

  const errorMessage = validateCheckout(nameValue, phoneValue);
  formErrorEl.textContent = errorMessage;

  if (errorMessage) return;

  const orderSummary = {
    customer: { name: nameValue, phone: phoneValue, area: areaValue },
    items: state.cart,
    total: calculateTotal(),
    date: new Date().toISOString()
  };

  confirmationEl.textContent = `Thank you, ${orderSummary.customer.name}! Order placed (${orderSummary.total} ETB) delivering to ${orderSummary.customer.area}.`;

  state.cart = [];
  saveCart();
  render();
  formEl.reset();
});

async function init() {
  loadCart();
  await loadMenu();
}

init();