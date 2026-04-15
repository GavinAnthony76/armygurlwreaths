import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, Package, Truck, MapPin } from 'lucide-react';
import api from '../lib/api';
import { formatPrice, formatDate, formatOrderStatus, getOrderStatusColor } from '../lib/formatters';
import { pageTransition, staggerContainer, fadeUp } from '../design-system/motion';
import type { Order } from '@armygurl/shared';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then((r) => r.data.data as Order),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto max-w-3xl space-y-4">
          <div className="skeleton h-8 rounded w-1/3" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto max-w-3xl text-center">
          <Package className="w-12 h-12 text-cream-400 mx-auto mb-4" />
          <p className="font-heading text-xl text-slate-700 mb-2">Order not found</p>
          <Link to="/orders" className="btn-primary mt-4 inline-flex">Back to Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <Link to="/orders" className="flex items-center gap-1 text-sm text-olive-600 hover:text-olive-700 mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Orders
        </Link>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-start justify-between">
            <div>
              <h1 className="heading-display text-2xl sm:text-3xl">Order {order.orderNumber}</h1>
              <p className="text-sm text-slate-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${getOrderStatusColor(order.status)}`}>
              {formatOrderStatus(order.status)}
            </span>
          </motion.div>

          {order.trackingNumber && (
            <motion.div variants={fadeUp} className="card-base p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Tracking Information</p>
                <p className="text-sm text-slate-600">
                  {order.shippingCarrier && <span className="font-medium">{order.shippingCarrier}: </span>}
                  {order.trackingNumber}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="card-base p-5">
            <h2 className="font-heading font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-olive-600" /> Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.productName}</p>
                    {item.variantName && <p className="text-xs text-slate-500">{item.variantName}</p>}
                    {item.customNote && <p className="text-xs text-olive-600 mt-0.5">Note: {item.customNote}</p>}
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-cream-200 space-y-2">
              <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm text-slate-600"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span></div>
              <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-cream-200"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </motion.div>

          {order.shippingAddress && (
            <motion.div variants={fadeUp} className="card-base p-5">
              <h2 className="font-heading font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive-600" /> Shipping Address
              </h2>
              <div className="text-sm text-slate-600 space-y-0.5">
                <p className="font-medium text-slate-800">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
