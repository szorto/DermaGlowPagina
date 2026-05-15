'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { displayPrice } from '@/data/products';
import styles from './CheckoutModal.module.css';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ onClose, onSuccess }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const [telefono, setTelefono] = useState('');
  const [correo,   setCorreo]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleConfirm() {
    if (!telefono.trim()) {
      setError('El número de teléfono es requerido.');
      return;
    }
    if (!/^[\d\s\+\-\(\)]{7,20}$/.test(telefono.trim())) {
      setError('Ingresa un número de teléfono válido.');
      return;
    }

    setLoading(true);
    setError('');

    const orderItems = items.map(({ product, quantity }) => ({
      _id:        product._id,
      sku:        product.sku,
      nombre:     product.nombre,
      categoria:  product.categoria,
      precio:     product.precio,
      precioNuevo: product.precioNuevo,
      cantidad:   quantity,
      subtotal:   displayPrice(product) * quantity,
    }));

    const res = await fetch('/api/orders', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telefono: telefono.trim(),
        correo:   correo.trim() || undefined,
        items:    orderItems,
        total:    totalPrice,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? 'Error al enviar el pedido. Intenta de nuevo.');
      return;
    }

    clearCart();
    onSuccess();
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 0 }).format(n);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Confirmar pedido</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Order summary */}
        <div className={styles.summary}>
          <p className={styles.summaryLabel}>Resumen</p>
          <ul className={styles.itemList}>
            {items.map(({ product, quantity }) => (
              <li key={product._id} className={styles.summaryItem}>
                <span className={styles.summaryName}>
                  {product.nombre}
                  <span className={styles.summaryQty}> × {quantity}</span>
                </span>
                <span className={styles.summaryPrice}>
                  {fmt(displayPrice(product) * quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalAmount}>{fmt(totalPrice)}</span>
          </div>
        </div>

        {/* Contact info */}
        <div className={styles.body}>
          <p className={styles.bodyLabel}>Información de contacto</p>

          <div className={styles.field}>
            <label className={styles.label}>
              Número de teléfono <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              type="tel"
              placeholder="Ej. +504 9999-9999"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Correo electrónico <span className={styles.optional}>(opcional)</span>
            </label>
            <input
              className={styles.input}
              type="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="email"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* Actions */}
        <div className={styles.footer}>
          <button className={styles.btnSecondary} onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className={styles.btnPrimary} onClick={handleConfirm} disabled={loading}>
            {loading ? 'Enviando…' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
