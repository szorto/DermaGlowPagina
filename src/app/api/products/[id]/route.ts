import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { serializeProduct } from '@/lib/productHelpers';

export const dynamic = 'force-dynamic';

interface Params { params: Promise<{ id: string }> }

// GET /api/products/:id — public
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    const db  = await getDb();
    const col = db.collection('DGDB');
    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(serializeProduct(doc));
  } catch (err) {
    console.error('[GET /api/products/:id]', err);
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}

// PUT /api/products/:id — protected by admin session cookie
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await req.json();
    const allowed = ['sku', 'nombre', 'categoria', 'precio', 'estado', 'precioNuevo', 'imagen', 'highlights', 'subtitle', 'description', 'bg', 'icon'];
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    // Coerce types
    if (updates.precio      != null) updates.precio      = Number(updates.precio);
    if (updates.precioNuevo != null) updates.precioNuevo = Number(updates.precioNuevo);
    if (updates.sku         != null) updates.sku         = String(updates.sku).trim().toUpperCase();

    const db  = await getDb();
    const col = db.collection('DGDB');
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(serializeProduct(result));
  } catch (err) {
    console.error('[PUT /api/products/:id]', err);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

// DELETE /api/products/:id — protected by admin session cookie
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const db  = await getDb();
    const col = db.collection('DGDB');
    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/products/:id]', err);
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
  }
}
