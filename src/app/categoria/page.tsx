'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { categories, type Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './categoria.module.css';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Protectores solares':              ['protector solar', 'spf'],
  'Serums':                           ['iluminador', 'renovador', 'equilibrante', 'firmeza', 'serum'],
  'Hidratantes':                      ['hidratacion', 'hidratante', 'relleno', 'frescura'],
  'Acné':                             ['acne', 'poros', 'sebo'],
  'Contorno de ojos':                 ['tensor', 'contorno', 'ojos'],
  'Cabello, pestañas, cejas y uñas':  ['cabello', 'pestanas', 'cejas', 'unas'],
  'Desodorantes':                     ['desodorante'],
  'Sueño':                            ['noche', 'recuperadora', 'sueno'],
  'Higiene íntima':                   ['intima', 'intimo'],
};

const normalize = (s: string) =>
  s.toLowerCase()
   .normalize('NFKD')
   .split('')
   .filter(c => c.charCodeAt(0) < 0x0300 || c.charCodeAt(0) > 0x036F)
   .join('');

function getProductsByCategory(categoryName: string): Product[] {
  const keywords = (CATEGORY_KEYWORDS[categoryName] ?? []).map(normalize);
  if (keywords.length === 0) return [];
  const allProducts = categories.flatMap((c) => c.products);
  return allProducts.filter((p) => {
    const searchable = normalize(
      `${p.name} ${p.subtitle} ${p.description} ${(p.highlights ?? []).join(' ')}`
    );
    return keywords.some((kw) => searchable.includes(kw));
  });
}

function CategoriaContent() {
  const searchParams = useSearchParams();
  const nombre       = searchParams.get('nombre') ?? '';
  const products     = getProductsByCategory(nombre);

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
          <p className={styles.eyebrow}>Categoría</p>
          <h1 className={styles.title}>{nombre}</h1>
          {products.length > 0 && (
            <p className={styles.count}>
              {products.length} {products.length === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </div>
      </div>

      {products.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>◈</span>
          <p>No hay productos en esta categoría todavía.</p>
          <p className={styles.emptySub}>Pronto agregaremos productos aquí.</p>
          <Link href="/" className={styles.emptyBtn}>Ver todos los productos</Link>
        </div>
      )}

      {products.length > 0 && (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function CategoriaPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--brown-light)' }}>
        Cargando categoría...
      </div>
    }>
      <CategoriaContent />
    </Suspense>
  );
}
