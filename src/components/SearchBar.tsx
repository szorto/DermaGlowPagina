'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice, displayPrice, searchProductsAPI, type Product } from '@/data/products';
import ProductModal from './ProductModal';
import styles from './SearchBar.module.css';

const ICON_CHARS: Record<string, string> = {
  sparkles: '✦', droplet: '◈', flower: '❀',
  moon: '◗', leaf: '❧', sun: '☀', heart: '♡',
};

const PREVIEW_LIMIT = 3;
const DEBOUNCE_MS   = 350;

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className={styles.mark}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface Props {
  onClose: () => void;
}

export default function SearchBar({ onClose }: Props) {
  const router = useRouter();
  const [query, setQuery]                     = useState('');
  const [debouncedQuery, setDebouncedQuery]   = useState('');
  const [results, setResults]                 = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setDebouncedQuery(''); setResults([]); return; }
    debounceRef.current = setTimeout(() => setDebouncedQuery(val.trim()), DEBOUNCE_MS);
  };

  useEffect(() => {
    if (!debouncedQuery) return;
    let cancelled = false;
    setLoading(true);
    searchProductsAPI(debouncedQuery).then((res) => {
      if (!cancelled) { setResults(res); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSubmit = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }, [query, onClose, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleVerTodos = () => {
    onClose();
    router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
  };

  const preview     = results.slice(0, PREVIEW_LIMIT);
  const hasMore     = results.length > PREVIEW_LIMIT;
  const showEmpty   = debouncedQuery && !loading && results.length === 0;
  const showResults = !loading && preview.length > 0;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.panel} onClick={(e) => e.stopPropagation()}>

          <div className={styles.inputRow}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
            </svg>

            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />

            {query && (
              <button
                className={styles.clearBtn}
                onClick={() => { setQuery(''); setDebouncedQuery(''); setResults([]); inputRef.current?.focus(); }}
                aria-label="Limpiar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}

            <button className={styles.searchBtn} onClick={handleSubmit} disabled={!query.trim()}>
              Buscar
            </button>

            <button className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
          </div>

          <div className={styles.results}>
            {!query && (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>✦</span>
                <p>Escribe para buscar productos</p>
              </div>
            )}

            {loading && (
              <div className={styles.empty}>
                <span className={styles.spinner} />
                <p>Buscando...</p>
              </div>
            )}

            {showEmpty && (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>◈</span>
                <p>Sin resultados para <strong>"{debouncedQuery}"</strong></p>
              </div>
            )}

            {showResults && (
              <>
                <p className={styles.resultCount}>
                  {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
                </p>
                <ul className={styles.list}>
                  {preview.map((product) => (
                    <li key={product._id}>
                      <button
                        className={styles.resultItem}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div
                          className={styles.thumb}
                          style={{ background: `linear-gradient(145deg, ${product.bg ?? '#F5EAC8'}, #FDFBF7)` }}
                        >
                          <span className={styles.thumbIcon}>{ICON_CHARS[product.icon ?? ''] ?? '◈'}</span>
                        </div>

                        <div className={styles.itemInfo}>
                          <p className={styles.itemName}>{highlight(product.nombre, debouncedQuery)}</p>
                          <p className={styles.itemSub}>{highlight(product.subtitle ?? product.categoria, debouncedQuery)}</p>
                        </div>

                        <div className={styles.itemRight}>
                          <span className={styles.itemPrice}>{formatPrice(displayPrice(product))}</span>
                        </div>

                        <svg className={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>

                {hasMore && (
                  <button className={styles.verTodosBtn} onClick={handleVerTodos}>
                    Ver todos los resultados ({results.length})
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}
