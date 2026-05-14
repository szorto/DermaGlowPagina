// This file is SERVER ONLY — never import it from a Client Component.
// It connects directly to MongoDB, bypassing the HTTP API layer.

import { getDb } from '@/lib/mongodb';
import { type Product } from './products';

function serialize(doc: Record<string, unknown>): Product {
  const { _id, ...rest } = doc;
  return { _id: String(_id), ...rest } as Product;
}

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
