import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { isAdminAuthenticated } from '@/lib/adminAuth';

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const { estado } = await req.json();
    const allowed = ['pendiente', 'en proceso', 'completado', 'cancelado'];
    if (!allowed.includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const db  = await getDb();
    const col = db.collection('Pedidos');
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { estado, actualizadoEn: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    return NextResponse.json({ ...result, _id: result._id.toString() });
  } catch (err) {
    console.error('[PATCH /api/orders/:id]', err);
    return NextResponse.json({ error: 'Error actualizando pedido' }, { status: 500 });
  }
}
