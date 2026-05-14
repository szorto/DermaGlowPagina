import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const db = await getDb();
  const collections = await db.listCollections().toArray();
  const col = db.collection('DGDB');
  const count = await col.countDocuments();
  const sample = await col.findOne({});
  return NextResponse.json({ collections, count, sample });
}