import styles from './PromoBanner.module.css';

interface Props {
  message?: string;
  sub?: string;
}

export default function PromoBanner({
  message = 'Envío gratis en compras mayores a $500',
  sub = 'Solo por tiempo limitado',
}: Props) {
  return (
    <div className={styles.banner}>
      <p className={styles.title}>{message}</p>
      <p className={styles.sub}>{sub}</p>
    </div>
  );
}
