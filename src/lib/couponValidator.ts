export function calculateDiscountedPrice(
  total: number,
  discountPercent: number
): { discount: number; finalPrice: number } {
  const discount = Number((total * (discountPercent / 100)).toFixed(2));
  const finalPrice = total - discount;
  return { discount, finalPrice };
}
