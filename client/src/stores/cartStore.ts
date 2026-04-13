import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocalCartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  customNote: string | null;
  productName: string;
  productSlug: string;
  productPrice: number;
  productImage: string | null;
  variantName: string | null;
  variantPriceAdj: number;
}

interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;
  addItem: (item: Omit<LocalCartItem, 'id'>) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  get itemCount(): number;
  get subtotal(): number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));
        } else {
          const id = `${item.productId}-${item.variantId ?? 'default'}-${Date.now()}`;
          set((state) => ({ items: [...state.items, { ...item, id }] }));
        }
        set({ isOpen: true });
      },

      removeItem: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce(
          (sum, i) => sum + (i.productPrice + i.variantPriceAdj) * i.quantity,
          0
        );
      },
    }),
    {
      name: 'agw-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
