# Rendering Strategies & Layout Architecture (`STRATEGY.md`)

This document outlines the rendering strategies and layout architecture for every route in the **Addis Eats** restaurant application.

---

## 🗺️ Route Rendering Strategy Matrix

| Route URL | Source File Path | Rendering Strategy | Build Indicator | One-Line Justification / Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `app/page.js` | **Static (SSG)** | `○` (Static) | Static hero showcase pre-rendered at build time for instant landing performance. |
| `/menu` | `app/menu/page.js` | **ISR (revalidate = 60)** | `●` (ISR: 60s) | Menu dishes update periodically, so a 60s ISR window maintains static speed while revalidating data. |
| `/menu/[id]` | `app/menu/[id]/page.js` | **Static (SSG)** | `●` (SSG) | Pre-rendered at build time via `generateStaticParams` for all known dish IDs (`doro-wat`, `kitfo`, etc.). |
| `/cart` | `app/cart/page.js` | **Static / Client** | `○` (Static) | Renders a static client-side shell that manages dynamic cart items in local client state. |
| `/checkout` | `app/checkout/page.js` | **Dynamic (SSR)** | `ƒ` (Dynamic) | Forced dynamic (`force-dynamic`) because checkout reads live user headers, session tokens, and checkout payloads. |
| *Not Found* | `app/not-found.js` | **Static (SSG)** | `○` (Static) | Pre-rendered static custom 404 page for instant error recovery. |

---

## 🏗️ Layout & Streaming Architecture

1. **Root Shell Layout (`app/layout.js`)**
   - Owns `<html>` and `<body>` tags and global CSS imports (`globals.css`).
   - Renders top navigation header (Home, Menu, Cart, Checkout) and site footer across the entire application.

2. **Nested Menu Layout (`app/menu/layout.js`)**
   - Implements a split layout (`.menu-layout-container`) with a sticky sidebar on the left and route content (`{children}`) on the right.
   - Contains `SidebarWidget.jsx` (`'use client'`), proving state persistence (counter & table notes) as users navigate between `/menu` and `/menu/[id]`.

3. **Menu Dish Streaming (`app/menu/page.js` & React Suspense)**
   - The menu layout sidebar renders **instantly** without waiting for dish data.
   - Dish cards are wrapped in `<Suspense fallback={<DishListSkeleton />}>`, streaming dish content into view.
