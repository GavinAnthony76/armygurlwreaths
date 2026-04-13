import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload, ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { createProductSchema } from '@armygurl/shared';
import type { CreateProductInput, Product } from '@armygurl/shared';
import { toast } from 'sonner';

interface Props {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductFormModal({ product, onClose, onSuccess }: Props) {
  const [imageUrl, setImageUrl] = useState(product?.images[0]?.url ?? '');
  const isEdit = !!product;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? undefined,
      stockQty: product.stockQty,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      isCustomizable: product.isCustomizable,
      tags: product.tags,
      season: product.season ?? undefined,
    } : {
      isActive: true,
      isFeatured: false,
      isCustomizable: false,
      stockQty: 0,
      lowStockThreshold: 3,
      tags: [],
    },
  });

  const onSubmit = async (data: CreateProductInput) => {
    try {
      if (isEdit) {
        await api.patch(`/products/${product.id}`, data);
        toast.success('Product updated');
      } else {
        const { data: res } = await api.post('/products', data);
        if (imageUrl) {
          await api.post(`/products/${res.data.id}/images`, { url: imageUrl, isPrimary: true });
        }
        toast.success('Product created');
      }
      onSuccess();
    } catch {
      toast.error('Failed to save product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-modal"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="font-heading font-semibold text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Product Name *</label>
            <input {...register('name')} className="admin-input" placeholder="Autumn Harvest Wreath" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
            <textarea {...register('description')} className="admin-input resize-none" rows={3} placeholder="Describe your wreath..." />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Price (cents) *</label>
              <input {...register('price', { valueAsNumber: true })} type="number" className="admin-input" placeholder="8500 = $85.00" />
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Compare At (cents)</label>
              <input {...register('compareAtPrice', { valueAsNumber: true })} type="number" className="admin-input" placeholder="11000 = $110.00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Stock Qty</label>
              <input {...register('stockQty', { valueAsNumber: true })} type="number" className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Season</label>
              <select {...register('season')} className="admin-input">
                <option value="">— None —</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
                <option value="year-round">Year-Round</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="admin-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { name: 'isActive', label: 'Active' },
              { name: 'isFeatured', label: 'Featured' },
              { name: 'isCustomizable', label: 'Customizable' },
            ].map((field) => (
              <label key={field.name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(field.name as keyof CreateProductInput)}
                  className="w-4 h-4 accent-olive-500"
                />
                <span className="text-sm text-slate-300">{field.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 text-sm font-medium bg-olive-600 hover:bg-olive-500 text-white rounded-lg transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
