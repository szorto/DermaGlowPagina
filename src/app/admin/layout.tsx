import type { Metadata } from 'next';
import '../../app/globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin — DermaGlow',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}