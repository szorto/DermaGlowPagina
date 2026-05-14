import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — DermaGlow',
  robots: { index: false, follow: false },
};

/** Intentionally does NOT include the public <Navbar> or <Footer>. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
