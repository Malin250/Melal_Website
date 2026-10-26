import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowUpDown, Search, SlidersHorizontal, Sparkles, Plus, ChevronDown, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { InteractiveProductCard } from '../components/products/InteractiveProductCard.jsx';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('asc');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get('category');
    return cat ? [cat.toLowerCase().trim()] : [];
  });
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewImageFailed, setQuickViewImageFailed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setFiltersOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Failed to fetch products.');
        }
        const data = await res.json();
        if (isMounted) {
          // eslint-disable-next-line no-console
          console.log('[ProductsPage] Fetched products:', data.products);
          setProducts(data.products || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load products.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
    setDebouncedSearch(query.trim().toLowerCase());
  }, [searchParams]);

  useEffect(() => {
    setQuickViewImageFailed(false);
  }, [quickViewProduct?.imageUrl]);

  const companies = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.company) set.add(String(p.company).toLowerCase().trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(String(p.category).toLowerCase().trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const visibleProducts = useMemo(() => {
    let result = [...products];

    const companyFilters = selectedCompanies.map((c) => c.toLowerCase().trim());
    const categoryFilters = selectedCategories.map((c) => c.toLowerCase().trim());

    if (companyFilters.length > 0) {
      result = result.filter(
        (p) =>
          p.company &&
          companyFilters.includes(String(p.company).toLowerCase().trim())
      );
    }

    if (categoryFilters.length > 0) {
      result = result.filter(
        (p) =>
          p.category &&
          categoryFilters.includes(String(p.category).toLowerCase().trim())
      );
    }

    if (debouncedSearch) {
      result = result.filter((p) => {
        const target = `${p.name || ''} ${p.company || ''} ${p.category || ''}`
          .toLowerCase()
          .trim();
        return target.includes(debouncedSearch);
      });
    }

    if (sort) {
      result = [...result].sort((a, b) => {
        const av = a[sort];
        const bv = b[sort];
        const direction = order === 'desc' ? -1 : 1;

        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;

        if (typeof av === 'number' && typeof bv === 'number') {
          return (av - bv) * direction;
        }

        const aStr = String(av).toLowerCase();
        const bStr = String(bv).toLowerCase();
        if (aStr < bStr) return -1 * direction;
        if (aStr > bStr) return 1 * direction;
        return 0;
      });
    }

    return result;
  }, [products, selectedCompanies, selectedCategories, debouncedSearch, sort, order]);

  const { addItem } = useCart();
  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (product) => {
    addItem({ id: product.id, name: product.name, imageUrl: product.imageUrl, price: product.price, costPrice: product.costPrice });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const activeFilterCount =
    selectedCompanies.length + selectedCategories.length + (debouncedSearch ? 1 : 0);
  const skeletonCount = 8;

  return (
    <div className="pb-12">
      {/* Page header */}
      <header className="relative z-20 -mx-5 bg-white/95 px-5 pb-3 pt-1 backdrop-blur-xl dark:bg-slate-950/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {/* Title row + toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Our Products
            </h1>
            {filtersOpen && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Browse the latest inventory. Use filters to explore by brand, category, or price.
              </p>
            )}
          </div>
          <motion.button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="ml-4 inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition-all hover:border-emerald-400 dark:border-emerald-900/40 dark:bg-slate-900/85 dark:text-emerald-100 dark:hover:border-emerald-600"
            aria-label={filtersOpen ? 'Hide filters' : 'Show filters'}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{filtersOpen ? 'Hide filters' : 'Filters'}</span>
            {!filtersOpen && activeFilterCount > 0 && (
              <span className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
            <motion.span
              animate={{ rotate: filtersOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.span>
          </motion.button>
        </div>

        {/* Collapsible filter bar */}
        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              key="filter-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: 'hidden' }}
              className="pb-3"
            >
        <div className="space-y-4 rounded-3xl border border-emerald-100/80 bg-[linear-gradient(130deg,rgba(236,253,245,0.9)_0%,rgba(255,255,255,0.95)_38%,rgba(254,243,199,0.65)_100%)] p-4 shadow-soft dark:border-emerald-900/30 dark:bg-[linear-gradient(130deg,rgba(6,78,59,0.22)_0%,rgba(15,23,42,0.9)_45%,rgba(113,63,18,0.2)_100%)]">
          {/* Search + indicator row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <motion.label
              whileHover={{ y: -1 }}
              className="group relative flex w-full items-center gap-2 rounded-2xl border border-emerald-200/90 bg-white/90 px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.16)] dark:border-emerald-900/40 dark:bg-slate-900/85 dark:focus-within:border-emerald-500 md:max-w-md"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors duration-200 group-focus-within:bg-emerald-600 group-focus-within:text-white dark:bg-emerald-900/50 dark:text-emerald-200 dark:group-focus-within:bg-emerald-500 dark:group-focus-within:text-slate-900">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full bg-transparent pr-1 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              {search && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSearch('')}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-slate-300 hover:text-slate-800 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </motion.label>
            <div className="flex items-center gap-2 text-xs text-emerald-800/80 dark:text-emerald-200/80">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>
                {activeFilterCount > 0
                  ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`
                  : 'No filters active'}
              </span>
              {activeFilterCount > 0 && (
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSearch('');
                    setSelectedCategories([]);
                    setSelectedCompanies([]);
                  }}
                  className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-200/90 px-3 py-1 font-semibold text-amber-900 transition-all duration-200 hover:border-amber-400 hover:bg-amber-300 dark:border-amber-500/40 dark:bg-amber-400/20 dark:text-amber-100 dark:hover:bg-amber-400/30"
                >
                  <Sparkles className="h-3 w-3" />
                  Clear all
                </motion.button>
              )}
            </div>
          </div>

          {/* Category + Company chips */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-800/70 dark:text-emerald-200/80">
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = selectedCategories.includes(c);
                return (
                  <motion.button
                    key={c}
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                      active
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-[0_8px_20px_-12px_rgba(5,150,105,0.9)]'
                        : 'border-emerald-200 bg-white/90 text-emerald-900 hover:border-emerald-400 hover:bg-white dark:border-emerald-900/40 dark:bg-slate-900/85 dark:text-emerald-100 dark:hover:border-emerald-600'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-white' : 'bg-emerald-400'}`} />
                    {c}
                  </motion.button>
                );
              })}
            </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-800/70 dark:text-amber-200/80">
                Brands
              </p>
              <div className="flex flex-wrap gap-2">
              {companies.map((c) => {
                const label = c.charAt(0).toUpperCase() + c.slice(1);
                const active = selectedCompanies.includes(c);
                return (
                  <motion.button
                    key={c}
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      setSelectedCompanies((prev) =>
                        prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      active
                        ? 'border-amber-500 bg-amber-500 text-slate-900 shadow-[0_8px_20px_-12px_rgba(245,158,11,0.9)]'
                        : 'border-amber-200 bg-white/90 text-amber-900 hover:border-amber-400 hover:bg-white dark:border-amber-900/40 dark:bg-slate-900/85 dark:text-amber-100 dark:hover:border-amber-600'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-slate-900' : 'bg-amber-400'}`} />
                    {label}
                  </motion.button>
                );
              })}
            </div>
            </div>
          </div>

          {/* Sort row */}
          <div className="flex flex-wrap items-center gap-2 border-t border-emerald-200/70 pt-4 text-xs dark:border-emerald-900/40">
            <span className="mr-1 flex items-center gap-1.5 text-emerald-800/70 dark:text-emerald-200/80">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort:
            </span>
            {[
              { key: '', label: 'Default' },
              { key: 'price-asc', label: 'Price ↑' },
              { key: 'price-desc', label: 'Price ↓' },
              { key: 'company-asc', label: 'Company A–Z' },
              { key: 'company-desc', label: 'Company Z–A' }
            ].map((opt) => {
              const isActive = sort ? `${sort}-${order}` === opt.key : opt.key === '';
              return (
                <motion.button
                  key={opt.key || 'default'}
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (!opt.key) {
                      setSort('');
                      setOrder('asc');
                    } else {
                      const [nextSort, nextOrder] = opt.key.split('-');
                      setSort(nextSort);
                      setOrder(nextOrder);
                    }
                  }}
                  className={`relative inline-flex items-center overflow-hidden rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-900'
                      : 'border-slate-200 bg-white/90 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sort-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-emerald-600 dark:bg-emerald-500"
                      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    />
                  )}
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Loading skeletons */}
      {loading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: skeletonCount }).map((_, idx) => (
            <div
              key={idx}
              className="card-base overflow-hidden"
            >
              <div className="aspect-[4/3] w-full animate-pulse bg-slate-100 dark:bg-slate-800" />
              <div className="flex flex-col gap-2.5 p-4">
                <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-32 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="mt-1 h-8 w-24 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product grid */}
      {!loading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {!error &&
            visibleProducts.map((product, idx) => (
              <InteractiveProductCard
                key={product.id || product.name}
                product={product}
                index={idx}
                isAdded={addedId === product.id}
                // Inject existing quick-view state handler here.
                onQuickView={() => { setQuickViewImageFailed(false); setQuickViewProduct(product); }}
                // Inject existing cart action handler here (preserves CartContext logic).
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}

          {!error && visibleProducts.length === 0 && (
            <div className="col-span-full card-base px-8 py-14 text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No products match your current filters.
              </p>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSearch('');
                  setSelectedCategories([]);
                  setSelectedCompanies([]);
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-200/90 px-3 py-1.5 text-xs font-semibold text-amber-900 transition-all duration-200 hover:border-amber-400 hover:bg-amber-300 dark:border-amber-500/40 dark:bg-amber-400/20 dark:text-amber-100 dark:hover:bg-amber-400/30"
              >
                <Sparkles className="h-3 w-3" />
                Clear all filters
              </motion.button>
            </div>
          )}

          {error && (
            <div className="col-span-full rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Quick-view modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft-xl dark:border-slate-700 dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuickViewProduct(null)}
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-amber-300 bg-amber-200/90 text-amber-900 shadow-sm backdrop-blur-sm transition hover:border-amber-400 hover:bg-amber-300 dark:border-amber-500/40 dark:bg-amber-400/20 dark:text-amber-100 dark:hover:bg-amber-400/30"
                aria-label="Close quick view"
              >
                <X className="h-4 w-4" />
              </motion.button>
              <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f7f8f3] dark:bg-slate-800">
                  {quickViewProduct.imageUrl && !quickViewImageFailed ? (
                    <img
                      src={quickViewProduct.imageUrl}
                      alt={quickViewProduct.name}
                      className="h-full w-full object-contain p-5"
                      loading="lazy"
                      onError={() => setQuickViewImageFailed(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ImageOff className="h-8 w-8" strokeWidth={1.5} />
                      <span className="text-xs">Product photo unavailable</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3 text-sm">
                  <span className="inline-block rounded-lg bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                    {quickViewProduct.category || 'Uncategorised'}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {quickViewProduct.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Company:{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {quickViewProduct.company}
                    </span>
                  </p>

                  <p className="text-xl font-bold text-brand">
                    {Number.isFinite(quickViewProduct.price)
                      ? `RWF ${quickViewProduct.price.toLocaleString()}`
                      : 'Price on request'}
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:border-emerald-700 hover:bg-emerald-700 dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-900 dark:hover:bg-emerald-400"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
