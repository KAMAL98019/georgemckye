"use server";

import prisma from "@/lib/prisma";

const BNI_COUPON_REGEX = /^BNI-\d+$/i;

export async function validateCouponAction(code: string) {
  const cleanCode = code.trim().toUpperCase();

  // Format validation
  if (!BNI_COUPON_REGEX.test(cleanCode)) {
    return { valid: false, error: "Coupon format must be BNI-xxxxx (e.g., BNI-15 or BNI-12345)" };
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      return { valid: false, error: "Coupon not found." };
    }

    if (!coupon.isActive) {
      return { valid: false, error: "Coupon is inactive." };
    }

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return { valid: false, error: "Coupon has expired." };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { valid: false, error: "Coupon usage limit reached." };
    }

    return { valid: true, coupon };
  } catch (error) {
    console.error("Coupon validation error:", error);
    return { valid: false, error: "Error validating coupon." };
  }
}
