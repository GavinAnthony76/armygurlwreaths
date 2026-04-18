import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Package, Truck } from 'lucide-react';
import api from '../../lib/api';
import { formatPrice, formatDate, formatOrderStatus, getOrderStatusColor } from '../../lib/formatters';
import type { Order } from '@armygurl/shared';
import { toast } from 'sonner';

const STATUSES = ['pending', 'payment_processing', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { carrier: string; trackingNumber: string }>>({});
  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders', statusFilter],
    queryFn: () => api.get(`/orders/admin/all${statusFilter ? `?status=${statusFilter}` : ''}`).then((r) => r.data.data as Order[]),
  });

  const updateOrder = useMutation({
    mutationFn: ({ id, ...data }: { id: string; status: string; trackingNumber?: string; carrier?: string }) =>
      api.patch(`/orders/admin/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Order updated');
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const tracking = trackingInputs[orderId];
    updateOrder.mutate({
      id: orderId,
      status: newStatus,
      ...(tracking?.trackingNumber && { trackingNumber: tracking.trackingNumber }),
      ...(tracking?.carrier && { carrier: tracking.carrier }),
    });
  };

  const handleShipWithTracking = (orderId: string) => {
    const tracking = trackingInputs[orderId];
    if (!tracking?.trackingNumber) {
      toast.error('Please enter a tracking number');
      return;
    }
    updateOrder.mutate({
      id: orderId,
      status: 'shipped',
      trackingNumber: tracking.trackingNumber,
      carrier: tracking.carrier || 'USPS',
    });
  };

  const getTrackingInput = (orderId: string) => trackingInputs[orderId] ?? { carrier: '', trackingNumber: '' };
  const setTracking = (orderId: string, field: 'carrier' | 'trackingNumber', value: string) => {
    setTrackingInputs((prev) => ({ ...prev, [orderId]: { ...getTrackingInput(orderId), [field]: value } }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-white">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-olive-500"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{formatOrderStatus(s)}</option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-400 text-sm">Failed to load orders. Please try again.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-900 rounded-xl border border-slate-800 animate-pulse" />)}
        </div>
      ) : orders?.length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
          <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders?.map((order) => (
            <div key={order.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-white">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{order.email}</p>
                </div>
                <div className="hidden sm:block text-xs text-slate-500">{formatDate(order.createdAt)}</div>
                <div className="hidden sm:block text-xs text-slate-500">{order.items.length} items</div>
                <select
                  value={order.status}
                  onChange={(e) => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-xs px-2 py-1 rounded-full border bg-transparent focus:outline-none cursor-pointer ${getOrderStatusColor(order.status)}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{formatOrderStatus(s)}</option>
                  ))}
                </select>
                <span className="text-sm font-medium text-white">{formatPrice(order.total)}</span>
                {expandedOrder === order.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-slate-800 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="text-slate-300">{item.productName}</span>
                              {item.variantName && <span className="text-xs text-slate-500 ml-2">({item.variantName})</span>}
                              <span className="text-slate-500 ml-2">x{item.quantity}</span>
                            </div>
                            <span className="text-slate-300">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-1 text-sm">
                        <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                        <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span></div>
                        <div className="flex justify-between text-white font-medium"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                      </div>
                    </div>

                    <div>
                      {order.shippingAddress && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Shipping Address</h4>
                          <div className="text-sm text-slate-300 space-y-0.5">
                            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                            <p>{order.shippingAddress.address1}</p>
                            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                            {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5" /> Shipping & Tracking
                        </h4>
                        <div className="space-y-2">
                          <select
                            value={getTrackingInput(order.id).carrier || order.shippingCarrier || ''}
                            onChange={(e) => setTracking(order.id, 'carrier', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-olive-500"
                          >
                            <option value="">Select carrier</option>
                            <option value="USPS">USPS</option>
                            <option value="UPS">UPS</option>
                            <option value="FedEx">FedEx</option>
                            <option value="DHL">DHL</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Tracking number"
                            value={getTrackingInput(order.id).trackingNumber || order.trackingNumber || ''}
                            onChange={(e) => setTracking(order.id, 'trackingNumber', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-olive-500 placeholder-slate-600"
                          />
                          <button
                            onClick={() => handleShipWithTracking(order.id)}
                            className="w-full bg-olive-600 hover:bg-olive-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                          >
                            Mark as Shipped
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-4 pt-2 border-t border-slate-800">
                    <span>Payment: {order.paymentProvider}</span>
                    {order.notes && <span>Notes: {order.notes}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
