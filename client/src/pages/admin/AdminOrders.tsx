import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatPrice, formatDate, formatOrderStatus, getOrderStatusColor } from '../../lib/formatters';
import type { Order } from '@armygurl/shared';
import { toast } from 'sonner';

const STATUSES = ['pending', 'payment_processing', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
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

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-900 rounded-xl border border-slate-800 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-800 bg-slate-800/50">
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4 hidden sm:table-cell">Customer</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden md:table-cell">Date</th>
                <th className="text-right p-4">Total</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <p className="font-mono text-xs text-white">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.items.length} items</p>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <p className="text-sm text-slate-300">{order.email}</p>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrder.mutate({ id: order.id, status: e.target.value })}
                      className={`text-xs px-2 py-1 rounded-full border bg-transparent focus:outline-none cursor-pointer ${getOrderStatusColor(order.status)}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{formatOrderStatus(s)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-xs text-slate-500">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-medium text-white">{formatPrice(order.total)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-xs text-slate-500">{order.paymentProvider}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
