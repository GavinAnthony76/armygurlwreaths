import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Heart, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import { formatPrice } from '../lib/formatters';
import { pageTransition, staggerContainer, fadeUp } from '../design-system/motion';
import type { Order } from '@armygurl/shared';

export default function OrderConfirmation() {
  const { id } = useParams();

  const { data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then((r) => r.data.data as Order),
    enabled: !!id,
    retry: 2,
  });

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-cream-50 flex items-center justify-center py-16">
      <div className="container mx-auto max-w-lg">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="card-base p-10 text-center"
        >
          <motion.div
            variants={{ hidden: { scale: 0 }, visible: { scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } } }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <motion.p variants={fadeUp} className="section-label mb-2">Order Confirmed!</motion.p>
          <motion.h1 variants={fadeUp} className="font-heading font-bold text-3xl text-slate-900 mb-3">
            Thank You!
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-600 mb-2">
            Your handcrafted wreath is now in queue to be made with love.
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-slate-500 mb-2">
            Order reference: <span className="font-medium text-slate-700 font-mono">{order?.orderNumber ?? id}</span>
          </motion.p>
          {order && (
            <motion.p variants={fadeUp} className="text-sm font-semibold text-slate-800 mb-6">
              Total: {formatPrice(order.total)}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="bg-cream-100 rounded-xl p-5 mb-8 text-left space-y-3">
            {[
              { icon: <Package className="w-4 h-4 text-olive-600" />, title: 'In Production', text: 'Your wreath will be handcrafted within 5-7 business days' },
              { icon: <Heart className="w-4 h-4 text-crimson-500" />, title: 'Made with Love', text: 'Each piece is crafted by hand, just for you' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <Link to={order ? `/orders/${order.orderNumber}` : '/orders'} className="btn-primary flex-1 justify-center">
              View Order Details
            </Link>
            <Link to="/shop" className="btn-outline flex-1 justify-center">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
