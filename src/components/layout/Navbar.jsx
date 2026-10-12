import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBasket, ShoppingCart, Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext.jsx';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

export function Navbar({ darkMode, onToggleDarkMode, onOpenCart }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ y: 0 }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/5 bg-white/75 shadow-[0_10px_32px_-20px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80'
          : 'border-b border-transparent bg-white/55 backdrop-blur-xl dark:bg-slate-950/55'
      }`}
    >
      <div className="section-shell flex items-center justify-between py-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-full px-2 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d5b41_0%,#4fa073_100%)] text-white shadow-[0_10px_20px_-12px_rgba(29,91,65,0.8)]">
            <ShoppingBasket className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-[-0.04em] text-slate-900 dark:text-white">
              La Différence
            </span>
            <span className="text-[10px] font-medium tracking-[0.12em] text-slate-500 uppercase dark:text-slate-400">
              Zindiro · Kigali
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-sm font-medium tracking-[-0.02em] transition-all duration-200 ${
                  isActive
                    ? 'text-brand dark:text-brand-300'
                    : 'text-slate-600 hover:bg-black/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-2 -bottom-[12px] h-0.5 rounded-full bg-brand"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <div className="ml-2 h-5 w-px bg-slate-200/80 dark:bg-slate-700" />
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-slate-600 shadow-sm transition-all duration-200 hover:border-black/10 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-white/15 dark:hover:text-white"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onOpenCart}
            className="relative ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-slate-600 shadow-sm transition-all duration-200 hover:border-black/10 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-white/15 dark:hover:text-white"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#2f6b51_0%,#4fa073_100%)] text-[10px] font-bold text-white shadow-sm">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-slate-600 shadow-sm transition hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#2f6b51_0%,#4fa073_100%)] text-[10px] font-bold text-white shadow-sm">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-slate-600 shadow-sm transition hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/80 text-slate-600 shadow-sm transition hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-black/5 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 md:hidden"
          >
            <nav className="section-shell flex flex-col gap-1 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand/10 text-brand'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
