import { Suspense } from 'react';
import { getCategories, getMenuPage } from '@/lib/dishes';
import { menuPageKey, parsePage } from '@/lib/query-keys';
import DishListSkeleton from './DishListSkeleton';
import CategoryBar from './CategoryBar';
import ErrorSimulator from './ErrorSimulator';
import MenuBrowser from './MenuBrowser';

export const revalidate = 60;

const CATEGORY_BLURBS = {
  Signature: 'Doro wat, special kitfo and the other dishes Addis Eats is known for',
  'Fasting / Veggie': 'Fasting-friendly dishes with no meat or dairy: shiro, misir wat, kik alicha and veggie combos',
  Tibs: 'Sizzling tibs: beef and lamb seared with onion, rosemary, chili and awaze',
};

// /menu takes ?category= and ?page=, so the same list can sit at many URLs (plus ?simError= and
// any tracking tags people add). The canonical URL keeps only what changes the content: a real
// category, and a page number above 1 that exists. Everything else points back to it.
export async function generateMetadata({ searchParams }) {
  const { category, page } = await searchParams;
  const validCategory = getCategories().includes(category) && category !== 'All' ? category : null;
  const { page: realPage } = getMenuPage(validCategory ?? 'All', parsePage(page));

  const query = new URLSearchParams();
  if (validCategory) query.set('category', validCategory);
  if (realPage > 1) query.set('page', String(realPage));
  const canonical = query.size ? `/menu?${query}` : '/menu';

  return {
    title: validCategory ? `${validCategory} dishes` : 'Menu',
    description: validCategory
      ? `${CATEGORY_BLURBS[validCategory]}. Order online from Addis Eats, priced in ETB and delivered across Addis Ababa.`
      : 'The full Addis Eats menu: doro wat, kitfo, tibs, shiro and fasting platters, each priced in ETB, with a description, spice level and ingredients.',
    // No `openGraph` here on purpose: setting it would replace the inherited object, and with it
    // the site-wide og:image from app/opengraph-image.js.
    alternates: { canonical },
  };
}

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
          {/* The one h1 names what this URL shows: the whole menu, or one category of it. */}
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {activeCategory === 'All' ? 'Our Ethiopian Menu' : `${activeCategory} dishes`}
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
