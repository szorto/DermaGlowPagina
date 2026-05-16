'use client';

import { useEffect, useRef, useState } from 'react';
import { type Product, formatPrice, displayPrice, originalPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import AddedToCartToast from './AddedToCartToast';
import CartDrawer from './CartDrawer';
import styles from './ProductModal.module.css';

interface Props {
  product: Product | null;
  onClose: () => void;
  onOpenCart?: () => void;
}

const ICON_CHARS: Record<string, string> = {
  sparkles: '✦', droplet: '◈', flower: '❀',
  moon: '◗', leaf: '❧', sun: '☀', heart: '♡',
};
const BADGE_LABELS: Record<string, string> = {
  new: 'Nuevo', sale: 'Oferta', best: 'Más vendido',
};

export default function ProductModal({ product, onClose, onOpenCart }: Props) {
  const { addItem } = useCart();
  const [toast,      setToast]      = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [atBottom,   setAtBottom]   = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    if (product) document.body.style.overflow = 'hidden';
    else         document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  // Reset scroll position and atBottom when product changes
  useEffect(() => {
    setAtBottom(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [product]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    // Consider "at bottom" when within 8px of the end
    const reachedBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setAtBottom(reachedBottom);
  }

  if (!product) return null;

  const handleAddToCart = () => { addItem(product); setToast(true); };
  const handleViewCart  = () => {
    setToast(false); onClose();
    if (onOpenCart) onOpenCart(); else setCartOpen(true);
  };

  const sale        = originalPrice(product);
  const discountPct = sale ? Math.round((1 - displayPrice(product) / product.precio) * 100) : null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
        <div className={styles.modal} onClick={e => e.stopPropagation()}>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Image */}
          <div className={styles.imgWrap}>
            {product.imagen ? (
              <img src={product.imagen} alt={product.nombre} className={styles.img}/>
            ) : (
              <div className={styles.imgPlaceholder}
                style={{background:`linear-gradient(145deg,${product.bg??'#F5EAC8'},#FDFBF7)`}}>
                <span className={styles.imgIcon}>{ICON_CHARS[product.icon??'']??'◈'}</span>
              </div>
            )}
            {product.estado && (
              <span className={`${styles.badge} ${styles[`badge_${product.estado}`]}`}>
                {BADGE_LABELS[product.estado]}
              </span>
            )}
          </div>

          {/* Scrollable info */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={`${styles.info} ${atBottom ? styles.infoAtBottom : ''}`}
          >
            <p className={styles.subtitleText}>{product.categoria}</p>
            <h2 className={styles.name}>{product.nombre}</h2>
            <div className={styles.divider}/>

            {product.description && <p className={styles.description}>{product.description}</p>}

            {product.highlights && product.highlights.length > 0 && (
              <ul className={styles.highlights}>
                {product.highlights.map((h, i) => (
                  <li key={i} className={styles.highlight}>
                    <span className={styles.highlightDot}/>{h}
                  </li>
                ))}
              </ul>
            )}

            {/* Desktop: price + button inside scroll area */}
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(displayPrice(product))}</span>
              {sale && <span className={styles.oldPrice}>{formatPrice(product.precio)}</span>}
              {discountPct && <span className={styles.discount}>-{discountPct}%</span>}
            </div>
            <div className={styles.actions}>
              <button className={styles.cartBtn} onClick={handleAddToCart}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Agregar al carrito
              </button>
            </div>
          </div>

          {/* Mobile only: sticky bar */}
          <div className={styles.stickyBar}>
            <div className={styles.stickyPriceRow}>
              <span className={styles.price}>{formatPrice(displayPrice(product))}</span>
              {sale && <span className={styles.oldPrice}>{formatPrice(product.precio)}</span>}
              {discountPct && <span className={styles.discount}>-{discountPct}%</span>}
            </div>
            <button className={styles.stickyCartBtn} onClick={handleAddToCart}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Agregar al carrito
            </button>
          </div>

        </div>
      </div>

      {toast && (
        <AddedToCartToast product={product} onDismiss={()=>setToast(false)} onViewCart={handleViewCart}/>
      )}
      {cartOpen && <CartDrawer onClose={()=>setCartOpen(false)}/>}
    </>
  );
}
