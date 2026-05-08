import Hero from '@/components/Hero';
import PromoBanner from '@/components/PromoBanner';
import ProductGrid from '@/components/ProductGrid';
import { categories } from '@/data/products';

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="pageContent">
        <PromoBanner />
        {categories.map((category) => (
          <ProductGrid key={category.id} category={category} />
        ))}
      </div>
    </main>
  );
}