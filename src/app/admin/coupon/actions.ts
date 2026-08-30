"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().toUpperCase().regex(/^BNI\d+$/, "Code must be in format BNIxxxxx"),
  discountPercent: z.coerce.number().min(0.01).max(100, "Discount must be between 0.01 and 100"),
  maxUses: z.coerce.number().int().min(1).optional(),
  expiryDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function createCoupon(formData: FormData): Promise<{ error?: string }> {
  const parsed = couponSchema.safeParse({
    code: formData.get("code"),
    discountPercent: formData.get("discountPercent"),
    maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : undefined,
    expiryDate: formData.get("expiryDate"),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid coupon data." };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) {
      return { error: `Coupon ${data.code} already exists.` };
    }

    await prisma.coupon.create({
      data: {
        code: data.code,
        discountPercent: data.discountPercent,
        maxUses: data.maxUses || null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        isActive: data.isActive,
      },
    });

    revalidatePath("/admin/coupons");
    return {};
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return { error: "Database error occurred." };
  }
}

export async function updateCoupon(id: string, formData: FormData): Promise<{ error?: string }> {
  const parsed = couponSchema.safeParse({
    code: formData.get("code"),
    discountPercent: formData.get("discountPercent"),
    maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : undefined,
    expiryDate: formData.get("expiryDate"),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid coupon data." };
  }

  const data = parsed.data;

  try {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Coupon not found." };
    }

    if (data.code !== existing.code) {
      const duplicate = await prisma.coupon.findUnique({ where: { code: data.code } });
      if (duplicate) {
        return { error: `Coupon code ${data.code} already exists.` };
      }
    }

    await prisma.coupon.update({
      where: { id },
      data: {
        code: data.code,
        discountPercent: data.discountPercent,
        maxUses: data.maxUses || null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        isActive: data.isActive,
      },
    });

    revalidatePath("/admin/coupons");
    return {};
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return { error: "Database error occurred." };
  }
}

export async function deleteCoupon(id: string): Promise<{ error?: string }> {
  try {
    await prisma.coupon.delete({ where: { id } }).catch(() => null);
    revalidatePath("/admin/coupons");
    return {};
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return { error: "Failed to delete coupon." };
  }
}

export async function getCoupons() {
  try {
    return await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return [];
  }
}
