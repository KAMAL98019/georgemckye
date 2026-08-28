"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const orderItemSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
});

const createOrderSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  phone: z.string().trim().min(6, "A valid phone number is required").max(20),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  addressLine1: z.string().trim().min(1, "Address is required").max(300),
  addressLine2: z.string().trim().max(300).optional(),
  city: z.string().trim().min(1, "City is required").max(120),
  state: z.string().trim().min(1, "State is required").max(120),
  pincode: z.string().trim().min(3, "Pincode is required").max(12),
  note: z.string().trim().max(2000).optional(),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const datePart = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(
    today.getDate()
  ).padStart(2, "0")}`;

  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const countToday = await prisma.order.count({
    where: { createdAt: { gte: startOfDay } },
  });

  const sequence = String(countToday + 1).padStart(4, "0");
  return `GMK-${datePart}-${sequence}`;
}

// Result is intentionally best-effort: this logs the request as a Pending order
// for the admin dashboard, but never blocks the customer from reaching WhatsApp.
export async function createWhatsAppOrder(
  input: CreateOrderInput
): Promise<{ success: true; orderNumber: string } | { success: false; error: string }> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid request data." };
  }
  const data = parsed.data;

  try {
    const productIds = data.items.map((item) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const items = data.items
      .map((item) => {
        const product = productMap.get(item.id);
        if (!product) return null;
        return {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          price: product.salePrice ?? product.price,
          quantity: item.quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (items.length === 0) {
      return { success: false, error: "None of the items in your cart could be found." };
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const orderNumber = await generateOrderNumber();

    const addressLines = [data.addressLine1, data.addressLine2, data.city, data.state, data.pincode]
      .filter(Boolean)
      .join(", ");

    await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email || null,
        customerNote: data.note || null,
        shippingAddress: addressLines,
        subtotal,
        shipping: 0,
        total: subtotal,
        status: "PENDING",
        paymentStatus: "PENDING",
        source: "WHATSAPP",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return { success: true, orderNumber };
  } catch (error) {
    console.error("Failed to log WhatsApp order request:", error);
    return { success: false, error: "Could not save this request, but you can still continue to WhatsApp." };
  }
}
