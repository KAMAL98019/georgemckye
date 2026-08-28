"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "COD"] as const;

export async function updateOrderStatus(id: string, formData: FormData) {
  const status = formData.get("status") as string;
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) return;

  await prisma.order.update({
    where: { id },
    data: { status: status as (typeof ORDER_STATUSES)[number] },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/dashboard");
}

export async function updatePaymentStatus(id: string, formData: FormData) {
  const paymentStatus = formData.get("paymentStatus") as string;
  if (!PAYMENT_STATUSES.includes(paymentStatus as (typeof PAYMENT_STATUSES)[number])) return;

  await prisma.order.update({
    where: { id },
    data: { paymentStatus: paymentStatus as (typeof PAYMENT_STATUSES)[number] },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
