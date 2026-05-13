import Link from 'next/link';
import styles from './Footer.module.css';

{/*const footerLinks: Record<string, { label: string; href: string }[]> = {
  Productos: [
    { label: 'Skincare',     href: '/#bestsellers' },
    { label: 'Serums',       href: '/#new' },
    { label: 'Hidratantes',  href: '/#hydra' },
    { label: 'Protectores',  href: '/protectores' },
    { label: 'Kits',         href: '/kits' },
  ],
  Ayuda: [
    { label: 'Mi cuenta',           href: '/cuenta' },
    { label: 'Seguimiento pedido',  href: '/pedidos' },
    { label: 'Devoluciones',        href: '/devoluciones' },
    { label: 'FAQ',                 href: '/faq' },
  ],
  Empresa: [
    { label: 'Nosotros',         href: '/nosotros' },
    { label: 'Ingredientes',     href: '/ingredientes' },
    { label: 'Sustentabilidad',  href: '/sustentabilidad' },
    { label: 'Blog',             href: '/blog' },
  ],
};*/}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Derma<span>Glow</span>
          </Link>
          <p className={styles.tagline}>
            Rituales de lujo para una piel radiante, naturalmente.
          </p>
          <div className={styles.socials}>
            {['Instagram'].map((s) => (
              <a key={s} href="https://www.instagram.com/dermaglowsc" className={styles.social}>{s}</a>
            ))}
          </div>
        </div>

        {/* Link columns 
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group} className={styles.col}>
            <h4 className={styles.colTitle}>{group}</h4>
            <ul className={styles.colLinks}>
              {links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={styles.colLink}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))} */}
      </div>

      <div className={styles.bottom}>
        <p>© 2026 DermaGlow · Todos los derechos reservados</p>
        <div className={styles.bottomLinks}>
          {/*<Link href="/privacidad">Privacidad</Link>
          <Link href="/terminos">Términos</Link>
          <Link href="/cookies">Cookies</Link>*/}
        </div>
      </div>
    </footer>
  );
}
