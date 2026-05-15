import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import nodemailer from "nodemailer";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  _id: string;
  nombre: string;
  categoria: string;
  precio: number; // original price
  precioNuevo?: number; // discounted price if applicable
  cantidad: number;
  subtotal: number; // displayPrice * cantidad
}

export interface Order {
  _id?: string;
  telefono: string;
  correo?: string;
  items: OrderItem[];
  total: number;
  estado: "pendiente" | "en proceso" | "completado" | "cancelado";
  creadoEn: Date | string;
}

// ─── POST /api/orders — create order ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { telefono, correo, items, total } = body;

    if (!telefono || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: telefono, items" },
        { status: 400 },
      );
    }

    const doc: Omit<Order, "_id"> = {
      telefono: String(telefono).trim(),
      correo: correo ? String(correo).trim() : undefined,
      items,
      total: Number(total),
      estado: "pendiente",
      creadoEn: new Date(),
    };

    // Save to MongoDB
    const db = await getDb();
    const col = db.collection("Pedidos");
    const result = await col.insertOne(doc);

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (gmailUser && gmailPass && notifyEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const itemsHtml = items
        .map(
          (i: OrderItem) =>
            `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8d0;">${i.nombre}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8d0;text-align:center;">${i.cantidad}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8d0;text-align:right;">L ${i.subtotal.toLocaleString("es-HN")}</td>
        </tr>`,
        )
        .join("");

      await transporter.sendMail({
        from: `"DermaGlow Pedidos" <${gmailUser}>`,
        to: notifyEmail,
        subject: `Nuevo pedido — L ${Number(total).toLocaleString("es-HN")} — ${doc.telefono}`,
        html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#FDFBF7;border:1px solid #e8dcc8;border-radius:4px;overflow:hidden;">
        <div style="background:#2C2416;padding:24px 28px;">
          <h1 style="font-family:Georgia,serif;font-weight:400;font-size:22px;color:#FDFBF7;margin:0;">
            Derma<span style="color:#C9973A;">Glow</span> — Nuevo pedido
          </h1>
        </div>
        <div style="padding:24px 28px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
            <thead>
              <tr style="background:#F5EAC8;">
                <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#5A4A2A;">Producto</th>
                <th style="padding:8px 12px;text-align:center;font-size:11px;text-transform:uppercase;color:#5A4A2A;">Cant.</th>
                <th style="padding:8px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:#5A4A2A;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#5A4A2A;">Total</td>
                <td style="padding:10px 12px;text-align:right;font-size:18px;color:#C9973A;font-weight:600;">L ${Number(total).toLocaleString("es-HN")}</td>
              </tr>
            </tfoot>
          </table>
          <div style="background:#fff;border:1px solid #e8dcc8;border-radius:4px;padding:16px 20px;font-size:13px;color:#2C2416;">
            <p style="margin:0 0 6px;"><strong>Teléfono:</strong> ${doc.telefono}</p>
            ${doc.correo ? `<p style="margin:0;"><strong>Correo:</strong> ${doc.correo}</p>` : ""}
          </div>
        </div>
      </div>
    `,
      });
    }

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...doc },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json(
      { error: "Error procesando el pedido" },
      { status: 500 },
    );
  }
}

// ─── GET /api/orders — admin only ────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const limit = Math.min(Number(searchParams.get("limit") ?? 100), 200);
    const skip = Number(searchParams.get("skip") ?? 0);
    const estado = searchParams.get("estado");

    const db = await getDb();
    const col = db.collection("Pedidos");

    const filter: Record<string, unknown> = {};
    if (estado) filter.estado = estado;

    const docs = await col
      .find(filter)
      .sort({ creadoEn: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const orders = docs.map((d) => ({ ...d, _id: d._id.toString() }));
    return NextResponse.json(orders);
  } catch (err) {
    console.error("[GET /api/orders]", err);
    return NextResponse.json(
      { error: "Error obteniendo pedidos" },
      { status: 500 },
    );
  }
}
