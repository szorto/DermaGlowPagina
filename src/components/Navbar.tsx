'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';
import CartDrawer from './CartDrawer';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

const categorias = [
  'Protectores solares',
  'Serums',
  'Hidratantes',
  'Acné',
  'Contorno de ojos',
  'Cabello, pestañas, cejas y uñas',
  'Desodorantes',
  'Sueño',
  'Higiene íntima',
];

const navLinks = [
  { label: 'Kits',     href: '/kits' },
  { label: 'Ofertas',  href: '/ofertas' },
];

export default function Navbar() {
  const router = useRouter();
  const { totalCount } = useCart();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [cartOpen, setCartOpen]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCategOpen, setMobileCategOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep dropdown open while mouse moves between trigger and panel
  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  const handleCategClick = (cat: string) => {
    setDropdownOpen(false);
    setMenuOpen(false);
    setMobileCategOpen(false);
    router.push(`/categoria?nombre=${encodeURIComponent(cat)}`);
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            Derma<span>Glow</span>
          </Link>

          {/* Desktop links */}
          <ul className={styles.links}>
            {/* Categorías dropdown */}
            <li
              className={styles.dropdownWrap}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`${styles.link} ${styles.dropdownTrigger} ${dropdownOpen ? styles.dropdownTriggerActive : ''}`}
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                Categorías
                <svg
                  className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown panel */}
              <div
                className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <p className={styles.dropdownLabel}>Explorar por categoría</p>
                <ul className={styles.dropdownList}>
                  {categorias.map((cat) => (
                    <li key={cat}>
                      <button
                        className={styles.dropdownItem}
                        onClick={() => handleCategClick(cat)}
                      >
                        {cat}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Other nav links */}
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className={styles.icons}>
            <button aria-label="Buscar" className={styles.iconBtn} onClick={() => setSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>


            <button aria-label="Carrito" className={styles.iconBtn} onClick={() => setCartOpen(true)}>
              <div className={styles.cartWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalCount > 0 && (
                  <span className={styles.cartBadge}>{totalCount > 99 ? '99+' : totalCount}</span>
                )}
              </div>
            </button>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={menuOpen ? styles.barTop_open : styles.barTop} />
              <span className={menuOpen ? styles.barMid_open : styles.barMid} />
              <span className={menuOpen ? styles.barBot_open : styles.barBot} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenu_open : ''}`}>

          {/* Mobile: Categorías accordion */}
          <button
            className={styles.mobileCatToggle}
            onClick={() => setMobileCategOpen((v) => !v)}
          >
            Categorías
            <svg
              className={`${styles.chevron} ${mobileCategOpen ? styles.chevronOpen : ''}`}
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div className={`${styles.mobileCatList} ${mobileCategOpen ? styles.mobileCatList_open : ''}`}>
            {categorias.map((cat) => (
              <button
                key={cat}
                className={styles.mobileCatItem}
                onClick={() => handleCategClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Other links */}
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <button
            className={styles.mobileSearch}
            onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
            </svg>
            Buscar productos
          </button>
        </div>
      </header>

      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
