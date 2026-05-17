// SERVER ONLY — never import from a Client Component.

import { getDb } from '@/lib/mongodb';
import { type Product } from './products';

const PREVIEW_LIMIT = 10;

function serialize(doc: Record<string, unknown>): Product {
  const { _id, ...rest } = doc;
  return { _id: String(_id), ...rest } as Product;
}

export interface CategoryPreview {
  id:      string;
  title:   string;
  products: Product[];   // max 10
  hasMore: boolean;      // true if category has > 10 products
}

/** Fetches up to 10 products per category + a hasMore flag. */
export async function fetchCategoryPreviews(): Promise<CategoryPreview[]> {
  const db  = await getDb();
  const col = db.collection('DGDB');

  // Get all distinct categories
  const categories: string[] = await col.distinct('categoria');

  const previews = await Promise.all(
    categories.map(async (categoria) => {
      // Fetch 11 — if we get 11, there are more than 10
      const docs = await col
        .find({ categoria })
        .limit(PREVIEW_LIMIT + 1)
        .toArray();

      const hasMore  = docs.length > PREVIEW_LIMIT;
      const products = docs.slice(0, PREVIEW_LIMIT).map(serialize);

      return { id: categoria, title: categoria, products, hasMore };
    })
  );

  return previews.filter((c) => c.products.length > 0);
}

// Keep old helpers for other pages
export async function fetchProducts(): Promise<Product[]> {
  const db  = await getDb();
  const col = db.collection('DGDB');
  const docs = await col.find({}).toArray();
  return docs.map(serialize);
}

export async function fetchByCategory(categoria: string): Promise<Product[]> {
  const db  = await getDb();
  const col = db.collection('DGDB');
  const docs = await col.find({ categoria }).toArray();
  return docs.map(serialize);
}
