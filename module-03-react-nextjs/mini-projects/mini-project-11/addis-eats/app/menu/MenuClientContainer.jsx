'use client';

import { useState } from 'react';
import CategoryBar from './CategoryBar';
import DishList from './DishList';

export default function MenuClientContainer({ allDishes, categories }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDishes =
    activeCategory === 'All'
      ? allDishes
      : allDishes.filter((d) => d.category === activeCategory);

  return (
    <>
      {/* Category Filter Bar */}
      <CategoryBar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Filtered Dishes Grid */}
      <DishList dishes={filteredDishes} />
    </>
  );
}
