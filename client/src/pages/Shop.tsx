import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';
import { fadeUp, staggerContainer, pageTransition } from '../design-system/motion';
import type { Product, ProductListResponse } from '@armygurl/shared';
import { formatPrice } from '../lib/formatters';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'A - Z' },
];

const CATEGORIES = [
  { value: '', label: 'All Collections' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'patriotic', label: 'Patriotic' },
  { value: 'everyday', label: 'Everyday' },
  { value: 'custom', label: 'Custom Orders' },
];

const SEASONS = [
  { value: '', label: 'All Seasons' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall / Autumn' },
  { value: 'winter', label: 'Winter' },
  { value: 'year-round', label: 'Year-Round' },
];

export default function Shop() {
  const { category: urlCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: urlCategory ?? searchParams.get('category') ?? '',
    season: searchParams.get('season') ?? '',
    sortBy: searchParams.get('sort') ?? 'newest',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 30000,
    page: 1,
    pageSize: 20,
  });

  useEffect(() => {
    if (urlCategory) setFilters((f) => ({ ...f, category: urlCategory }));
  }, [urlCategory]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.get('/products', {
      params: {
        ...filters,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice < 30000 ? filters.maxPrice : undefined,
        category: filters.category || undefined,
        season: filters.season || undefined,
      },
    }).then((r) => r.data.data as ProductListResponse),
    placeholderData: (prev) => prev,
  });

  const updateFilter = (key: string, value: string | number) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const activeCategory = CATEGORIES.find((c) => c.value === filters.category)?.label ?? 'Shop All';

  return (
    <motion.div {...pageTransition} className="min-h-screen">
      {/* Page header */}
      <div className="bg-slate-900 text-white pt-16 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-olive-500 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-7xl relative">
          <p className="section-label text-olive-300 mb-2">Collection</p>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white">{activeCategory}</h1>
          {data && (
            <p className="text-slate-400 text-sm mt-2">{data.total} products found</p>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-8">
        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <FilterSection title="Collections">
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={filters.category === cat.value}
                        onChange={() => updateFilter('category', cat.value)}
                        className="accent-olive-500"
                      />
                      <span className={`text-sm transition-colors ${filters.category === cat.value ? 'text-olive-600 font-medium' : 'text-slate-600 group-hover:text-olive-500'}`}>
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Season">
                <div className="space-y-2">
                  {SEASONS.map((s) => (
                    <label key={s.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="season"
                        value={s.value}
                        checked={filters.season === s.value}
                        onChange={() => updateFilter('season', s.value)}
                        className="accent-olive-500"
                      />
                      <span className={`text-sm transition-colors ${filters.season === s.value ? 'text-olive-600 font-medium' : 'text-slate-600 group-hover:text-olive-500'}`}>
                        {s.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{formatPrice(filters.minPrice)}</span>
                    <span>{filters.maxPrice >= 30000 ? 'Any' : formatPrice(filters.maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30000}
                    step={500}
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                    className="w-full accent-olive-500"
                  />
                </div>
              </FilterSection>

              {(filters.category || filters.season) && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, category: '', season: '', page: 1 }))}
                  className="text-sm text-crimson-600 hover:text-crimson-700 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden btn-outline text-sm gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="text-sm border border-cream-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-olive-400"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card-base overflow-hidden">
                      <div className="skeleton" style={{ aspectRatio: '4/5' }} />
                      <div className="p-4 space-y-2">
                        <div className="skeleton h-4 rounded w-3/4" />
                        <div className="skeleton h-3 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <p className="font-heading text-xl text-slate-700 mb-2">No products found</p>
                  <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                </motion.div>
              ) : (
                <motion.div
                  key={JSON.stringify(filters)}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {data?.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {[...Array(data.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${filters.page === i + 1 ? 'bg-olive-500 text-white' : 'bg-cream-100 text-slate-600 hover:bg-cream-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-cream-200 pb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-sm font-semibold text-slate-800 uppercase tracking-wide">{title}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
