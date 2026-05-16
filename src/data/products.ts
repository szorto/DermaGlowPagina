export type Badge = 'new' | 'sale' | 'best' | null;

export interface Product {
  _id: string;
  sku?:          string;
  nombre:        string;
  marca?:        string;   // brand name, shown on card
  categoria:     string;
  subcategoria?: string;   // replaces subtitle
  precio:        number;
  estado:        Badge;
  precioNuevo?:  number;
  imagen?:       string;
  highlights?:   string[];
  description?:  string;
  bg?:           string;
  icon?:         string;
}

export interface Category {
  id: string;
  title: string;
  products: Product[];
}

export function displayPrice(p: Product): number {
  return p.precioNuevo ?? p.precio;
}

export function originalPrice(p: Product): number | undefined {
  return p.precioNuevo != null ? p.precio : undefined;
}

export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 0,
  }).format(amount);

export async function searchProductsAPI(q: string): Promise<Product[]> {
  const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Error searching products');
  return res.json();
}
