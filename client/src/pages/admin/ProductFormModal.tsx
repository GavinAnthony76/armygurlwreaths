import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { createProductSchema } from '@armygurl/shared';
import type { CreateProductInput, Product } from '@armygurl/shared';
import { toast } from 'sonner';

interface Props {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category { id: string; name: string; }

export default function ProductFormModal({ product, onClose, onSuccess }: Props) {
  const primaryImg = product?.images.find((i) => i.isPrimary) ?? product?.images[0];
  const secondaryImg = product?.images.find((i) => !i.isPrimary && i !== primaryImg);

  const [primaryImageUrl, setPrimaryImageUrl] = useState(primaryImg?.url ?? '');
  const [secondaryImageUrl, setSecondaryImageUrl] = useState(secondaryImg?.url ?? '');
  const [tagsInput, setTagsInput] = useState(product?.tags?.join(', ') ?? '');
  const isEdit = !!product;

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.data),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: getDefaults(product),
  });

  useEffect(() => {
    reset(getDefaults(product));
    setPrimaryImageUrl(primaryImg?.url ?? '');
    setSecondaryImageUrl(secondaryImg?.url ?? '');
    setTagsInput(product?.tags?.join(', ') ?? '');
  }, [product?.id]);

  const onSubmit = async (data: CreateProductInput) => {
    if (data.categoryId === '') {
      data.categoryId = undefined;
    }

    data.tags = tagsInput ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean) : [];

    try {
      let productId = product?.id;

      if (isEdit) {
        await api.patch(`/products/${productId}`, data);

        if (primaryImageUrl || secondaryImageUrl) {
          for (const img of product.images) {
            await api.delete(`/products/${productId}/images/${img.id}`).catch(() => {});
          }
          if (primaryImageUrl) {
            await api.post(`/products/${productId}/images`, { url: primaryImageUrl, isPrimary: true });
          }
          if (secondaryImageUrl) {
            await api.post(`/products/${productId}/images`, { url: secondaryImageUrl, isPrimary: false });
          }
        }
        toast.success('Product updated');
      } else {
        const { data: res } = await api.post('/products', data);
        productId = res.data.id;
        if (primaryImageUrl) {
          await api.post(`/products/${productId}/images`, { url: primaryImageUrl, isPrimary: true });
        }
        if (secondaryImageUrl) {
          await api.post(`/products/${productId}/images`, { url: secondaryImageUrl, isPrimary: false });
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">SKU</label>
            <input {...register('sku')} className="admin-input" placeholder="AGW-001" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
            <select {...register('categoryId')} className="admin-input">
              <option value="">--- No category ---</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  {...register('price', { setValueAs: (v) => Math.round(parseFloat(v || '0') * 100) })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="admin-input pl-7"
                  placeholder="85.00"
                  defaultValue={product ? (product.price / 100).toFixed(2) : ''}
                />
              </div>
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Compare At (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  {...register('compareAtPrice', { setValueAs: (v) => v ? Math.round(parseFloat(v) * 100) : undefined })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="admin-input pl-7"
                  placeholder="110.00"
                  defaultValue={product?.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : ''}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Stock Qty</label>
              <input {...register('stockQty', { valueAsNumber: true })} type="number" min="0" className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Low Stock Alert At</label>
              <input {...register('lowStockThreshold', { valueAsNumber: true })} type="number" min="0" className="admin-input" placeholder="3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Season</label>
            <select {...register('season')} className="admin-input">
              <option value="">--- None ---</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
              <option value="year-round">Year-Round</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Tags <span className="text-slate-500 font-normal">(comma separated)</span></label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="admin-input"
              placeholder="military, patriotic, holiday"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Primary Image URL</label>
              <input
                value={primaryImageUrl}
                onChange={(e) => setPrimaryImageUrl(e.target.value)}
                className="admin-input"
                placeholder="https://example.com/primary.jpg"
              />
              {primaryImageUrl && (
                <img src={primaryImageUrl} alt="Primary preview" className="mt-2 h-16 w-16 object-cover rounded-lg border border-slate-700" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Hover Image URL <span className="text-slate-500 font-normal">(shows on card hover)</span></label>
              <input
                value={secondaryImageUrl}
                onChange={(e) => setSecondaryImageUrl(e.target.value)}
                className="admin-input"
                placeholder="https://example.com/hover.jpg"
              />
              {secondaryImageUrl && (
                <img src={secondaryImageUrl} alt="Hover preview" className="mt-2 h-16 w-16 object-cover rounded-lg border border-slate-700" />
              )}
            </div>
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

function getDefaults(product: Product | null): Partial<CreateProductInput> {
  if (!product) {
    return {
      isActive: true,
      isFeatured: false,
      isCustomizable: false,
      stockQty: 0,
      lowStockThreshold: 3,
      tags: [],
    };
  }
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? undefined,
    sku: product.sku ?? undefined,
    stockQty: product.stockQty,
    lowStockThreshold: product.lowStockThreshold,
    categoryId: product.category?.id ?? undefined,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    isCustomizable: product.isCustomizable,
    tags: product.tags,
    season: product.season ?? undefined,
  };
}
