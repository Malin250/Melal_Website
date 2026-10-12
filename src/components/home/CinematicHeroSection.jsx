import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Sparkles, Store } from 'lucide-react';

const heroLayers = {
  base: 'absolute inset-0',
  grain:
    'absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.14)_0.8px,transparent_0.8px)] [background-size:3px_3px]'
};

export function CinematicHeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative isolate -mx-5 -mt-4 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(167,243,208,0.35),_transparent_35%),linear-gradient(135deg,#f4f5f1_0%,#edf7ef_20%,#f7f5f2_45%,#ecf7f2_100%)] sm:-mx-6 md:-mt-8 lg:-mx-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative section-shell grid min-h-[540px] items-center gap-10 py-16 md:min-h-[640px] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:py-20">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, x: reducedMotion ? 0 : -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800 shadow-sm backdrop-blur-lg"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Boutique La Difference
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: reducedMotion ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-4xl font-black tracking-[-0.06em] text-slate-900 sm:text-5xl md:text-display"
          >
            Fresh essentials,
            <span className="block bg-[linear-gradient(135deg,#2f6b51_0%,#4fa073_35%,#d7b367_100%)] bg-clip-text text-transparent">
              elevated for daily life.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: 'easeOut' }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg"
          >
            Carefully sourced groceries, household essentials, and premium everyday products in a refined shopping experience built around convenience and trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#2f6b51_0%,#5aa97f_100%)] px-7 py-3 text-sm font-bold text-white shadow-[0_18px_32px_-20px_rgba(47,107,81,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_36px_-18px_rgba(47,107,81,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              Explore products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+250794018454"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
            >
              <Phone className="h-4 w-4" />
              +250 794 018 454
            </a>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: reducedMotion ? 0 : 26, scale: reducedMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_28px_90px_-28px_rgba(28,45,38,0.45)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(255,255,255,0.7),transparent_26%),radial-gradient(circle_at_80%_75%,rgba(203,242,222,0.7),transparent_25%)]" />
            <div className="relative space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Visit us</p>
                  <p className="mt-2 text-xl font-bold tracking-[-0.04em] text-slate-900">Boutique La Difference</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-800">
                  <Store className="h-3.5 w-3.5" />
                  Family-run
                </span>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#f8faf7_0%,#edf8ef_100%)] p-4 text-sm text-slate-700 shadow-inner">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-900">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  Zindiro, near the SP station
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">Open daily for groceries, utensils, and everyday essentials.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-3 text-slate-700 shadow-sm">
                  <p className="font-semibold text-slate-900">Premium quality</p>
                  <p className="mt-1 text-slate-500">Carefully curated stock</p>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-3 text-slate-700 shadow-sm">
                  <p className="font-semibold text-slate-900">Fast checkout</p>
                  <p className="mt-1 text-slate-500">Smooth cart experience</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#172b23_0%,#244737_100%)] p-4 text-white shadow-[0_22px_36px_-20px_rgba(23,43,35,0.8)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/80">This week</p>
                    <p className="mt-2 text-2xl font-bold tracking-[-0.06em]">Fresh picks</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-emerald-100/80">
                  <span>Fruit & veg</span>
                  <span>Home needs</span>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
