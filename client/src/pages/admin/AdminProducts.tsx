import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import api from '../../lib/api';
import { formatPrice, formatDate } from '../../lib/formatters';
import type { Product } from '@armygurl/shared';
import { toast } from 'sonner';
import ProductFormModal from './ProductFormModal';

export default function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => api.get('/products?pageSize=100&isActive=true').then((r) => r.data.data.products as Product[]),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); toast.success('Product removed'); },
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      api.patch(`/products/${id}`, { isFeatured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-white">Products</h1>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-olive-600 hover:bg-olive-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
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
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4 hidden sm:table-cell">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4 hidden md:table-cell">Stock</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((product) => {
                const img = product.images.find((i) => i.isPrimary) ?? product.images[0];
                return (
                  <tr key={product.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex-shrink-0 overflow-hidden">
                          {img && <img src={img.url} alt={product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.sku ?? product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-xs text-slate-400">{product.category?.name ?? '—'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white">{formatPrice(product.price)}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        product.stockQty === 0 ? 'bg-red-900/50 text-red-400' :
                        product.stockQty <= product.lowStockThreshold ? 'bg-amber-900/50 text-amber-400' :
                        'bg-green-900/50 text-green-400'
                      }`}>
                        {product.stockQty} units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeatured.mutate({ id: product.id, isFeatured: !product.isFeatured })}
                          className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? 'text-gold-400 bg-gold-400/10 hover:bg-gold-400/20' : 'text-slate-500 hover:text-gold-400 hover:bg-slate-800'}`}
                          title={product.isFeatured ? 'Remove from featured' : 'Set as featured'}
                        >
                          <Star className={`w-3.5 h-3.5 ${product.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => { setEditProduct(product); setShowForm(true); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this product?')) deleteMut.mutate(product.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); }}
        />
      )}
    </div>
  );
}
