'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { type Product } from '@/data/products';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface CategoryPreview {
  id:       string;
  title:    string;
  products: Product[];
  hasMore:  boolean;
}

export default function ProductGrid({ category }: { category: CategoryPreview }) {
  const { id, title, products, hasMore } = category;
  const rowRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Check which arrows should be visible
  const checkScroll = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  function scroll(dir: 'left' | 'right') {
    const el = rowRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement | null;
    const cardW = card ? card.offsetWidth + 20 : 220;
    el.scrollBy({ left: dir === 'right' ? cardW : -cardW, behavior: 'smooth' });
  }

  const verTodosHref = `/categoria?nombre=${encodeURIComponent(id)}`;

  return (
    <section className={styles.section} id={id}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.rule} />
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.rule} />
        </div>
        {hasMore && (
          <a href={verTodosHref} className={styles.viewAll}>
            Ver todos →
          </a>
        )}
      </div>

      <div className={styles.carouselWrap}>
        {/* Left arrow — only visible when can scroll left */}
        {canLeft && (
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => scroll('left')}
            aria-label="Anterior"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        {/* Single scrollable row */}
        <div className={styles.row} ref={rowRef}>
          {products.map((product) => (
            <div key={product._id} className={styles.cardWrap} data-card="">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right arrow — only visible when can scroll right */}
        {canRight && (
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={() => scroll('right')}
            aria-label="Siguiente"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
