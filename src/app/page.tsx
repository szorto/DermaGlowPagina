import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import { categories } from '@/data/products';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <Hero />
      <div className={styles.content}>
        {categories.map((category) => (
          <ProductGrid key={category.id} category={category} />
        ))}
      </div>
    </main>
  );
}