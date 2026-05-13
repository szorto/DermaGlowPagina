import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { serializeProduct, buildSearchFilter } from '@/lib/productHelpers';

// GET /api/products/search?q=serum
// Optional: &limit=10
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q     = searchParams.get('q')?.trim() ?? '';
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50);

    if (!q) {
      return NextResponse.json([]);
    }

    const db  = await getDb();
    const col = db.collection('products');

    const filter = buildSearchFilter(q);
    const docs   = await col.find(filter).limit(limit).toArray();

    return NextResponse.json(docs.map(serializeProduct));
  } catch (err) {
    console.error('[GET /api/products/search]', err);
    return NextResponse.json({ error: 'Error searching products' }, { status: 500 });
  }
}
