import { ObjectId, type Collection, type WithId, type Document } from 'mongodb';

// Shape stored in MongoDB
export interface ProductDoc {
  _id: ObjectId;
  nombre: string;
  categoria: string;
  precio: number;
  estado: 'new' | 'sale' | 'best' | null;
  precioNuevo?: number;
  imagen?: string;
  highlights?: string[];

  // Optional UI fields
  subtitle?: string;
  description?: string;
  bg?: string;
  icon?: string;
}

// Shape returned to the client (ObjectId serialized to string)
export function serializeProduct(doc: WithId<Document>) {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

// Build a text-search filter that works without a text index
// When you want to use MongoDB's $text search instead, create a
// text index on { nombre, categoria, description, highlights }
// and replace this with { $text: { $search: q } }
export function buildSearchFilter(q: string) {
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'i');
  return {
    $or: [
      { nombre:      { $regex: regex } },
      { categoria:   { $regex: regex } },
      { subtitle:    { $regex: regex } },
      { description: { $regex: regex } },
      { highlights:  { $elemMatch: { $regex: regex } } },
    ],
  };
}

export type ProductsCollection = Collection<ProductDoc>;
