'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { getAllDishes, getCategories } from '@/lib/dishes';
import CategoryBar from './CategoryBar';
import DishList from './DishList';

export default function MenuPage({ searchParams }) {
  // Handle async searchParams in Next.js 15
  const resolvedSearchParams = searchParams ? use(Promise.resolve(searchParams)) : {};

  // Trigger error simulation if requested via query param ?error=true or ?simError=true
  if (resolvedSearchParams?.error === 'true' || resolvedSearchParams?.simError === 'true') {
    throw new Error('Simulated Menu Error: Triggered via query parameter (?simError=true) for testing error.js boundary!');
  }

  const [activeCategory, setActiveCategory] = useState('All');
  const allDishes = getAllDishes();
  const categories = getCategories();

  const filteredDishes =
    activeCategory === 'All'
      ? allDishes
      : allDishes.filter((d) => d.category === activeCategory);

  return (
    <div>
      {/* Top Header & Simulation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Our Ethiopian Menu
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Traditional recipes crafted with authentic berbere, kibbeh, and teff injera.
          </p>
        </div>

        {/* Simulation Controls for Requirements Verification */}
        <div className="controls-bar">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Test States:</span>
          <Link href="/menu?simError=true" className="sim-link" id="sim-error-link">
            ⚠️ Trigger Error UI
          </Link>
        </div>
      </div>

      {/* Category Selection Filter Component (Colocated) */}
      <CategoryBar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Dish List Component (Colocated) */}
      <DishList dishes={filteredDishes} />
    </div>
  );
}
