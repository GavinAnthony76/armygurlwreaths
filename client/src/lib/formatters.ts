export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pending',
    payment_processing: 'Processing Payment',
    paid: 'Payment Confirmed',
    in_production: 'Being Crafted',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return map[status] ?? status;
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    payment_processing: 'text-blue-600 bg-blue-50 border-blue-200',
    paid: 'text-green-600 bg-green-50 border-green-200',
    in_production: 'text-olive-600 bg-olive-50 border-olive-200',
    shipped: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    delivered: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
    refunded: 'text-gray-600 bg-gray-50 border-gray-200',
  };
  return map[status] ?? 'text-gray-600 bg-gray-50';
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str;
}
