export type Badge = 'new' | 'sale' | 'best' | null;

export interface Product {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  oldPrice?: number;
  badge: Badge;
  bg: string;
  icon: string;
  image?: string; // ruta a tu imagen real, ej: '/images/serum-vitc.jpg'
}

export interface Category {
  id: string;
  title: string;
  products: Product[];
}

export const categories: Category[] = [
  {
    id: 'bestsellers',
    title: 'Más Vendidos',
    products: [
      { id: 1,  name: 'Sérum Vitamina C',       subtitle: 'Iluminador',       price: 890,  badge: 'best', bg: '#F5EAC8', icon: 'sparkles' },
      { id: 2,  name: 'Crema Hidratante Oro 24K', subtitle: 'Antiedad',        price: 1250, badge: null,   bg: '#EAF0F5', icon: 'droplet'  },
      { id: 3,  name: 'Tónico Rosa Mosqueta',    subtitle: 'Regenerador',      price: 650,  oldPrice: 800, badge: 'sale', bg: '#F5EAEA', icon: 'flower' },
      { id: 4,  name: 'Contorno de Ojos',        subtitle: 'Tensor',           price: 780,  badge: 'best', bg: '#F0EAF5', icon: 'moon'     },
      { id: 5,  name: 'Aceite Facial Jojoba',    subtitle: 'Nutritivo',        price: 590,  badge: null,   bg: '#EAF5EA', icon: 'leaf'     },
    ],
  },
  {
    id: 'new',
    title: 'Nuevos Lanzamientos',
    products: [
      { id: 6,  name: 'Mascarilla Noche Gold',   subtitle: 'Recuperadora',     price: 960,  badge: 'new',  bg: '#F5EAEA', icon: 'moon'     },
      { id: 7,  name: 'SPF 50 Invisible',        subtitle: 'Protector solar',  price: 720,  badge: 'new',  bg: '#F5EAC8', icon: 'sun'      },
      { id: 8,  name: 'Retinol 0.3% Serum',      subtitle: 'Renovador',        price: 1100, badge: 'new',  bg: '#EAF0F5', icon: 'sparkles' },
      { id: 9,  name: 'Esencia Fermentada',       subtitle: 'Equilibrante',     price: 840,  badge: 'new',  bg: '#F0EAF5', icon: 'droplet'  },
    ],
  },
  {
    id: 'hydra',
    title: 'Hidratación & Luminosidad',
    products: [
      { id: 10, name: 'Gel Hidra-Burst',         subtitle: 'Hidratación 72h',  price: 550,  badge: null,   bg: '#EAF5EA', icon: 'droplet'  },
      { id: 11, name: 'Ampolla Hialurónico',     subtitle: 'Relleno',          price: 490,  oldPrice: 620, badge: 'sale', bg: '#F5EAC8', icon: 'sparkles' },
      { id: 12, name: 'Sérum Péptidos',          subtitle: 'Firmeza',          price: 980,  badge: null,   bg: '#EAF0F5', icon: 'leaf'     },
      { id: 13, name: 'Bruma Mineral',           subtitle: 'Frescura',         price: 380,  badge: null,   bg: '#F5EAEA', icon: 'flower'   },
      { id: 14, name: 'Bálsamo Nutritivo',       subtitle: 'Reparador',        price: 460,  badge: null,   bg: '#F0EAF5', icon: 'heart'    },
    ],
  },
];

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(price);
