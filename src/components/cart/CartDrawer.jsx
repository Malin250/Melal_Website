import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

const WHATSAPP_NUMBER = '250794018454';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk0YTNiOCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';

function buildWhatsAppMessage(items, totalPrice) {
  const lines = [
    'Hello, I would like to place an order:',
    '',
    '🛒 Order Details:',
  ];

  items.forEach((item) => {
    const lineTotal =
      Number(item.price) > 0
        ? ` — RWF ${(Number(item.price) * item.qty).toLocaleString()}`
        : '';
    lines.push(`- ${item.name} × ${item.qty}${lineTotal}`);
  });

  if (totalPrice > 0) {
    lines.push('', `💰 Total: RWF ${totalPrice.toLocaleString()}`);
  }

  lines.push('', 'Please confirm availability.', '', 'Thank you.');

  return lines.join('\n');
}

export function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice, totalProfit } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOrderWhatsApp = () => {
    const message = buildWhatsAppMessage(items, totalPrice);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Notify store owner via self-hosted whatsapp-web.js backend (fire-and-forget)
    fetch('/api/notify-owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, totalPrice, totalProfit }),
    }).catch(() => {/* non-critical – silently ignore */});

    clearCart();
    setShowConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Browse products and add items to get started.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                        <img
                          src={item.imageUrl || PLACEHOLDER_IMAGE}
                          alt={item.name}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {Number(item.price) > 0 && (
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            RWF {Number(item.price).toLocaleString()} each
                          </p>
                        )}
                        <div className="mt-1 flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-l-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[1.5rem] text-center text-xs font-semibold text-slate-900 dark:text-white">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-r-lg text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {Number(item.price) > 0 && (
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                              RWF {(Number(item.price) * item.qty).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-slate-200/80 px-5 py-4 dark:border-slate-800">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
                  </span>
                  {totalPrice > 0 && (
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      RWF {totalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe57] hover:shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  Order on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-2 w-full text-center text-xs font-medium text-slate-400 transition hover:text-red-500"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>

          {/* Confirmation popup */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirm(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10">
                      <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                      Send Order via WhatsApp
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      You will be redirected to WhatsApp to complete your order. The store will confirm availability and total price.
                    </p>

                    {/* Order preview */}
                    <div className="mt-4 w-full rounded-xl bg-slate-50 p-3 text-left dark:bg-slate-800/50">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Order Preview
                      </p>
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300"
                          >
                            <span className="truncate pr-2">{item.name} × {item.qty}</span>
                            {Number(item.price) > 0 && (
                              <span className="flex-shrink-0 font-medium">
                                RWF {(Number(item.price) * item.qty).toLocaleString()}
                              </span>
                            )}
                          </li>
                        ))}
                        {totalPrice > 0 && (
                          <li className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                            <span>Total</span>
                            <span>RWF {totalPrice.toLocaleString()}</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="mt-5 flex w-full gap-2">
                      <button
                        type="button"
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleOrderWhatsApp}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Send Order
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
