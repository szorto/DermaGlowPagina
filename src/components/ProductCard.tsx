'use client';

import { useState } from 'react';
import { type Product, formatPrice, displayPrice, originalPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductModal from './ProductModal';
import AddedToCartToast from './AddedToCartToast';
import CartDrawer from './CartDrawer';
import styles from './ProductCard.module.css';

const BADGE_CONFIG = {
  new:  { label: 'Nuevo',       cls: 'badgeNew'  },
  sale: { label: 'Oferta',      cls: 'badgeSale' },
  best: { label: 'Más vendido', cls: 'badgeBest' },
} as const;

const ICON_CHARS: Record<string, string> = {
  sparkles: '✦', droplet: '◈', flower: '❀',
  moon: '◗', leaf: '❧', sun: '☀', heart: '♡',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast,     setToast]     = useState(false);
  const [cartOpen,  setCartOpen]  = useState(false);
  const badge = product.estado ? BADGE_CONFIG[product.estado] : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setToast(true);
  };

  const handleViewCart = () => {
    setToast(false);
    setModalOpen(false);
    setCartOpen(true);
  };

  return (
    <>
      <article className={styles.card} onClick={() => setModalOpen(true)}>
        <div className={styles.imgWrap}>
          {product.imagen ? (
            <img src={product.imagen} alt={product.nombre} className={styles.img} />
          ) : (
            <div
              className={styles.imgPlaceholder}
              style={{ background: `linear-gradient(145deg, ${product.bg ?? '#F5EAC8'}, #FDFBF7)` }}
            >
              <span className={styles.imgIcon}>{ICON_CHARS[product.icon ?? ''] ?? '◈'}</span>
              <span className={styles.imgLabel}>imagen</span>
            </div>
          )}

          {badge && (
            <span className={`${styles.badge} ${styles[badge.cls]}`}>{badge.label}</span>
          )}

          <div className={styles.overlay}>
            <button
              className={styles.overlayBtn}
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            >
              Ver producto
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <h3 className={styles.name}>
            {product.marca ? `${product.marca} ${product.nombre}` : product.nombre}
          </h3>

          {/* Subcategoría (replaces subtitle) */}
          {product.subcategoria && (
            <p className={styles.subtitle}>{product.subcategoria}</p>
          )}

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(displayPrice(product))}</span>
            {originalPrice(product) && (
              <span className={styles.oldPrice}>{formatPrice(originalPrice(product)!)}</span>
            )}
          </div>

          <button className={styles.cartBtn} onClick={handleAddToCart}>
            Agregar al carrito
          </button>
        </div>
      </article>

      {modalOpen && (
        <ProductModal
          product={product}
          onClose={() => setModalOpen(false)}
          onOpenCart={handleViewCart}
        />
      )}

      {toast && (
        <AddedToCartToast
          product={product}
          onDismiss={() => setToast(false)}
          onViewCart={handleViewCart}
        />
      )}

      {cartOpen && (
        <CartDrawer onClose={() => setCartOpen(false)} />
      )}
    </>
  );
}
