import { type Category } from '@/data/products';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ category }: { category: Category }) {
  const { id, title, products } = category;

  return (
    <section className={styles.section} id={id}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.rule} />
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.rule} />
        </div>
        <a href="#" className={styles.viewAll}>Ver todos →</a>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
