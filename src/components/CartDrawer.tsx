'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import CheckoutModal from './CheckoutModal';
import OrderSuccessModal from './OrderSuccessModal';
import styles from './CartDrawer.module.css';

const ICON_CHARS: Record<string, string> = {
  sparkles: '✦', droplet: '◈', flower: '❀',
  moon: '◗', leaf: '❧', sun: '☀', heart: '♡',
};

interface Props { onClose: () => void; }

export default function CartDrawer({ onClose }: Props) {
  const { items, totalCount, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleSuccess() { setShowCheckout(false); setShowSuccess(true); }
  function handleSuccessClose() { setShowSuccess(false); onClose(); }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}>
        <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h2 className={styles.title}>Mi carrito</h2>
              {totalCount > 0 && <span className={styles.badge}>{totalCount}</span>}
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Empty state */}
          {items.length === 0 && (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>◈</span>
              <p className={styles.emptyTitle}>Tu carrito está vacío</p>
              <p className={styles.emptySub}>Agrega productos para comenzar tu ritual de belleza.</p>
              <button className={styles.emptyBtn} onClick={onClose}>Ver productos</button>
            </div>
          )}

          {/* Items */}
          {items.length > 0 && (
            <>
              <ul className={styles.list}>
                {items.map(({ product, quantity, snapshotPrice, snapshotOrig }) => {
                  const salePrice = snapshotPrice;
                  const origPrice = snapshotOrig;
                  const lineTotal = salePrice * quantity;

                  return (
                    <li key={product._id} className={styles.item}>
                      {/* Thumbnail */}
                      <div
                        className={styles.thumb}
                        style={{ background: `linear-gradient(145deg, ${product.bg ?? '#F5EAC8'}, #FDFBF7)` }}
                      >
                        <span className={styles.thumbIcon}>
                          {product.imagen
                            ? <img src={product.imagen} alt={product.nombre} className={styles.thumbImg} />
                            : ICON_CHARS[product.icon ?? ''] ?? '◈'
                          }
                        </span>
                      </div>

                      {/* Info */}
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>
                          {product.marca ? `${product.marca} ` : ''}{product.nombre}
                        </p>
                        {product.subcategoria && (
                          <p className={styles.itemSub}>{product.subcategoria}</p>
                        )}

                        {/* Unit price row with original crossed out */}
                        <div className={styles.itemPriceRow}>
                          <span className={styles.itemSalePrice}>{formatPrice(salePrice)}</span>
                          {origPrice != null && (
                            <span className={styles.itemOrigPrice}>{formatPrice(origPrice)}</span>
                          )}
                        </div>

                        <div className={styles.itemBottom}>
                          {/* Quantity controls */}
                          <div className={styles.qty}>
                            <button className={styles.qtyBtn} onClick={() => updateQuantity(product._id, quantity - 1)} aria-label="Disminuir">−</button>
                            <span className={styles.qtyNum}>{quantity}</span>
                            <button className={styles.qtyBtn} onClick={() => updateQuantity(product._id, quantity + 1)} aria-label="Aumentar">+</button>
                          </div>
                          {/* Line total */}
                          <span className={styles.itemPrice}>{formatPrice(lineTotal)}</span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button className={styles.removeBtn} onClick={() => removeItem(product._id)} aria-label="Eliminar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Footer */}
              <div className={styles.footer}>
                <div className={styles.subtotal}>
                  <span className={styles.subtotalLabel}>Subtotal</span>
                  <span className={styles.subtotalPrice}>{formatPrice(totalPrice)}</span>
                </div>
                <p className={styles.shipping}>Coordinamos la entrega por mensaje.<br/> 
                Le regalamos 2 muestras gratuitas.</p>

                <button className={styles.checkoutBtn} onClick={() => setShowCheckout(true)}>
                  Procesar pedido
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                <button className={styles.clearBtn} onClick={clearCart}>Vaciar carrito</button>
              </div>
            </>
          )}
        </aside>
      </div>

      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} onSuccess={handleSuccess} />
      )}
      {showSuccess && <OrderSuccessModal onClose={handleSuccessClose} />}
    </>
  );
}
