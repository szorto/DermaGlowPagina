// ─── Types ────────────────────────────────────────────────────────────────────

export type Badge = 'new' | 'sale' | 'best' | null;

export interface Product {
  _id: string;           // MongoDB ObjectId as string
  sku?: string;          // Alphanumeric identifier, entered manually
  nombre: string;
  categoria: string;
  precio: number;
  estado: Badge;         // 'new' | 'sale' | 'best' | null
  precioNuevo?: number;  // discounted price (shown as main price), original goes as precioAnterior
  imagen?: string;       // URL from your image storage
  highlights?: string[];

  // Derived / UI fields (kept for display, not stored in DB)
  subtitle?: string;     // short tagline shown under name on card
  description?: string;  // longer text shown in modal
  bg?: string;           // placeholder bg color while image loads
  icon?: string;         // fallback icon key
}

export interface Category {
  id: string;
  title: string;
  products: Product[];
}

// ─── Price helpers ─────────────────────────────────────────────────────────────

// The "display price" is precioNuevo if on sale, otherwise precio
export function displayPrice(p: Product): number {
  return p.precioNuevo ?? p.precio;
}

// The "original price" (crossed out) only shows when there's a sale
export function originalPrice(p: Product): number | undefined {
  return p.precioNuevo != null ? p.precio : undefined;
}

export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 0,
  }).format(amount);

// ─── Fetching ─────────────────────────────────────────────────────────────────

export async function searchProductsAPI(q: string): Promise<Product[]> {
  const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Error searching products');
  return res.json();
}
