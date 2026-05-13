import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { requireApiKey } from '@/lib/authMiddleware';
import { serializeProduct, buildSearchFilter } from '@/lib/productHelpers';

// GET /api/products
// Query params:
//   ?categoria=Serums        → filter by category
//   ?estado=sale             → filter by badge status
//   ?limit=20&skip=0        → pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const categoria = searchParams.get('categoria');
    const estado    = searchParams.get('estado');
    const limit     = Math.min(Number(searchParams.get('limit') ?? 50), 100);
    const skip      = Number(searchParams.get('skip') ?? 0);

    const db = await getDb();
    const col = db.collection('products');

    // Build filter
    const filter: Record<string, unknown> = {};
    if (categoria) filter.categoria = categoria;
    if (estado)    filter.estado    = estado;

    const docs = await col
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    const products = docs.map(serializeProduct);

    return NextResponse.json(products);
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

// POST /api/products  →  create a new product
// Body: { nombre, categoria, precio, estado?, precioNuevo?, imagen?, highlights?, ... }
export async function POST(req: NextRequest) {
  try {
    const authError = requireApiKey(req);
    if (authError) return authError;
    const body = await req.json();

    // Basic validation
    const required = ['nombre', 'categoria', 'precio'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const db  = await getDb();
    const col = db.collection('products');

    const doc = {
      nombre:     String(body.nombre),
      categoria:  String(body.categoria),
      precio:     Number(body.precio),
      estado:     body.estado ?? null,
      precioNuevo: body.precioNuevo != null ? Number(body.precioNuevo) : undefined,
      imagen:     body.imagen ?? undefined,
      highlights: Array.isArray(body.highlights) ? body.highlights : undefined,
      subtitle:   body.subtitle ?? undefined,
      description: body.description ?? undefined,
      bg:         body.bg ?? undefined,
      icon:       body.icon ?? undefined,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...doc },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/products]', err);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}
