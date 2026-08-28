"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartBadge() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="p-2 hover:text-brand-natural transition-colors relative" aria-label="View cart">
      <ShoppingCart className="w-5 h-5" />
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </Link>
  );
}
