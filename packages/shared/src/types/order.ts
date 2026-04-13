export type OrderStatus =
  | 'pending'
  | 'payment_processing'
  | 'paid'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentProvider = 'stripe' | 'paypal';

export interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  price: number;     // cents, snapshot at purchase
  quantity: number;
  customNote: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  status: OrderStatus;
  paymentProvider: PaymentProvider;
  paymentIntentId: string | null;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes: string | null;
  shippingCarrier: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  shippingAddress: ShippingAddress | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  email: string;
  shippingAddress: Omit<ShippingAddress, 'id'>;
  notes?: string;
  paymentProvider: PaymentProvider;
  paymentIntentId: string;
}
