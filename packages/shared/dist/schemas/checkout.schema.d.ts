import { z } from 'zod';
export declare const shippingAddressSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    address1: z.ZodString;
    address2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    address2?: string | undefined;
    phone?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    address2?: string | undefined;
    country?: string | undefined;
    phone?: string | undefined;
}>;
export declare const createCheckoutSchema: z.ZodObject<{
    shippingAddress: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        address1: z.ZodString;
        address2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        postalCode: z.ZodString;
        country: z.ZodDefault<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        firstName: string;
        lastName: string;
        address1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        address2?: string | undefined;
        phone?: string | undefined;
    }, {
        firstName: string;
        lastName: string;
        address1: string;
        city: string;
        state: string;
        postalCode: string;
        address2?: string | undefined;
        country?: string | undefined;
        phone?: string | undefined;
    }>;
    notes: z.ZodOptional<z.ZodString>;
    paymentProvider: z.ZodEnum<["stripe", "paypal"]>;
}, "strip", z.ZodTypeAny, {
    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        address2?: string | undefined;
        phone?: string | undefined;
    };
    paymentProvider: "stripe" | "paypal";
    notes?: string | undefined;
}, {
    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        city: string;
        state: string;
        postalCode: string;
        address2?: string | undefined;
        country?: string | undefined;
        phone?: string | undefined;
    };
    paymentProvider: "stripe" | "paypal";
    notes?: string | undefined;
}>;
export declare const addToCartSchema: z.ZodObject<{
    productId: z.ZodString;
    variantId: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    customNote: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantity: number;
    variantId?: string | undefined;
    customNote?: string | undefined;
}, {
    productId: string;
    quantity: number;
    variantId?: string | undefined;
    customNote?: string | undefined;
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
}, {
    quantity: number;
}>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
