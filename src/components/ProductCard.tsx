'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type Product, formatPrice } from '@/data/products';
import styles from './ProductCard.module.css';

const BADGE_CONFIG = {
  new:  { label: 'Nuevo',        cls: 'badgeNew'  },
  sale: { label: 'Oferta',       cls: 'badgeSale' },
  best: { label: 'Más vendido',  cls: 'badgeBest' },
} as const;

const ICON_CHARS: Record<string, string> = {
  sparkles: '✦',
  droplet:  '◈',
  flower:   '❀',
  moon:     '◗',
  leaf:     '❧',
  sun:      '☀',
  heart:    '♡',
};

function ProductPlaceholder({ icon, bg }: { icon: string; bg: string }) {
  return (
    <div
      className={styles.imgPlaceholder}
      style={{ background: `linear-gradient(145deg, ${bg}, #FDFBF7)` }}
    >
      <span className={styles.imgIcon}>{ICON_CHARS[icon] ?? '◈'}</span>
      <span className={styles.imgLabel}>imagen</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const badge = product.badge ? BADGE_CONFIG[product.badge] : null;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className={styles.card}>
      {/* Image */}
      <div className={styles.imgWrap}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={styles.img}
            sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 20vw"
          />
        ) : (
          <ProductPlaceholder icon={product.icon} bg={product.bg} />
        )}

        {badge && (
          <span className={`${styles.badge} ${styles[badge.cls]}`}>
            {badge.label}
          </span>
        )}

        <div className={styles.overlay}>
          <button className={styles.overlayBtn}>Ver producto</button>
        </div>
      </div>

      {/* Info */}
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.subtitle}>{product.subtitle}</p>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <button
          className={`${styles.cartBtn} ${added ? styles.cartBtnAdded : ''}`}
          onClick={handleAddToCart}
        >
          {added ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}
