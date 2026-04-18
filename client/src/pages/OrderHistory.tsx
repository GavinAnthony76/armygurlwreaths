import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { formatPrice, formatDate, formatOrderStatus, getOrderStatusColor } from '../lib/formatters';
import { pageTransition, staggerContainer, fadeUp } from '../design-system/motion';
import type { Order } from '@armygurl/shared';

export default function OrderHistory() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then((r) => r.data.data as Order[]),
  });

  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <h1 className="heading-display text-3xl mb-8">Order History</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ) : orders?.length === 0 ? (
          <div className="card-base p-12 text-center">
            <Package className="w-12 h-12 text-cream-400 mx-auto mb-4" />
            <p className="font-heading text-xl text-slate-700 mb-2">No orders yet</p>
            <p className="text-slate-500 text-sm mb-6">When you place an order, it will appear here.</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            {orders?.map((order) => (
              <motion.div key={order.id} variants={fadeUp}>
                <Link
                  to={`/orders/${order.orderNumber}`}
                  className="card-base p-5 block hover:shadow-card-hover transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900 font-mono">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getOrderStatusColor(order.status)}`}>
                        {formatOrderStatus(order.status)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <p className="font-semibold text-slate-900">{formatPrice(order.total)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
