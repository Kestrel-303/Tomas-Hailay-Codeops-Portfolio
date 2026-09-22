# Addis Eats on Next.js · Layouts and Strategies

**Addis Eats** is a modern Ethiopian restaurant application built with Next.js App Router demonstrating root shell layouts, nested segment layouts with client state persistence across navigation, considered rendering strategies (Static SSG, ISR with revalidate, forced Dynamic SSR), streaming via React Suspense, and full static parameter pre-rendering (`generateStaticParams`).

---

## 🗺️ Application Route & Strategy Map

| URL Route | File Path | Strategy Type | Rationale / Explanation |
| :--- | :--- | :--- | :--- |
| `/` | [`app/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/page.js) | Static (`○`) | Home hero section pre-rendered at build time. |
| `/menu` | [`app/menu/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/menu/page.js) | ISR (`○` `1m`) | Marked static with a 60s revalidation window (`export const revalidate = 60`). |
| `/menu/[id]` | [`app/menu/[id]/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/menu/%5Bid%5D/page.js) | SSG (`●`) | Statically pre-rendered for all dish IDs via `generateStaticParams`. |
| `/cart` | [`app/cart/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/cart/page.js) | Dynamic / Client (`ƒ`) | Food order summary and total price breakdown. |
| `/checkout` | [`app/checkout/page.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/checkout/page.js) | Dynamic (`ƒ`) | Forced dynamic (`export const dynamic = 'force-dynamic'`) to process live order reads/headers per request. |
| *Not Found* | [`app/not-found.js`](file:///c:/Users/Dani/Tomas-Hailay-Gidey-SQ7/module-03-react-nextjs/mini-projects/mini-project-10/app/not-found.js) | Static (`○`) | Custom 404 screen for unmatched routes or `notFound()` triggers. |

---

## 🏗️ Layout Architecture & Features

- **Root Layout (`app/layout.js`)**: Global application shell owning `html` & `body`, global styles, header navigation, and footer.
- **Nested Menu Layout (`app/menu/layout.js`)**: Split layout with an instant sidebar on the left. Contains `SidebarWidget.jsx` proving state persistence (counter and table note) across client navigations between `/menu` and `/menu/[id]`.
- **Streamed Menu Content (`app/menu/page.js`)**: Uses `<Suspense fallback={<DishListSkeleton />}>` to stream dish list content behind the instantly rendered sidebar.
- **Rendering Strategy Documentation (`STRATEGY.md`)**: Complete matrix detailing route strategies and justifications.

---

## 📊 Verified Production Build Output

Below is the exact output from running `npm run build`:

```text
▲ Next.js 16.3.5 (Turbopack)
✓ Running next.config.mjs took 65ms

  Creating an optimized production build ...
✓ Compiled successfully in 3.9s
  Running TypeScript ...
  Finished TypeScript in 15ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/12) ...
  Generating static pages using 7 workers (3/12) 
  Generating static pages using 7 workers (6/12) 
  Generating static pages using 7 workers (9/12) 
✓ Generating static pages using 7 workers (12/12) in 2.1s
  Finalizing page optimization ...

Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /cart
├ ƒ /checkout
├ ○ /menu                      1m      1y
└   /menu/[id]
  ├ ● /menu/doro-wat
  ├ ● /menu/kitfo
  ├ ● /menu/beyaynetu
  └ ● [+3 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build & Start for production**:
   ```bash
   npm run build
   npm start
   ```

---

## ✅ Requirements Verification Checklist

- [x] **Root Layout**: `app/layout.js` owns `html` & `body`, imports `globals.css`, renders header and footer.
- [x] **Nested Menu Layout**: `app/menu/layout.js` renders a sidebar with `SidebarWidget.jsx` that maintains state across navigations.
- [x] **ISR Menu Route**: `app/menu/page.js` uses `export const revalidate = 60;`, marked static in build with 1m revalidate.
- [x] **SSG Dish Route**: `app/menu/[id]/page.js` uses `generateStaticParams()` producing pages for all dishes (`● /menu/[id]`).
- [x] **Forced Dynamic Checkout**: `app/checkout/page.js` exports `export const dynamic = 'force-dynamic';` with comment naming read requirements (`ƒ /checkout`).
- [x] **Streaming Menu**: `<Suspense fallback={<DishListSkeleton />}>` streams menu dish cards behind an instantly rendered sidebar.
- [x] **Strategy Documentation**: `STRATEGY.md` documents every route, strategy, and justification.
