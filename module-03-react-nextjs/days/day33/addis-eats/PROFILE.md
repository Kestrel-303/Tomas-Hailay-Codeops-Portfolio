# Profiler session notes

## How to record a session

1. Open React DevTools → Profiler tab (or watch the console — `MenuPage` wraps
   the dish grid in `<Profiler id="MenuDishList" onRender={...}>`, which logs
   `actualDuration`/`baseDuration` for every commit).
2. Click record, add three different dishes to the cart from `/menu`, then stop.
3. Read the flame graph / console output and note the slowest component.

## Before the fix

`MenuPage` rendered every dish inline as plain JSX (no per-dish component
boundary), so any cart change re-rendered the entire `filteredItems.map(...)`
output. Adding one dish re-rendered *all* dish cards on the page — the whole
`MenuDishList` commit duration scaled with the number of dishes in the list,
and it was the slowest part of each commit.

## The fix

`src/components/DishCard.jsx` is a `memo`-wrapped component that reads its own
`quantity` directly from `useCartStore` (a per-item selector) instead of
receiving a recomputed `cartItems` array as a prop from `MenuPage`. Now only
the card whose own quantity actually changed re-renders; unrelated cards are
skipped by `memo`'s prop comparison.

## After the fix

Re-run the same steps (add three dishes). The `MenuDishList` Profiler commit
duration should stay roughly constant regardless of menu size, and only the
touched `DishCard` logs `[DishCard Rendered]` in the console per click instead
of every card re-logging.

Record your own before/after numbers here after running the app locally:

| Session | actualDuration (ms) | Cards re-rendered |
|---|---|---|
| Before fix | _fill in_ | all |
| After fix  | _fill in_ | 1 per click |
