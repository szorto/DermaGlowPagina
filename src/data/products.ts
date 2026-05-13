// ─── Types ────────────────────────────────────────────────────────────────────

export type Badge = 'new' | 'sale' | 'best' | null;

export interface Product {
  _id: string;           // MongoDB ObjectId as string
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

// ─── Fetching (swap these for real API calls when backend is ready) ────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// GET /api/products  →  Product[]
export async function fetchProducts(): Promise<Product[]> {
  if (BASE_URL) {
    const res = await fetch(`${BASE_URL}/api/products`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Error fetching products');
    return res.json();
  }
  // ── Fallback mock data (remove when API is live) ──
  return MOCK_PRODUCTS;
}

// GET /api/products?categoria=Serums  →  Product[]
export async function fetchByCategory(categoria: string): Promise<Product[]> {
  if (BASE_URL) {
    const res = await fetch(
      `${BASE_URL}/api/products?categoria=${encodeURIComponent(categoria)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('Error fetching category');
    return res.json();
  }
  return MOCK_PRODUCTS.filter((p) => p.categoria === categoria);
}

// GET /api/products/search?q=serum  →  Product[]
export async function searchProductsAPI(q: string): Promise<Product[]> {
  if (BASE_URL) {
    const res = await fetch(
      `${BASE_URL}/api/products/search?q=${encodeURIComponent(q)}`
    );
    if (!res.ok) throw new Error('Error searching products');
    return res.json();
  }
  // Local fallback search
  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFKD').split('').filter(c => c.charCodeAt(0) < 0x0300 || c.charCodeAt(0) > 0x036F).join('');
  const nq = normalize(q);
  return MOCK_PRODUCTS.filter((p) =>
    normalize(p.nombre).includes(nq) ||
    normalize(p.categoria).includes(nq) ||
    normalize(p.subtitle ?? '').includes(nq) ||
    normalize(p.description ?? '').includes(nq) ||
    (p.highlights?.some((h) => normalize(h).includes(nq)))
  );
}

// ─── Mock data (delete once MongoDB is connected) ─────────────────────────────

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: '1', nombre: 'Sérum Vitamina C', categoria: 'Serums',
    precio: 890, estado: 'best', highlights: ['15% Vitamina C estabilizada', 'Unifica el tono', 'Absorción rápida', 'Apto para todo tipo de piel'],
    subtitle: 'Iluminador', description: 'Fórmula concentrada con 15% de vitamina C estabilizada que ilumina, unifica el tono y protege contra el daño oxidativo.', bg: '#F5EAC8', icon: 'sparkles',
  },
  {
    _id: '2', nombre: 'Crema Hidratante Oro 24K', categoria: 'Hidratantes',
    precio: 1250, estado: null, highlights: ['Partículas de oro 24K', 'Péptidos antiedad', 'Hidratación profunda 48h', 'Efecto lifting visible'],
    subtitle: 'Antiedad', description: 'Enriquecida con partículas de oro de 24 quilates y péptidos bioactivos, esta crema reduce visiblemente las líneas de expresión.', bg: '#EAF0F5', icon: 'droplet',
  },
  {
    _id: '3', nombre: 'Tónico Rosa Mosqueta', categoria: 'Hidratantes',
    precio: 800, precioNuevo: 650, estado: 'sale', highlights: ['Aceite de rosa mosqueta puro', 'Atenúa manchas', 'Mejora elasticidad', 'Sin alcohol'],
    subtitle: 'Regenerador', description: 'Tónico facial con aceite de rosa mosqueta que regenera las células, mejora la elasticidad y atenúa manchas.', bg: '#F5EAEA', icon: 'flower',
  },
  {
    _id: '4', nombre: 'Contorno de Ojos', categoria: 'Contorno de ojos',
    precio: 780, estado: 'best', highlights: ['Cafeína + Retinol suave', 'Reduce ojeras y bolsas', 'Efecto tensor inmediato', 'Formulado para piel sensible'],
    subtitle: 'Tensor', description: 'Crema tensor de alta concentración para la zona periocular. Reduce ojeras, bolsas y líneas de expresión.', bg: '#F0EAF5', icon: 'moon',
  },
  {
    _id: '5', nombre: 'Aceite Facial Jojoba', categoria: 'Hidratantes',
    precio: 590, estado: null, highlights: ['100% aceite de jojoba puro', 'Equilibra el sebo', 'Sin fragancia', 'Vegano y cruelty-free'],
    subtitle: 'Nutritivo', description: 'Aceite 100% puro de jojoba que nutre, equilibra la producción de sebo y aporta luminosidad sin residuo graso.', bg: '#EAF5EA', icon: 'leaf',
  },
  {
    _id: '6', nombre: 'Mascarilla Noche Gold', categoria: 'Hidratantes',
    precio: 960, estado: 'new', highlights: ['Complejo dorado reparador', 'Ácido hialurónico', 'Actúa en 8 horas', 'Sin aclarado necesario'],
    subtitle: 'Recuperadora', description: 'Mascarilla de noche con complejo dorado y ácido hialurónico que trabaja mientras duermes.', bg: '#F5EAEA', icon: 'moon',
  },
  {
    _id: '7', nombre: 'SPF 50 Invisible', categoria: 'Protectores solares',
    precio: 720, estado: 'new', highlights: ['SPF 50+ amplio espectro', 'Sin residuo blanco', 'Compatible con maquillaje', 'Water resistant 80 min'],
    subtitle: 'Protector solar', description: 'Protector solar de amplio espectro SPF 50+ con acabado invisible. Textura ultraligera compatible con maquillaje.', bg: '#F5EAC8', icon: 'sun',
  },
  {
    _id: '8', nombre: 'Retinol 0.3% Serum', categoria: 'Serums',
    precio: 1100, estado: 'new', highlights: ['Retinol encapsulado 0.3%', 'Liberación gradual sin irritación', 'Renueva y afina la piel', 'Uso nocturno'],
    subtitle: 'Renovador', description: 'Sérum con retinol encapsulado al 0.3% de liberación gradual para renovación celular sin irritación.', bg: '#EAF0F5', icon: 'sparkles',
  },
  {
    _id: '9', nombre: 'Esencia Fermentada', categoria: 'Serums',
    precio: 840, estado: 'new', highlights: ['Extracto fermentado de arroz', 'Equilibra el microbioma', 'Refina los poros', 'Textura acuosa ultraligera'],
    subtitle: 'Equilibrante', description: 'Esencia con extractos fermentados de arroz que equilibran el microbioma cutáneo y refinan los poros.', bg: '#F0EAF5', icon: 'droplet',
  },
  {
    _id: '10', nombre: 'Gel Hidra-Burst', categoria: 'Hidratantes',
    precio: 550, estado: null, highlights: ['Hidratación continua 72h', 'Esferas de agua activas', 'Acabado mate-fresco', 'Ideal para pieles mixtas'],
    subtitle: 'Hidratación 72h', description: 'Gel-crema con esferas de agua que liberan hidratación continua durante 72 horas.', bg: '#EAF5EA', icon: 'droplet',
  },
  {
    _id: '11', nombre: 'Ampolla Hialurónico', categoria: 'Serums',
    precio: 620, precioNuevo: 490, estado: 'sale', highlights: ['Triple ácido hialurónico', 'Hidratación en 3 capas', 'Efecto relleno visible', 'Sin fragancia'],
    subtitle: 'Relleno', description: 'Ampolla concentrada con triple ácido hialurónico de distintos pesos moleculares para hidratación profunda.', bg: '#F5EAC8', icon: 'sparkles',
  },
  {
    _id: '12', nombre: 'Sérum Péptidos', categoria: 'Serums',
    precio: 980, estado: null, highlights: ['5 péptidos bioactivos', 'Estimula el colágeno', 'Mejora firmeza y densidad', 'Resultados en 4 semanas'],
    subtitle: 'Firmeza', description: 'Combinación de 5 péptidos bioactivos que estimulan el colágeno y mejoran la firmeza de la piel madura.', bg: '#EAF0F5', icon: 'leaf',
  },
  {
    _id: '13', nombre: 'Bruma Mineral', categoria: 'Hidratantes',
    precio: 380, estado: null, highlights: ['Agua termal pura', 'Fija el maquillaje', 'Hidratación instantánea', 'Formato viaje disponible'],
    subtitle: 'Frescura', description: 'Bruma facial con agua termal y minerales que hidrata, refresca y fija el maquillaje.', bg: '#F5EAEA', icon: 'flower',
  },
  {
    _id: '14', nombre: 'Bálsamo Nutritivo', categoria: 'Hidratantes',
    precio: 460, estado: null, highlights: ['Manteca de karité + ceramidas', 'Repara la barrera cutánea', 'Uso en cara, manos y labios', 'Sin perfume'],
    subtitle: 'Reparador', description: 'Bálsamo multifuncional con manteca de karité y ceramidas que repara la barrera cutánea.', bg: '#F0EAF5', icon: 'heart',
  },
];

// Group mock products by category (used by home page while no API)
export const categories: Category[] = (() => {
  const map = new Map<string, Product[]>();
  for (const p of MOCK_PRODUCTS) {
    if (!map.has(p.categoria)) map.set(p.categoria, []);
    map.get(p.categoria)!.push(p);
  }

  const ORDER = ['Serums', 'Hidratantes', 'Protectores solares', 'Contorno de ojos'];
  const sorted = [...map.entries()].sort(([a], [b]) => {
    const ai = ORDER.indexOf(a), bi = ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return sorted.map(([cat, products]) => ({ id: cat, title: cat, products }));
})();
