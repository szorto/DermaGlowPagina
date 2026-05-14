import Hero from '@/components/Hero';
import PromoBanner from '@/components/PromoBanner';
import ProductGrid from '@/components/ProductGrid';
import { fetchProducts } from '@/data/products.server';
import { type Product, type Category } from '@/data/products';

export default async function Home() {
  const products = await fetchProducts();

  const map = new Map<string, Product[]>();
  for (const p of products) {
    if (!map.has(p.categoria)) map.set(p.categoria, []);
    map.get(p.categoria)!.push(p);
  }
  const categories: Category[] = [...map.entries()].map(([id, prods]) => ({
    id,
    title: id,
    products: prods,
  }));

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
