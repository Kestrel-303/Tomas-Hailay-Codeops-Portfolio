import { Suspense } from "react";
import DishSearch from "./DishSearch";

export const metadata = {
  title: "Search dishes · Addis Eats",
};

export default function SearchPage() {
  return (
    <div className="page" style={{ maxWidth: "720px" }}>
      <div className="page-header">
        <span className="eyebrow">Search</span>
        <h1 className="page-title">Find a dish</h1>
        <p className="page-subtitle">Search by name or category, e.g. &quot;wot&quot; or &quot;vegetarian&quot;.</p>
      </div>

      {/* DishSearch reads useSearchParams, which needs a Suspense boundary to keep this route static. */}
      <Suspense fallback={<div className="skeleton" style={{ height: "2.75rem" }} />}>
        <DishSearch />
      </Suspense>
    </div>
  );
}
