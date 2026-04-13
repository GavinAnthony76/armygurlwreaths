import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import api from '../lib/api';
import { useCartStore } from '../stores/cartStore';
import { shippingAddressSchema } from '@armygurl/shared';
import { formatPrice } from '../lib/formatters';
import { fadeUp, staggerContainer, pageTransition } from '../design-system/motion';
import { Shield, Lock, Truck } from 'lucide-react';
import { toast } from 'sonner';
import type { ShippingAddressInput } from '@armygurl/shared';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function Checkout() {
  const { items } = useCartStore();
  const [shippingData, setShippingData] = useState<ShippingAddressInput | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  const subtotal = items.reduce((s, i) => s + (i.productPrice + i.variantPriceAdj) * i.quantity, 0);
  const shippingCost = subtotal >= 7500 ? 0 : 895;
  const total = subtotal + shippingCost;

  const handleShippingSubmit = async (data: ShippingAddressInput) => {
    try {
      const response = await api.post('/checkout/intent', { shippingAddress: data });
      setClientSecret(response.data.data.clientSecret);
      setShippingData(data);
      setStep('payment');
    } catch {
      toast.error('Could not initialize payment. Please try again.');
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-cream-50 py-10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-olive-600" />
              <h1 className="font-heading font-bold text-2xl text-slate-900">Secure Checkout</h1>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-3 mb-6">
              {[{ id: 'shipping', label: 'Shipping' }, { id: 'payment', label: 'Payment' }].map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s.id ? 'bg-olive-500 text-white' : i < ['shipping', 'payment'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-cream-200 text-slate-500'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm ${step === s.id ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>{s.label}</span>
                  {i < 1 && <div className="w-12 h-px bg-cream-300 mx-1" />}
                </div>
              ))}
            </div>

            {step === 'shipping' ? (
              <ShippingForm onSubmit={handleShippingSubmit} />
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentStep shippingData={shippingData!} total={total} />
              </Elements>
            ) : null}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="card-base p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-slate-900 mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-cream-100 flex-shrink-0 overflow-hidden relative">
                      {item.productImage && (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      )}
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-olive-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.productName}</p>
                      {item.variantName && <p className="text-xs text-slate-500">{item.variantName}</p>}
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {formatPrice((item.productPrice + item.variantPriceAdj) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-cream-200">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-cream-100 rounded-lg px-3 py-2">
                <Shield className="w-3.5 h-3.5 text-green-600" />
                256-bit SSL encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShippingForm({ onSubmit }: { onSubmit: (data: ShippingAddressInput) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { country: 'US' },
  });

  return (
    <motion.form
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="card-base p-6 space-y-4"
    >
      <motion.h2 variants={fadeUp} className="font-heading font-semibold text-slate-900 text-lg">
        Shipping Address
      </motion.h2>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" error={errors.firstName?.message}>
          <input {...register('firstName')} className="form-input" placeholder="Jane" />
        </FormField>
        <FormField label="Last Name" error={errors.lastName?.message}>
          <input {...register('lastName')} className="form-input" placeholder="Smith" />
        </FormField>
      </div>
      <FormField label="Address" error={errors.address1?.message}>
        <input {...register('address1')} className="form-input" placeholder="123 Main Street" />
      </FormField>
      <FormField label="Apartment, Suite, etc." error={errors.address2?.message}>
        <input {...register('address2')} className="form-input" placeholder="Apt 4B (optional)" />
      </FormField>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <FormField label="City" error={errors.city?.message} className="col-span-2 sm:col-span-1">
          <input {...register('city')} className="form-input" placeholder="Atlanta" />
        </FormField>
        <FormField label="State" error={errors.state?.message}>
          <input {...register('state')} className="form-input" placeholder="GA" maxLength={2} />
        </FormField>
        <FormField label="ZIP Code" error={errors.postalCode?.message}>
          <input {...register('postalCode')} className="form-input" placeholder="30301" />
        </FormField>
      </div>
      <FormField label="Phone (optional)" error={errors.phone?.message}>
        <input {...register('phone')} className="form-input" placeholder="(555) 555-5555" type="tel" />
      </FormField>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3.5"
      >
        {isSubmitting ? 'Processing...' : 'Continue to Payment'}
      </button>
    </motion.form>
  );
}

function PaymentStep({ shippingData, total }: { shippingData: ShippingAddressInput; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    if (error) {
      toast.error(error.message ?? 'Payment failed');
      setLoading(false);
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      clearCart();
      navigate(`/order-confirmation/${paymentIntent.id}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="card-base p-6">
        <h2 className="font-heading font-semibold text-slate-900 text-lg mb-4">Payment</h2>
        <form onSubmit={handleStripeSubmit} className="space-y-4">
          <PaymentElement />
          <button type="submit" disabled={loading || !stripe} className="btn-primary w-full py-3.5">
            {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cream-200" />
          </div>
          <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3">or pay with</div>
        </div>

        <div className="flex items-center justify-center">
          <PayPalButtons
            style={{ layout: 'horizontal', height: 44 }}
            createOrder={async () => {
              const { data } = await api.post('/checkout/paypal/create');
              return data.data.orderId;
            }}
            onApprove={async (data) => {
              await api.post('/checkout/paypal/capture', {
                paypalOrderId: data.orderID,
                shippingAddress: shippingData,
              });
              clearCart();
              navigate(`/order-confirmation/${data.orderID}`);
            }}
            onError={() => toast.error('PayPal payment failed. Please try again.')}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> SSL Secured</div>
        <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Stripe Protected</div>
        <div className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Ships in 5-7 days</div>
      </div>
    </div>
  );
}

function FormField({ label, error, children, className = '' }: {
  label: string; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-crimson-600 mt-1">{error}</p>}
    </div>
  );
}
