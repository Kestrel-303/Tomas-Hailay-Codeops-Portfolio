import { Suspense } from 'react';
import { getCategories, getMenuPage } from '@/lib/dishes';
import { menuPageKey, parsePage } from '@/lib/query-keys';
import DishListSkeleton from './DishListSkeleton';
import CategoryBar from './CategoryBar';
import ErrorSimulator from './ErrorSimulator';
import MenuBrowser from './MenuBrowser';

export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const { category, page } = await searchParams;
  const activeCategory = category || 'All';
  const requestedPage = parsePage(page);
  const categories = getCategories();

  // Render the page the URL asks for on the server and hand it to SWR as fallback data
  // under the exact key the client will use, so a shared /menu?page=2 link paints with
  // dishes immediately: no skeleton, no request on mount.
  const initialKey = menuPageKey(activeCategory, requestedPage);
  const initialData = getMenuPage(activeCategory, requestedPage);

  return (
    <div>
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

      <CategoryBar categories={categories} activeCategory={activeCategory} />

      {/* MenuBrowser reads useSearchParams, so it sits under its own Suspense boundary. */}
      <Suspense fallback={<DishListSkeleton />}>
        <MenuBrowser initialKey={initialKey} initialData={initialData} />
      </Suspense>
    </div>
  );
}
