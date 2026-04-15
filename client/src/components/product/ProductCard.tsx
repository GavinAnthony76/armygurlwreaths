import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { formatPrice } from '../../lib/formatters';
import { useCartStore } from '../../stores/cartStore';
import { cardHover, fadeUp } from '../../design-system/motion';
import { cn } from '../../lib/cn';
import type { Product } from '@armygurl/shared';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [wishlist, setWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const secondaryImage = product.images[1];
  const discountPct = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      variantId: null,
      quantity: 1,
      customNote: null,
      productName: product.name,
      productSlug: product.slug,
      productPrice: product.price,
      productImage: primaryImage?.url ?? null,
      variantName: null,
      variantPriceAdj: 0,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn('group', className)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <motion.div
          variants={cardHover}
          initial="rest"
          whileHover="hover"
          className="card-base card-hover overflow-hidden"
        >
          {/* Image container */}
          <div className="product-image relative">
            {/* Primary image */}
            {primaryImage && !imageError ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.name}
                className={cn(
                  'absolute inset-0 w-full h-full object-cover transition-all duration-500',
                  secondaryImage ? 'group-hover:opacity-0' : '',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageError(true); setImageLoaded(true); }}
                loading="lazy"
              />
            ) : imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream-100 text-slate-400 gap-2">
                <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-xs text-center px-4">{product.name}</span>
              </div>
            ) : null}
            {/* Secondary image on hover */}
            {secondaryImage && !imageError && (
              <img
                src={secondaryImage.url}
                alt={secondaryImage.altText ?? product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                loading="lazy"
              />
            )}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 skeleton" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isFeatured && (
                <span className="bg-gold-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Featured
                </span>
              )}
              {discountPct && (
                <span className="bg-crimson-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  -{discountPct}%
                </span>
              )}
              {product.stockQty <= product.lowStockThreshold && product.stockQty > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Only {product.stockQty} left
                </span>
              )}
              {product.stockQty === 0 && (
                <span className="bg-slate-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            {/* Wishlist — always visible on touch/mobile, hover-only on desktop */}
            <button
              onClick={(e) => { e.preventDefault(); setWishlist(!wishlist); }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Add to wishlist"
            >
              <Heart className={cn('w-4 h-4 transition-colors', wishlist ? 'fill-crimson-500 text-crimson-500' : 'text-slate-600')} />
            </button>

            {/* Quick add — always visible on touch/mobile, hover reveal on desktop */}
            {product.stockQty > 0 && (
              <motion.button
                onClick={handleAddToCart}
                className="absolute bottom-3 left-3 right-3 bg-olive-500 hover:bg-olive-600 active:bg-olive-700 text-white text-xs font-medium py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 shadow-card opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Quick Add
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {product.category && (
              <p className="section-label text-[10px] mb-1">{product.category.name}</p>
            )}
            <h3 className="font-heading font-semibold text-slate-900 text-sm leading-snug mb-1 group-hover:text-olive-700 transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {product.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[10px] bg-cream-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-slate-400 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
