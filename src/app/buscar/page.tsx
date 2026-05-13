'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { categories, formatPrice, type Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './buscar.module.css';

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFKD").split("").filter(c => c.charCodeAt(0) < 0x0300 || c.charCodeAt(0) > 0x036F).join("");

const allProducts = categories.flatMap((c) => c.products);

function SearchResults() {
  const searchParams  = useSearchParams();
  const query         = searchParams.get('q') ?? '';
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return allProducts.filter(
      (p) =>
        normalize(p.name).includes(q) ||
        normalize(p.subtitle).includes(q) ||
        normalize(p.description).includes(q) ||
        (p.highlights?.some((h) => normalize(h).includes(q)))
    );
  }, [query]);

  return (
    <main className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.back}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Volver
        </Link>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>
            {results.length > 0
              ? <>Resultados para <em>"{query}"</em></>
              : <>Sin resultados para <em>"{query}"</em></>
            }
          </h1>
          {results.length > 0 && (
            <p className={styles.count}>
              {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          )}
        </div>
      </div>

      {/* No results */}
      {results.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>◈</span>
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
          <p className={styles.emptySub}>Intenta con otras palabras como "sérum", "hidratante" o "vitamina".</p>
          <Link href="/" className={styles.emptyBtn}>Ver todos los productos</Link>
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <div className={styles.grid}>
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--brown-light)' }}>
        Cargando resultados...
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
