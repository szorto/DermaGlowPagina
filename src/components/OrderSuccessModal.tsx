'use client';

import styles from './OrderSuccessModal.module.css';

interface Props {
  onClose: () => void;
}

export default function OrderSuccessModal({ onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>✦</div>
        <h2 className={styles.title}>¡Pedido recibido!</h2>
        <p className={styles.text}>
          Gracias por tu compra. Nos pondremos en contacto contigo pronto para coordinar la compra.
        </p>
        <button className={styles.btn} onClick={onClose}>
          Seguir comprando
        </button>
      </div>
    </div>
  );
}
