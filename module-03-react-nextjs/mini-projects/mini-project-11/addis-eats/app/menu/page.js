import { Suspense } from 'react';
import { getAllDishes, getCategories } from '@/lib/dishes';
import DishListSkeleton from './DishListSkeleton';
import MenuClientContainer from './MenuClientContainer';
import ErrorSimulator from './ErrorSimulator';

// Requirement 3: The menu route on a justified revalidate window, marked static in the build.
// Justification: Dishes and prices update periodically in background, so a 60-second ISR window is optimal.
export const revalidate = 60;

// Requirement 6: Streamed component rendering behind instantly loaded layout sidebar
async function StreamedMenuList() {
  const allDishes = getAllDishes();
  const categories = getCategories();

  return <MenuClientContainer allDishes={allDishes} categories={categories} />;
}

export default function MenuPage() {
  return (
    <div>
      {/* Top Header & Test Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Our Ethiopian Menu
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Traditional recipes crafted with authentic berbere, kibbeh, and teff injera.
          </p>
        </div>

        <Suspense fallback={null}>
          <ErrorSimulator />
        </Suspense>
      </div>

      {/* Requirement 6: Suspense boundary streaming the dish list behind instantly rendered sidebar */}
      <Suspense fallback={<DishListSkeleton />}>
        <StreamedMenuList />
      </Suspense>
    </div>
  );
}
