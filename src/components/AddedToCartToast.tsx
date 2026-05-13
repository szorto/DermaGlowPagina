'use client';

import { useEffect, useState } from 'react';
import { type Product } from '@/data/products';
import styles from './AddedToCartToast.module.css';

const ICON_CHARS: Record<string, string> = {
  sparkles: '✦', droplet: '◈', flower: '❀',
  moon: '◗', leaf: '❧', sun: '☀', heart: '♡',
};

interface Props {
  product: Product;
  onDismiss: () => void;
  onViewCart: () => void;
}

export default function AddedToCartToast({ product, onDismiss, onViewCart }: Props) {
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss after 3.5s
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={`${styles.toast} ${visible ? styles.toastVisible : ''}`}>
      <div className={styles.check}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <div
        className={styles.thumb}
        style={{ background: `linear-gradient(145deg, ${product.bg}, #FDFBF7)` }}
      >
        <span className={styles.thumbIcon}>{ICON_CHARS[product.icon] ?? '◈'}</span>
      </div>

      <div className={styles.info}>
        <p className={styles.label}>Agregado al carrito</p>
        <p className={styles.name}>{product.name}</p>
      </div>

      <button className={styles.viewBtn} onClick={onViewCart}>
        Ver carrito
      </button>

      <button className={styles.closeBtn} onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }} aria-label="Cerrar">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
