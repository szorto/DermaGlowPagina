'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { searchProductsAPI, type Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './buscar.module.css';

function SearchResults() {
  const searchParams          = useSearchParams();
  const query                 = searchParams.get('q') ?? '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    searchProductsAPI(query)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <Link href="/" className={styles.back}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Volver
        </Link>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>
            {loading
              ? <>Buscando <em>"{query}"</em>...</>
              : results.length > 0
                ? <>Resultados para <em>"{query}"</em></>
                : <>Sin resultados para <em>"{query}"</em></>
            }
          </h1>
          {!loading && results.length > 0 && (
            <p className={styles.count}>
              {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          )}
        </div>
      </div>

      {!loading && results.length === 0 && query && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>◈</span>
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
          <p className={styles.emptySub}>Intenta con otras palabras como "sérum", "hidratante" o "vitamina".</p>
          <Link href="/" className={styles.emptyBtn}>Ver todos los productos</Link>
        </div>
      )}

      {results.length > 0 && (
        <div className={styles.grid}>
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
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
