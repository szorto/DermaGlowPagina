import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Colección 2025</p>
      <h1 className={styles.title}>
        Tu ritual de<br />
        <em>belleza dorada</em>
      </h1>
      <div className={styles.divider} />
      <p className={styles.subtitle}>
        Fórmulas de lujo para una piel radiante, naturalmente luminosa.
      </p>
      <div className={styles.actions}>
        <Link href="/#bestsellers" className={styles.btnPrimary}>
          Ver colección
        </Link>
        <Link href="/#new" className={styles.btnGhost}>
          Nuevos lanzamientos
        </Link>
      </div>
    </section>
  );
}
