import prisma from "@/lib/prisma";

const BNI_COUPON_REGEX = /^BNI-\d+$/i;

export async function validateCoupon(code: string) {
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

export function calculateDiscountedPrice(
  total: number,
  discountPercent: number
): { discount: number; finalPrice: number } {
  const discount = Number((total * (discountPercent / 100)).toFixed(2));
  const finalPrice = total - discount;
  return { discount, finalPrice };
}
