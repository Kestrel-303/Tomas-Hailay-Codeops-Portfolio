import { getDishById } from "./dishes";

// Same rules as the Day 33 checkout form, now enforced on the server.
export const areaOptions = ["Bole", "Kazanchis", "Megenagna", "Piassa"];

export function validateOrder(input) {
  const body = input && typeof input === "object" ? input : {};
  const fieldErrors = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const area = typeof body.area === "string" ? body.area : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";

  if (!name) {
    fieldErrors.name = "Name is required.";
  }

  if (!phone) {
    fieldErrors.phone = "Phone is required.";
  } else if (!/^\d{10}$/.test(phone)) {
    fieldErrors.phone = "Phone must be 10 digits.";
  }

  if (!area || !areaOptions.includes(area)) {
    fieldErrors.area = "Please select a delivery area.";
  }

  // Prices come from the server's own menu, never from the client.
  const items = [];
  if (!Array.isArray(body.items) || body.items.length === 0) {
    fieldErrors.items = "Your cart is empty.";
  } else {
    for (const item of body.items) {
      const dish = getDishById(item?.id);
      const quantity = Number(item?.quantity);
      if (!dish || !Number.isInteger(quantity) || quantity < 1) {
        fieldErrors.items = "Your cart contains an invalid item.";
        break;
      }
      items.push({ id: dish.id, name: dish.name, price: dish.price, quantity });
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return { success: true, data: { name, phone, area, notes, items } };
}
