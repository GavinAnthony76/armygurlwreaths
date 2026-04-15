import { eq, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { stripe } from '../config/stripe.js';
import { env } from '../config/env.js';
import { orders, orderItems, shippingAddresses, products, productVariants, users } from '../db/schema/index.js';
import { cartService } from './cart.service.js';
import { generateOrderNumber } from '../utils/slug.js';
import { ValidationError } from '../utils/AppError.js';
import type { ShippingAddressInput } from '@armygurl/shared';

interface ClientCartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
  customNote: string | null;
  productName: string;
  productPrice: number;
  variantPriceAdj: number;
  variantName: string | null;
  productImage: string | null;
}

interface CartItemSnapshot {
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  price: number;
  quantity: number;
  customNote: string | null;
}

const FREE_SHIPPING_THRESHOLD = 7500;
const SHIPPING_COST = 895;

function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export const checkoutService = {
  async syncClientCart(userId: string, clientItems: ClientCartItem[]) {
    if (!clientItems.length) return;
    await cartService.clearCart(userId);
    const failedItems: string[] = [];
    for (const item of clientItems) {
      try {
        await cartService.addItem(userId, {
          productId: item.productId,
          variantId: item.variantId ?? undefined,
          quantity: item.quantity,
          customNote: item.customNote ?? undefined,
        });
      } catch (err) {
        failedItems.push(item.productName || item.productId);
      }
    }
    if (failedItems.length > 0) {
      throw new ValidationError(
        `The following items could not be added to your cart (out of stock or unavailable): ${failedItems.join(', ')}`
      );
    }
  },

  async getCartSnapshot(userId: string) {
    const cart = await cartService.getOrCreateCart(userId);
    if (!cart.items.length) throw new ValidationError('Cart is empty');

    const subtotal = cart.items.reduce((sum, item) => {
      const basePrice = item.product.price;
      const variantAdj = item.variant?.priceAdjustment ?? 0;
      return sum + (basePrice + variantAdj) * item.quantity;
    }, 0);

    const shippingCost = calculateShipping(subtotal);
    const total = subtotal + shippingCost;

    const items: CartItemSnapshot[] = cart.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      variantName: item.variant ? `${item.variant.name}: ${item.variant.value}` : null,
      price: item.product.price + (item.variant?.priceAdjustment ?? 0),
      quantity: item.quantity,
      customNote: item.customNote,
    }));

    return { subtotal, shippingCost, total, items };
  },

  async createPendingOrder(
    userId: string,
    paymentProvider: 'stripe' | 'paypal',
    shippingAddress: ShippingAddressInput,
    cartSnapshot: { subtotal: number; shippingCost: number; total: number; items: CartItemSnapshot[] },
    notes?: string
  ) {
    const userRecord = await db.query.users.findFirst({ where: eq(users.id, userId) });
    const userEmail = userRecord?.email ?? '';
    const orderNumber = generateOrderNumber();

    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({
        orderNumber,
        userId,
        email: userEmail,
        status: 'pending',
        paymentProvider,
        subtotal: cartSnapshot.subtotal,
        shippingCost: cartSnapshot.shippingCost,
        taxAmount: 0,
        total: cartSnapshot.total,
        notes,
      }).returning();

      await tx.insert(shippingAddresses).values({ orderId: order.id, userId, ...shippingAddress });

      await tx.insert(orderItems).values(
        cartSnapshot.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          customNote: item.customNote,
        }))
      );

      return order;
    });
  },

  async createStripeIntent(userId: string, shippingAddress: ShippingAddressInput, clientItems?: ClientCartItem[]) {
    if (clientItems?.length) await this.syncClientCart(userId, clientItems);

    const cartSnapshot = await this.getCartSnapshot(userId);

    if (!stripe) {
      return {
        clientSecret: null,
        paymentIntentId: null,
        demoMode: true,
        subtotal: cartSnapshot.subtotal,
        shippingCost: cartSnapshot.shippingCost,
        total: cartSnapshot.total,
      };
    }

    const order = await this.createPendingOrder(userId, 'stripe', shippingAddress, cartSnapshot);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cartSnapshot.total,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { userId, orderId: order.id },
    });

    await db.update(orders)
      .set({ paymentIntentId: paymentIntent.id, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      demoMode: false,
      subtotal: cartSnapshot.subtotal,
      shippingCost: cartSnapshot.shippingCost,
      total: cartSnapshot.total,
    };
  },

  async createDemoOrder(userId: string, shippingAddress: ShippingAddressInput, clientItems?: ClientCartItem[], notes?: string) {
    if (clientItems?.length) await this.syncClientCart(userId, clientItems);
    const demoIntentId = `demo_${Date.now()}`;
    return this.fulfillOrder(userId, demoIntentId, 'stripe', shippingAddress, notes);
  },

  async createPayPalOrder(userId: string, clientItems?: ClientCartItem[]) {
    if (clientItems?.length) await this.syncClientCart(userId, clientItems);

    const cartSnapshot = await this.getCartSnapshot(userId);

    const accessToken = await getPayPalAccessToken();
    const baseUrl = env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (cartSnapshot.total / 100).toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: (cartSnapshot.subtotal / 100).toFixed(2) },
              shipping: { currency_code: 'USD', value: (cartSnapshot.shippingCost / 100).toFixed(2) },
            },
          },
          custom_id: userId,
        }],
      }),
    });

    const order = await response.json() as { id: string };
    return { orderId: order.id, subtotal: cartSnapshot.subtotal, shippingCost: cartSnapshot.shippingCost, total: cartSnapshot.total };
  },

  async capturePayPalOrder(paypalOrderId: string, userId: string, shippingAddress: ShippingAddressInput, notes?: string) {
    const accessToken = await getPayPalAccessToken();
    const baseUrl = env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captured = await response.json() as { status: string; id: string };
    if (captured.status !== 'COMPLETED') {
      throw new ValidationError('PayPal payment capture failed');
    }

    return this.fulfillOrder(userId, paypalOrderId, 'paypal', shippingAddress, notes);
  },

  async fulfillOrder(
    userId: string,
    paymentIntentId: string,
    paymentProvider: 'stripe' | 'paypal',
    shippingAddress: ShippingAddressInput,
    notes?: string,
  ) {
    const cart = await cartService.getOrCreateCart(userId);
    if (!cart.items.length) throw new ValidationError('Cart is empty');

    const userRecord = await db.query.users.findFirst({ where: eq(users.id, userId) });
    const userEmail = userRecord?.email ?? '';

    const subtotal = cart.items.reduce((sum, item) => {
      const basePrice = item.product.price;
      const variantAdj = item.variant?.priceAdjustment ?? 0;
      return sum + (basePrice + variantAdj) * item.quantity;
    }, 0);

    const shippingCost = calculateShipping(subtotal);
    const total = subtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({
        orderNumber,
        userId,
        email: userEmail,
        status: 'paid',
        paymentProvider,
        paymentIntentId,
        subtotal,
        shippingCost,
        taxAmount: 0,
        total,
        notes,
      }).returning();

      await tx.insert(shippingAddresses).values({ orderId: order.id, userId, ...shippingAddress });

      await tx.insert(orderItems).values(
        cart.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.product.name,
          variantName: item.variant ? `${item.variant.name}: ${item.variant.value}` : null,
          price: item.product.price + (item.variant?.priceAdjustment ?? 0),
          quantity: item.quantity,
          customNote: item.customNote,
        }))
      );

      for (const item of cart.items) {
        if (item.variantId) {
          await tx.update(productVariants)
            .set({ stockQty: sql`GREATEST(0, ${productVariants.stockQty} - ${item.quantity})` })
            .where(eq(productVariants.id, item.variantId));
        }
        await tx.update(products)
          .set({
            stockQty: sql`GREATEST(0, ${products.stockQty} - ${item.quantity})`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));
      }

      await cartService.clearCart(userId);

      return order;
    });
  },

  async fulfillOrderByPaymentIntent(paymentIntentId: string) {
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.paymentIntentId, paymentIntentId),
      with: { items: true },
    });
    if (!existingOrder) return null;

    if (existingOrder.status !== 'pending') {
      return existingOrder;
    }

    return await db.transaction(async (tx) => {
      await tx.update(orders)
        .set({ status: 'paid', updatedAt: new Date() })
        .where(eq(orders.id, existingOrder.id));

      for (const item of existingOrder.items) {
        if (item.variantId) {
          await tx.update(productVariants)
            .set({ stockQty: sql`GREATEST(0, ${productVariants.stockQty} - ${item.quantity})` })
            .where(eq(productVariants.id, item.variantId));
        }
        if (item.productId) {
          await tx.update(products)
            .set({
              stockQty: sql`GREATEST(0, ${products.stockQty} - ${item.quantity})`,
              updatedAt: new Date(),
            })
            .where(eq(products.id, item.productId));
        }
      }

      if (existingOrder.userId) {
        await cartService.clearCart(existingOrder.userId);
      }

      return { ...existingOrder, status: 'paid' as const };
    });
  },
};

async function getPayPalAccessToken(): Promise<string> {
  const baseUrl = env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const credentials = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json() as { access_token: string };
  return data.access_token;
}
