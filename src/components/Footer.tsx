import Link from 'next/link';
import styles from './Footer.module.css';

function InstagramIcon() {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

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
            <a
              href="https://www.instagram.com/dermaglowsc"
              className={styles.social}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 DermaGlow · Todos los derechos reservados</p>
        <div className={styles.bottomLinks} />
      </div>
    </footer>
  );
}
