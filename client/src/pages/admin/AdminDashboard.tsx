import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import api from '../../lib/api';
import { formatPrice, formatDate, formatOrderStatus, getOrderStatusColor } from '../../lib/formatters';
import { staggerContainer, fadeUp } from '../../design-system/motion';
import type { Order } from '@armygurl/shared';

export default function AdminDashboard() {
  const { data: orders } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => api.get('/orders/admin/all?pageSize=100').then((r) => r.data.data as Order[]),
  });

  const revenue = orders?.reduce((sum, o) => sum + (['paid', 'in_production', 'shipped', 'delivered'].includes(o.status) ? o.total : 0), 0) ?? 0;
  const totalOrders = orders?.length ?? 0;
  const pendingOrders = orders?.filter((o) => ['paid', 'in_production'].includes(o.status)).length ?? 0;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(revenue), icon: <DollarSign className="w-5 h-5" />, color: 'text-green-400 bg-green-400/10' },
    { label: 'Total Orders', value: String(totalOrders), icon: <ShoppingCart className="w-5 h-5" />, color: 'text-blue-400 bg-blue-400/10' },
    { label: 'Pending', value: String(pendingOrders), icon: <Package className="w-5 h-5" />, color: 'text-amber-400 bg-amber-400/10' },
    { label: 'Avg Order', value: totalOrders ? formatPrice(revenue / totalOrders) : '$0', icon: <TrendingUp className="w-5 h-5" />, color: 'text-olive-400 bg-olive-400/10' },
  ];

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-white mb-6">Dashboard</h1>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="font-bold text-2xl text-white">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
        <h2 className="font-semibold text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-800">
                <th className="text-left pb-3 pr-4">Order #</th>
                <th className="text-left pb-3 pr-4">Date</th>
                <th className="text-left pb-3 pr-4">Status</th>
                <th className="text-right pb-3">Total</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {orders?.slice(0, 10).map((order) => (
                <tr key={order.id} className="border-b border-slate-800/50 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-slate-300">{order.orderNumber}</td>
                  <td className="py-3 pr-4 text-xs text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getOrderStatusColor(order.status)}`}>
                      {formatOrderStatus(order.status)}
                    </span>
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-white">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
