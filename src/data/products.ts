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
  image?: string;
  description: string;
  highlights?: string[];
  size?: string;
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
      {
        id: 1, name: 'Sérum Vitamina C', subtitle: 'Iluminador', price: 890, badge: 'best', bg: '#F5EAC8', icon: 'sparkles',
        description: 'Fórmula concentrada con 15% de vitamina C estabilizada que ilumina, unifica el tono y protege contra el daño oxidativo. Textura ligera de absorción inmediata.',
        highlights: ['15% Vitamina C estabilizada', 'Unifica el tono', 'Absorción rápida', 'Apto para todo tipo de piel'],
        size: '30 ml',
      },
      {
        id: 2, name: 'Crema Hidratante Oro 24K', subtitle: 'Antiedad', price: 1250, badge: null, bg: '#EAF0F5', icon: 'droplet',
        description: 'Enriquecida con partículas de oro de 24 quilates y péptidos bioactivos, esta crema reduce visiblemente las líneas de expresión y devuelve firmeza a la piel.',
        highlights: ['Partículas de oro 24K', 'Péptidos antiedad', 'Hidratación profunda 48h', 'Efecto lifting visible'],
        size: '50 ml',
      },
      {
        id: 3, name: 'Tónico Rosa Mosqueta', subtitle: 'Regenerador', price: 650, oldPrice: 800, badge: 'sale', bg: '#F5EAEA', icon: 'flower',
        description: 'Tónico facial con aceite de rosa mosqueta de origen natural que regenera las células, mejora la elasticidad y atenúa manchas y cicatrices.',
        highlights: ['Aceite de rosa mosqueta puro', 'Atenúa manchas', 'Mejora elasticidad', 'Sin alcohol'],
        size: '150 ml',
      },
      {
        id: 4, name: 'Contorno de Ojos', subtitle: 'Tensor', price: 780, badge: 'best', bg: '#F0EAF5', icon: 'moon',
        description: 'Crema tensor de alta concentración para la zona periocular. Reduce ojeras, bolsas y líneas de expresión con una fórmula de cafeína y retinol suave.',
        highlights: ['Cafeína + Retinol suave', 'Reduce ojeras y bolsas', 'Efecto tensor inmediato', 'Formulado para piel sensible'],
        size: '15 ml',
      },
      {
        id: 5, name: 'Aceite Facial Jojoba', subtitle: 'Nutritivo', price: 590, badge: null, bg: '#EAF5EA', icon: 'leaf',
        description: 'Aceite 100% puro de jojoba que nutre, equilibra la producción de sebo y aporta luminosidad sin dejar residuo graso. Ideal para noche.',
        highlights: ['100% aceite de jojoba puro', 'Equilibra el sebo', 'Sin fragancia', 'Vegano y cruelty-free'],
        size: '30 ml',
      },
    ],
  },
  {
    id: 'new',
    title: 'Nuevos Lanzamientos',
    products: [
      {
        id: 6, name: 'Mascarilla Noche Gold', subtitle: 'Recuperadora', price: 960, badge: 'new', bg: '#F5EAEA', icon: 'moon',
        description: 'Mascarilla de noche con complejo dorado y ácido hialurónico que trabaja mientras duermes para recuperar, reparar e iluminar la piel al despertar.',
        highlights: ['Complejo dorado reparador', 'Ácido hialurónico', 'Actúa en 8 horas', 'Sin aclarado necesario'],
        size: '75 ml',
      },
      {
        id: 7, name: 'SPF 50 Invisible', subtitle: 'Protector solar', price: 720, badge: 'new', bg: '#F5EAC8', icon: 'sun',
        description: 'Protector solar de amplio espectro SPF 50+ con acabado invisible y sin residuo blanco. Textura ultraligera compatible con maquillaje.',
        highlights: ['SPF 50+ amplio espectro', 'Sin residuo blanco', 'Compatible con maquillaje', 'Water resistant 80 min'],
        size: '50 ml',
      },
      {
        id: 8, name: 'Retinol 0.3% Serum', subtitle: 'Renovador', price: 1100, badge: 'new', bg: '#EAF0F5', icon: 'sparkles',
        description: 'Sérum con retinol encapsulado al 0.3% de liberación gradual para una renovación celular efectiva y sin irritación. Resultados visibles desde la tercera semana.',
        highlights: ['Retinol encapsulado 0.3%', 'Liberación gradual sin irritación', 'Renueva y afina la piel', 'Uso nocturno'],
        size: '30 ml',
      },
      {
        id: 9, name: 'Esencia Fermentada', subtitle: 'Equilibrante', price: 840, badge: 'new', bg: '#F0EAF5', icon: 'droplet',
        description: 'Esencia con extractos fermentados de arroz y galactomyces que equilibran el microbioma cutáneo, refinan los poros y aportan luminosidad natural.',
        highlights: ['Extracto fermentado de arroz', 'Equilibra el microbioma', 'Refina los poros', 'Textura acuosa ultraligera'],
        size: '150 ml',
      },
    ],
  },
  {
    id: 'hydra',
    title: 'Hidratación & Luminosidad',
    products: [
      {
        id: 10, name: 'Gel Hidra-Burst', subtitle: 'Hidratación 72h', price: 550, badge: null, bg: '#EAF5EA', icon: 'droplet',
        description: 'Gel-crema de textura explosiva con esferas de agua que liberan hidratación continua durante 72 horas. Acabado fresco y sin brillo para pieles mixtas.',
        highlights: ['Hidratación continua 72h', 'Esferas de agua activas', 'Acabado mate-fresco', 'Ideal para pieles mixtas'],
        size: '50 ml',
      },
      {
        id: 11, name: 'Ampolla Hialurónico', subtitle: 'Relleno', price: 490, oldPrice: 620, badge: 'sale', bg: '#F5EAC8', icon: 'sparkles',
        description: 'Ampolla concentrada con triple ácido hialurónico de distintos pesos moleculares para una hidratación en tres capas: superficial, media y profunda.',
        highlights: ['Triple ácido hialurónico', 'Hidratación en 3 capas', 'Efecto relleno visible', 'Sin fragancia'],
        size: '7 x 2 ml',
      },
      {
        id: 12, name: 'Sérum Péptidos', subtitle: 'Firmeza', price: 980, badge: null, bg: '#EAF0F5', icon: 'leaf',
        description: 'Combinación de 5 péptidos bioactivos que estimulan la producción de colágeno, mejoran la firmeza y devuelven densidad a la piel madura.',
        highlights: ['5 péptidos bioactivos', 'Estimula el colágeno', 'Mejora firmeza y densidad', 'Resultados en 4 semanas'],
        size: '30 ml',
      },
      {
        id: 13, name: 'Bruma Mineral', subtitle: 'Frescura', price: 380, badge: null, bg: '#F5EAEA', icon: 'flower',
        description: 'Bruma facial con agua termal y minerales traza que hidrata, refresca y fija el maquillaje. Perfecta para llevar durante el día.',
        highlights: ['Agua termal pura', 'Fija el maquillaje', 'Hidratación instantánea', 'Formato viaje disponible'],
        size: '100 ml',
      },
      {
        id: 14, name: 'Bálsamo Nutritivo', subtitle: 'Reparador', price: 460, badge: null, bg: '#F0EAF5', icon: 'heart',
        description: 'Bálsamo multifuncional con manteca de karité, ceramidas y escualano que repara la barrera cutánea y nutre intensamente la piel sensible o dañada.',
        highlights: ['Manteca de karité + ceramidas', 'Repara la barrera cutánea', 'Uso en cara, manos y labios', 'Sin perfume'],
        size: '50 ml',
      },
    ],
  },
];

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 0,
  }).format(price);
