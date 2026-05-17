import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { serializeProduct, buildSearchFilter } from '@/lib/productHelpers';

export const dynamic = 'force-dynamic';

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const categoria = searchParams.get('categoria');
    const estado    = searchParams.get('estado');
    const limit     = Math.min(Number(searchParams.get('limit') ?? 50), 200);
    const skip      = Number(searchParams.get('skip') ?? 0);

    const db  = await getDb();
    const col = db.collection('DGDB');

    const filter: Record<string, unknown> = {};
    if (categoria) filter.categoria = categoria;
    if (estado)    filter.estado    = estado;

    const docs = await col.find(filter).skip(skip).limit(limit).toArray();
    return NextResponse.json(docs.map(serializeProduct));
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

// POST /api/products — protected by admin session cookie
export async function POST(req: NextRequest) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const required = ['nombre', 'categoria', 'precio'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const db  = await getDb();
    const col = db.collection('DGDB');

    const doc = {
      sku:          body.sku          ? String(body.sku).trim().toUpperCase() : undefined,
      nombre:       String(body.nombre),
      marca:        body.marca        ? String(body.marca).trim()        : undefined,
      categoria:    String(body.categoria),
      subcategoria: body.subcategoria ? String(body.subcategoria).trim() : undefined,
      precio:       Number(body.precio),
      estado:       body.estado       ?? null,
      precioNuevo:  body.precioNuevo  != null ? Number(body.precioNuevo) : undefined,
      imagen:       body.imagen       ?? undefined,
      highlights:   Array.isArray(body.highlights) ? body.highlights : undefined,
      description:  body.description  ?? undefined,
      bg:           body.bg           ?? undefined,
      icon:         body.icon         ?? undefined,
      createdAt:    new Date(),
      updatedAt:    new Date(),
    };

    const result = await col.insertOne(doc);
    return NextResponse.json({ _id: result.insertedId.toString(), ...doc }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/products]', err);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}
