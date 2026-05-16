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
  subcategoria?: string;
  marca?: string;
  description?: string;
  bg?: string;
  icon?: string;
}

// Shape returned to the client (ObjectId serialized to string)
export function serializeProduct(doc: WithId<Document>) {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

// Converts each letter to a regex group that matches with or without accent.
// e.g. "proteccion" → "protecci[oóòöôõ][nñ]"
function toAccentInsensitiveRegex(q: string): RegExp {
  const map: Record<string, string> = {
    a: '[aáàäâã]', á: '[aáàäâã]', à: '[aáàäâã]', ä: '[aáàäâã]', â: '[aáàäâã]', ã: '[aáàäâã]',
    e: '[eéèëê]',  é: '[eéèëê]',  è: '[eéèëê]',  ë: '[eéèëê]',  ê: '[eéèëê]',
    i: '[iíìïî]',  í: '[iíìïî]',  ì: '[iíìïî]',  ï: '[iíìïî]',  î: '[iíìïî]',
    o: '[oóòöôõ]', ó: '[oóòöôõ]', ò: '[oóòöôõ]', ö: '[oóòöôõ]', ô: '[oóòöôõ]', õ: '[oóòöôõ]',
    u: '[uúùüû]',  ú: '[uúùüû]',  ù: '[uúùüû]',  ü: '[uúùüû]',  û: '[uúùüû]',
    n: '[nñ]',     ñ: '[nñ]',
    A: '[AÁÀÄÂÃa]', Á: '[AÁÀÄÂÃa]',
    E: '[EÉÈËÊe]',  É: '[EÉÈËÊe]',
    I: '[IÍÌÏÎi]',  Í: '[IÍÌÏÎi]',
    O: '[OÓÒÖÔÕo]', Ó: '[OÓÒÖÔÕo]',
    U: '[UÚÙÜÛu]',  Ú: '[UÚÙÜÛu]',
    N: '[NÑn]',     Ñ: '[NÑn]',
  };

  const pattern = q
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape special regex chars first
    .split('')
    .map(c => map[c] ?? c)
    .join('');

  return new RegExp(pattern, 'i');
}

// Build a text-search filter that works without a text index,
// and matches with or without accent marks (tildes).
export function buildSearchFilter(q: string) {
  const regex = toAccentInsensitiveRegex(q.trim());
  return {
    $or: [
      { nombre:       { $regex: regex } },
      { categoria:    { $regex: regex } },
      { subcategoria: { $regex: regex } },
      { marca:        { $regex: regex } },
      { description:  { $regex: regex } },
      { highlights:   { $elemMatch: { $regex: regex } } },
    ],
  };
}

export type ProductsCollection = Collection<ProductDoc>;
