import Hero from '@/components/Hero';
import PromoBanner from '@/components/PromoBanner';
import ProductGrid from '@/components/ProductGrid';
import { fetchCategoryPreviews } from '@/data/products.server';

export const revalidate = 60;

export default async function Home() {
  const categories = await fetchCategoryPreviews();

  return (
    <main>
      <Hero />
      <div className="pageContent">
        {categories.map((category) => (
          <ProductGrid key={category.id} category={category} />
        ))}
      </div>
    </main>
  );
}
