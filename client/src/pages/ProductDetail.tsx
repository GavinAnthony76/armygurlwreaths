import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, Heart, Share2, Minus, Plus, Check, Shield, Truck } from 'lucide-react';
import api from '../lib/api';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../lib/formatters';
import { fadeUp, staggerContainer, scaleIn, pageTransition } from '../design-system/motion';
import type { Product } from '@armygurl/shared';
import { toast } from 'sonner';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data.data as Product),
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ['products', 'related', product?.id],
    queryFn: () => api.get(`/products/${product!.id}/related`).then((r) => r.data.data as Product[]),
    enabled: !!product?.id,
  });

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) return <div className="container py-20 text-center">Product not found.</div>;

  const primaryImage = product.images[selectedImage] ?? product.images.find((i) => i.isPrimary) ?? product.images[0];
  const variant = product.variants.find((v) => v.id === selectedVariant);
  const effectivePrice = product.price + (variant?.priceAdjustment ?? 0);
  const availableStock = variant ? variant.stockQty : product.stockQty;
  const inStock = availableStock > 0;
  const lowStock = availableStock > 0 && availableStock <= product.lowStockThreshold;

  const handleAddToCart = () => {
    if (product.variants.length > 0 && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    addItem({
      productId: product.id,
      variantId: selectedVariant,
      quantity,
      customNote: customNote || null,
      productName: product.name,
      productSlug: product.slug,
      productPrice: product.price,
      productImage: primaryImage?.url ?? null,
      variantName: variant ? `${variant.name}: ${variant.value}` : null,
      variantPriceAdj: variant?.priceAdjustment ?? 0,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen">
      <div className="container mx-auto max-w-7xl py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-olive-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-olive-600 transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop/${product.category.slug}`} className="hover:text-olive-600 transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-48">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Image gallery */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Main image */}
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden rounded-2xl bg-cream-100 shadow-card"
              style={{ aspectRatio: '1' }}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={primaryImage?.url ?? 'https://placehold.co/800x800/8b7f50/fdfcf7?text=Product+Image'}
                alt={primaryImage?.altText ?? product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <span className="bg-gold-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                )}
                {product.compareAtPrice && (
                  <span className="bg-crimson-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={async () => {
                    const url = window.location.href;
                    if (navigator.share) {
                      await navigator.share({ title: product.name, url }).catch(() => {});
                    } else {
                      await navigator.clipboard.writeText(url).catch(() => {});
                      toast.success('Link copied to clipboard!');
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <motion.div variants={fadeUp} className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i ? 'border-olive-500 shadow-glow-olive' : 'border-transparent hover:border-cream-300'
                    }`}
                  >
                    <img src={img.url} alt={img.altText ?? ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {product.category && (
              <motion.div variants={fadeUp}>
                <Link to={`/shop/${product.category.slug}`} className="section-label hover:text-olive-600 transition-colors">
                  {product.category.name}
                </Link>
              </motion.div>
            )}

            <motion.h1 variants={fadeUp} className="heading-display text-2xl sm:text-3xl lg:text-4xl mt-2 mb-3">
              {product.name}
            </motion.h1>

            {/* Price */}
            <motion.div variants={fadeUp} className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-slate-900">{formatPrice(effectivePrice)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-slate-400 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </motion.div>

            {/* Stock status */}
            <motion.div variants={fadeUp} className="mb-6">
              {!inStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Out of Stock
                </span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Only {availableStock} left!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  In Stock
                </span>
              )}
            </motion.div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <motion.div variants={fadeUp} className="mb-6">
                <p className="text-sm font-medium text-slate-800 mb-3">
                  {product.variants[0]?.name}: <span className="text-olive-600">{variant?.value ?? 'Select one'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      disabled={v.stockQty === 0}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        selectedVariant === v.id
                          ? 'border-olive-500 bg-olive-50 text-olive-700'
                          : v.stockQty === 0
                          ? 'border-cream-200 text-slate-300 cursor-not-allowed line-through'
                          : 'border-cream-300 text-slate-700 hover:border-olive-400 hover:bg-cream-50'
                      }`}
                    >
                      {v.value}
                      {v.priceAdjustment !== 0 && (
                        <span className="ml-1 text-xs text-slate-500">
                          (+{formatPrice(v.priceAdjustment)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Custom note */}
            {product.isCustomizable && (
              <motion.div variants={fadeUp} className="mb-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Personalization Note <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Any special instructions, names to include, color preferences..."
                  className="w-full border border-cream-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-olive-400 transition-colors resize-none"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-slate-400 mt-1">{customNote.length}/500</p>
              </motion.div>
            )}

            {/* Quantity + Add to cart */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              {/* Quantity */}
              <div className="flex items-center gap-0 border border-cream-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-cream-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-cream-100 transition-colors"
                  disabled={quantity >= availableStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`btn-primary flex-1 py-3 text-sm transition-all duration-300 ${
                  added ? 'bg-green-600 hover:bg-green-600' : ''
                }`}
              >
                {added ? (
                  <><Check className="w-4 h-4" /> Added!</>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /> {inStock ? 'Add to Cart' : 'Out of Stock'}</>
                )}
              </button>
            </motion.div>

            {/* Trust signals */}
            <motion.div variants={fadeUp} className="border-t border-cream-200 pt-5 space-y-3">
              {[
                { icon: <Truck className="w-4 h-4" />, text: 'Free shipping on orders over $75' },
                { icon: <Shield className="w-4 h-4" />, text: '100% satisfaction guaranteed' },
                { icon: <Heart className="w-4 h-4" />, text: 'Handcrafted to order in 5-7 business days' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="text-olive-500">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 max-w-3xl"
        >
          <h2 className="font-heading font-semibold text-xl text-slate-900 mb-4">About This Wreath</h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tags.map((tag) => (
                <span key={tag} className="text-sm bg-cream-200 text-slate-600 px-3 py-1 rounded-full capitalize">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Related products */}
        {related && related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-display text-2xl sm:text-3xl">You May Also Love</h2>
              <Link to="/shop" className="text-sm text-olive-600 hover:text-olive-700 font-medium flex items-center gap-1">
                View all <ChevronLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="skeleton rounded-2xl" style={{ aspectRatio: '1' }} />
        <div className="space-y-4">
          <div className="skeleton h-4 rounded w-1/4" />
          <div className="skeleton h-8 rounded w-3/4" />
          <div className="skeleton h-6 rounded w-1/3" />
          <div className="skeleton h-24 rounded" />
          <div className="skeleton h-12 rounded" />
        </div>
      </div>
    </div>
  );
}
