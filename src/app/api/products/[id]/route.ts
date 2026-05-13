import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { requireApiKey } from '@/lib/authMiddleware';
import { serializeProduct } from '@/lib/productHelpers';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    const db  = await getDb();
    const col = db.collection('products');
    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(serializeProduct(doc));
  } catch (err) {
    console.error('[GET /api/products/:id]', err);
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const authError = requireApiKey(req);
    if (authError) return authError;
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    const body = await req.json();
    const allowed = ['nombre', 'categoria', 'precio', 'estado', 'precioNuevo', 'imagen', 'highlights', 'subtitle', 'description', 'bg', 'icon'];
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }
    if (updates.precio      != null) updates.precio      = Number(updates.precio);
    if (updates.precioNuevo != null) updates.precioNuevo = Number(updates.precioNuevo);
    const db  = await getDb();
    const col = db.collection('products');
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    if (!result) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(serializeProduct(result));
  } catch (err) {
    console.error('[PUT /api/products/:id]', err);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const authError = requireApiKey(req);
    if (authError) return authError;
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    const db  = await getDb();
    const col = db.collection('products');
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