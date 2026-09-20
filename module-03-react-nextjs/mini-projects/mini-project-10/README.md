# Addis Eats on Next.js

**Addis Eats** is a modern Ethiopian restaurant application built with Next.js App Router demonstrating file-system-driven routing, dynamic route parameters, colocated non-routable components, segment-level error and loading boundaries, custom 404 handling, and standard `next/link` navigation.

---

## 🗺️ Application Route Map

The following table lists every accessible route in the application and its corresponding file system source path:

| URL Route | File Path | Route Type | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | [`app/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/page.js) | Static Route | Home page featuring hero section & popular dish showcase |
| `/menu` | [`app/menu/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/menu/page.js) | Segment Route | Menu page with category filtering and error/loading controls |
| `/menu/[id]` | [`app/menu/[id]/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/menu/%5Bid%5D/page.js) | Dynamic Route | Individual dish detail view (e.g., `/menu/kitfo`, `/menu/doro-wat`) |
| `/cart` | [`app/cart/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/cart/page.js) | Static Route | Food order summary and total price breakdown |
| `/checkout` | [`app/checkout/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/checkout/page.js) | Static Route | Address details & payment options (Telebirr, CBE Birr, Cash) |
| *Not Found / 404* | [`app/not-found.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/not-found.js) | Global 404 | Custom 404 screen for unmatched routes or `notFound()` calls |

---

## 🧩 Colocated Components & Segment UIs (Non-Routable)

| File Path | Description | Routable URL? |
| :--- | :--- | :--- |
| [`app/menu/DishList.jsx`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/menu/DishList.jsx) | Renders dish card grid with prices & details links | ❌ No (`/menu/DishList` returns 404) |
| [`app/menu/CategoryBar.jsx`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/menu/CategoryBar.jsx) | Interactive category tab filter bar | ❌ No (`/menu/CategoryBar` returns 404) |
| [`app/menu/loading.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/menu/loading.js) | Menu segment loading skeleton UI | ❌ Segment loading boundary |
| [`app/menu/error.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/menu/error.js) | Client error boundary (`"use client"`) with reset handler | ❌ Segment error boundary |

---

## 🚀 Running locally

1. **Install dependencies** (if needed):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build and test for production**:
   ```bash
   npm run build
   npm start
   ```

---

## ✅ Verification Checklist

- **Dynamic Route Params**: `app/menu/[id]/page.js` reads dish parameters asynchronously (`const { id } = await params`).
- **Colocation Verification**: Navigating to `/menu/DishList` or `/menu/CategoryBar` correctly triggers the 404 page.
- **Error UI**: Visiting `/menu?simError=true` activates `app/menu/error.js`.
- **404 / Not Found**: Navigating to `/menu/unknown-dish-999` calls `notFound()` and displays `app/not-found.js`.
