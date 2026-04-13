import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../lib/formatters';
import { pageTransition, staggerContainer, fadeUp } from '../design-system/motion';

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const subtotal = items.reduce((s, i) => s + (i.productPrice + i.variantPriceAdj) * i.quantity, 0);
  const shippingCost = subtotal >= 7500 ? 0 : 895;

  return (
    <motion.div {...pageTransition} className="min-h-screen py-12">
      <div className="container mx-auto max-w-5xl">
        <h1 className="heading-display text-3xl mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="card-base p-16 text-center">
            <ShoppingBag className="w-16 h-16 text-cream-400 mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-slate-700 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Discover our handcrafted wreath collection</p>
            <Link to="/shop" className="btn-primary">Browse Wreaths <ArrowRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  exit={{ opacity: 0, x: -20 }}
                  className="card-base p-5 flex items-start gap-4"
                >
                  <Link to={`/products/${item.productSlug}`}>
                    <div className="w-20 h-20 rounded-lg bg-cream-100 overflow-hidden flex-shrink-0">
                      {item.productImage && (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.productSlug}`} className="font-medium text-slate-900 hover:text-olive-600 transition-colors">
                      {item.productName}
                    </Link>
                    {item.variantName && <p className="text-sm text-slate-500">{item.variantName}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 border border-cream-300 rounded-lg">
                        <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-cream-100 rounded-l-lg">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-cream-100 rounded-r-lg">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{formatPrice((item.productPrice + item.variantPriceAdj) * item.quantity)}</span>
                        <button onClick={() => removeItem(item.productId, item.variantId)} className="text-slate-400 hover:text-crimson-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card-base p-6 sticky top-24">
                <h2 className="font-heading font-semibold text-slate-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
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
                  <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-cream-200">
                    <span>Total</span><span>{formatPrice(subtotal + shippingCost)}</span>
                  </div>
                </div>
                <Link to="/checkout" className="btn-primary w-full justify-center">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/shop" className="block text-center text-sm text-slate-500 hover:text-slate-700 mt-3 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
