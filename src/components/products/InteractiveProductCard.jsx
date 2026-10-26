import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ImageOff, Plus } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.04 * i, ease: [0.25, 0.1, 0.25, 1] }
  })
};

export function InteractiveProductCard({
  product,
  index,
  onQuickView,
  onAddToCart,
  isAdded
}) {
  const reducedMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [product.imageUrl]);

  return (
    <motion.article
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_22px_-18px_rgba(25,45,35,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_34px_-20px_rgba(25,45,35,0.35)] dark:border-slate-800 dark:bg-slate-900"
    >
      <button
        type="button"
        onClick={onQuickView}
        className="block w-full text-left"
      >
        <div className="relative overflow-hidden">
          <motion.div
            whileHover={reducedMotion ? undefined : { scale: 1.03 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square w-full bg-[#f7f8f3] dark:bg-slate-800"
          >
            {product.imageUrl && !imageFailed ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain p-4"
                loading="lazy"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-slate-400">
                <ImageOff className="h-7 w-7" strokeWidth={1.5} />
                <span className="text-[11px] font-medium">Product photo unavailable</span>
              </div>
            )}
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute left-3 top-3 rounded-xl border border-white/60 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-900 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/85 dark:text-emerald-200">
            {product.category || 'Uncategorised'}
          </span>
          {product.imageStatus === 'closest' && !imageFailed && (
            <span className="absolute right-3 top-3 rounded-xl bg-amber-50/95 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-800 shadow-sm">
              Similar pack
            </span>
          )}
        </div>

        <div className="p-4">
          <h2 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
            {product.name}
          </h2>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {Number.isFinite(product.price)
                ? `RWF ${product.price.toLocaleString()}`
                : 'N/A'}
            </p>
          </div>
        </div>
      </button>

      <div className="px-4 pb-4">
        <motion.button
          type="button"
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          whileHover={reducedMotion ? undefined : { y: -1 }}
          onClick={onAddToCart}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-xs font-bold transition-all duration-200 ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-600 dark:hover:text-white'
          }`}
        >
          {/* Animate UI-style micro interaction for cart feedback */}
          <AnimatePresence mode="wait" initial={false}>
            {isAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                transition={{ duration: 0.16 }}
                className="inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                Added!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                transition={{ duration: 0.16 }}
                className="inline-flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}
