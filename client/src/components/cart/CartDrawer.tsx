import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../lib/formatters';
import { drawerVariants, overlayVariants } from '../../design-system/motion';

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + (item.productPrice + item.variantPriceAdj) * item.quantity,
    0
  );
  const shippingCost = subtotal >= 7500 ? 0 : 895;
  const total = subtotal + shippingCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-modal z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-olive-600" />
                <h2 className="font-heading font-semibold text-slate-900">Your Cart</h2>
                {items.length > 0 && (
                  <span className="bg-olive-100 text-olive-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="btn-ghost p-1.5 rounded-full"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-cream-400" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-slate-800">Your cart is empty</p>
                    <p className="text-sm text-slate-500 mt-1">Add some beautiful wreaths!</p>
                  </div>
                  <button onClick={closeCart} className="btn-outline">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 pb-4 border-b border-cream-100 last:border-0"
                    >
                      {/* Image */}
                      <Link to={`/products/${item.productSlug}`} onClick={closeCart}>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-cream-400">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.productSlug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-slate-800 hover:text-olive-600 transition-colors line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        {item.variantName && (
                          <p className="text-xs text-slate-500 mt-0.5">{item.variantName}</p>
                        )}
                        {item.customNote && (
                          <p className="text-xs text-olive-600 mt-0.5 italic">"{item.customNote}"</p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity */}
                          <div className="flex items-center gap-1 bg-cream-100 rounded-full p-0.5">
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-600 hover:bg-cream-200 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-600 hover:bg-cream-200 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {formatPrice((item.productPrice + item.variantPriceAdj) * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-slate-400 hover:text-crimson-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-200 px-6 py-5 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shippingCost)}</span>
                  </div>
                  {subtotal < 7500 && (
                    <p className="text-xs text-olive-600 bg-olive-50 rounded-lg px-3 py-2">
                      Add {formatPrice(7500 - subtotal)} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between font-semibold text-slate-900 pt-1 border-t border-cream-200">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center justify-center"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={closeCart} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
