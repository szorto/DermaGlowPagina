'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { fetchByCategory, type Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './categoria.module.css';


const normalize = (s: string) =>
  s.toLowerCase()
   .normalize('NFKD')
   .split('')
   .filter(c => c.charCodeAt(0) < 0x0300 || c.charCodeAt(0) > 0x036F)
   .join('');


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
