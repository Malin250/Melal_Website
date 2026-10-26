import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, MessageCircle, Moon, Search, ShoppingCart, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext.jsx';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

const WHATSAPP_URL = 'https://wa.me/250794018454';

export function Navbar({ darkMode, onToggleDarkMode, onOpenCart }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
    setOpen(false);
  };

  const cartButton = (
    <button
      type="button"
      onClick={onOpenCart}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      aria-label="Open cart"
    >
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );

  const searchForm = (
    <form onSubmit={handleSearch} className="flex items-center rounded-xl border border-slate-200 bg-[#f7f8f5] px-3 dark:border-slate-700 dark:bg-slate-900">
      <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search for products..."
        className="h-10 min-w-0 flex-1 bg-transparent px-2.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
        aria-label="Search products"
      />
      <button type="submit" className="rounded-lg bg-emerald-800 p-2 text-white transition hover:bg-emerald-700" aria-label="Search">
        <Search className="h-3.5 w-3.5" />
      </button>
    </form>
  );

  return (
    <motion.header
      initial={false}
      className={`sticky top-0 z-40 transition-shadow duration-300 ${scrolled ? 'shadow-[0_8px_24px_-18px_rgba(15,23,42,0.38)]' : ''}`}
    >
      <div className="bg-[#143d2a] text-white">
        <div className="section-shell flex min-h-8 items-center justify-between gap-3 py-1">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] sm:text-[10px]">
            Everyday groceries for Zindiro
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-100 transition hover:text-white sm:text-[10px]">
            <MessageCircle className="h-3 w-3" />
            <span className="hidden sm:inline">WhatsApp the shop</span>
            <span>+250 794 018 454</span>
            <ArrowUpRight className="hidden h-3 w-3 sm:block" />
          </a>
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
        <div className="section-shell">
          <div className="flex items-center justify-between gap-3 py-3">
            <Link to="/" className="flex min-w-0 flex-shrink-0 items-center">
              <img
                src="/logo.svg"
                alt="Boutique La Différence"
                className="h-10 w-auto max-w-[170px] object-contain sm:h-12 sm:max-w-[205px]"
              />
            </Link>

            <div className="hidden w-full max-w-md xl:block">{searchForm}</div>

            <nav className="hidden items-center gap-1 xl:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-xs font-bold transition ${isActive ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-900'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2 xl:flex">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-[11px] font-extrabold text-white transition hover:bg-[#1ebe57]">
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <button type="button" onClick={onToggleDarkMode} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" aria-label="Toggle dark mode">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              {cartButton}
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              {cartButton}
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Toggle navigation menu"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pb-3 xl:hidden">{searchForm}</div>

          <div className="hidden items-center justify-between border-t border-slate-100 py-2 xl:flex dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-900 dark:text-emerald-200">Shop by category</span>
            <div className="flex items-center gap-2">
              <Link to="/products?category=Biscuit%20%26%20Snacks" className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-900">Snacks &amp; Biscuits</Link>
              <Link to="/products?category=Drinks" className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-900">Drinks</Link>
              <Link to="/products" className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-900">All products <ArrowUpRight className="ml-1 inline h-3 w-3" /></Link>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-b border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950 xl:hidden"
          >
            <nav className="section-shell grid grid-cols-2 gap-2 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100' : 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="rounded-xl bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {darkMode ? 'Use light theme' : 'Use dark theme'}
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp the shop
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
