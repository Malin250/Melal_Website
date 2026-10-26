import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BadgeCheck, MapPin, MessageCircle, PackageCheck, Search } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { InteractiveProductCard } from '../components/products/InteractiveProductCard.jsx';

const WHATSAPP_URL = 'https://wa.me/250794018454';

function getCategoryLabel(category) {
  const value = String(category || '').toLowerCase();
  return value.includes('drink') || value.includes('beverage') ? 'Drinks' : 'Snacks & Biscuits';
}

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load products.');
        return res.json();
      })
      .then((data) => {
        if (active) setProducts(data.products || []);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = new Map();
    products.forEach((product) => {
      if (!product.category) return;
      const key = String(product.category).toLowerCase().trim();
      if (!unique.has(key)) unique.set(key, product.category);
    });
    return Array.from(unique.values());
  }, [products]);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.imageUrl).slice(0, 8),
    [products]
  );

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (query) navigate(`/products?search=${encodeURIComponent(query)}`);
    else navigate('/products');
  };

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      costPrice: product.costPrice
    });
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="pb-12">
      <section className="relative isolate -mx-5 -mt-4 overflow-hidden bg-[#f3f7e9] sm:-mx-6 lg:-mx-8">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=88"
          alt="Fresh vegetables and groceries"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7e9] via-[#f4f7e9]/95 to-[#f4f7e9]/25 md:via-[#f4f7e9]/88" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f7e9]/55 via-transparent to-white/5" />
        <div className="section-shell relative grid min-h-[400px] items-center py-12 sm:min-h-[470px] sm:py-16 lg:min-h-[500px]">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800/10 bg-white/85 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-900 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Boutique La Différence · Zindiro
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.055em] text-[#18382a] sm:text-5xl lg:text-6xl">
              Fresh groceries,
              <span className="block text-emerald-700">better living.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
              Shop the snacks and drinks on our shelves. Build your basket and send your order directly through WhatsApp.
            </p>
            <form onSubmit={handleSearch} className="mt-6 flex max-w-lg items-center rounded-2xl border border-white bg-white p-1.5 shadow-[0_16px_40px_-24px_rgba(22,54,37,0.45)]">
              <Search className="ml-3 h-4 w-4 flex-shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products and brands"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Search products and brands"
              />
              <button type="submit" className="rounded-xl bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 sm:px-5">
                Search
              </button>
            </form>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                Shop all products <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/15 bg-white/90 px-5 py-3 text-sm font-bold text-emerald-900 transition hover:bg-white">
                <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp us
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-6 hidden items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-[11px] font-semibold text-emerald-950 shadow-md backdrop-blur md:flex">
          <MapPin className="h-3.5 w-3.5 text-emerald-700" />
          Your neighbourhood shop in Zindiro
        </div>
      </section>

      <section className="relative z-10 -mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: MapPin, title: 'Based in Zindiro', text: 'Boutique La Différence, Kigali' },
          { icon: MessageCircle, title: 'Order on WhatsApp', text: 'We confirm your items directly' },
          { icon: BadgeCheck, title: 'Shop with confidence', text: 'Browse current store inventory' }
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.4)]">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <item.icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-bold text-slate-900">{item.title}</span>
              <span className="mt-0.5 block text-[11px] text-slate-500">{item.text}</span>
            </span>
          </div>
        ))}
      </section>

      <section className="mt-12 sm:mt-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">What are you looking for?</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Shop by category</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-600 sm:inline-flex">
            Browse inventory <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const drinkCategory = getCategoryLabel(category) === 'Drinks';
            const sample = products.find((product) => product.category === category && product.imageUrl);
            return (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group relative flex min-h-[148px] items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-soft"
              >
                <div className="relative z-10 max-w-[65%]">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] ${drinkCategory ? 'bg-sky-50 text-sky-800' : 'bg-amber-50 text-amber-800'}`}>
                    ${products.filter((product) => product.category === category).length} items
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold text-slate-900">{getCategoryLabel(category)}</h3>
                  <p className="mt-1 text-xs text-slate-500">{drinkCategory ? 'Juices, soft drinks, water and more.' : 'Biscuits, crisps, sweets and treats.'}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-800">Shop category <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span>
                </div>
                <div className={`absolute bottom-0 right-0 top-0 flex w-[42%] items-center justify-center ${drinkCategory ? 'bg-sky-50/80' : 'bg-amber-50/80'}`}>
                  {sample ? (
                    <img src={sample.imageUrl} alt="" className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />
                  ) : (
                    <PackageCheck className="h-12 w-12 text-emerald-300" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">From our current stock</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Popular products</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-600">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="aspect-square animate-pulse bg-slate-100" />
                <div className="space-y-2 p-4"><div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" /><div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <InteractiveProductCard
                key={product.id || product.name}
                product={product}
                index={index}
                isAdded={addedId === product.id}
                onQuickView={() => navigate(`/products?search=${encodeURIComponent(product.name)}`)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 overflow-hidden rounded-3xl bg-[#153d2c] text-white sm:mt-16">
        <div className="grid items-center gap-6 px-6 py-8 sm:grid-cols-[1fr_auto] sm:px-9 sm:py-10">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">A simple way to shop</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Your order, sent straight to WhatsApp.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80">Add items to your basket, review your order, and send it to the shop. We’ll confirm availability with you.</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1ebe57]">
            <MessageCircle className="h-4 w-4" /> Chat with the shop
          </a>
        </div>
      </section>

      <section className="mt-12 border-t border-slate-200 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">A few familiar favourites</h2>
            <p className="mt-1 text-xs text-slate-500">Browse snacks and drinks from brands stocked in store.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Inyange', 'Mirinda', 'Pepsi', 'Pringles', 'ADMA', 'Savanah'].map((brand) => (
              <Link key={brand} to={`/products?search=${encodeURIComponent(brand)}`} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800">
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
