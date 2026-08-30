"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Minus, Plus } from "lucide-react";

const MAX_QUANTITY = 20;

export default function AddToCartButtons({
  product,
  sizeOptions = [],
  genderOptions = [],
  showQuantity = false,
}: {
  product: { id: string; name: string; price: number; sku: string; image?: string };
  sizeOptions?: string[];
  genderOptions?: string[];
  showQuantity?: boolean;
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  // Auto-select when there's only one option (e.g. "Free Size") — nothing to actually choose,
  // so it shouldn't block the customer with a required-selection prompt.
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizeOptions.length === 1 ? sizeOptions[0] : undefined
  );
  const [selectedGender, setSelectedGender] = useState<string | undefined>(
    genderOptions.length === 1 ? genderOptions[0] : undefined
  );

  const validateSelection = (): boolean => {
    if (sizeOptions.length > 1 && !selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    if (genderOptions.length > 1 && !selectedGender) {
      toast.error("Please select Men / Women");
      return false;
    }
    return true;
  };

  const buildCartItem = () => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity,
    sku: product.sku,
    image: product.image,
    size: selectedSize,
    gender: selectedGender,
  });

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addToCart(buildCartItem());
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      {sizeOptions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-brand-deep/70 uppercase tracking-wide mb-1.5">Size</p>
          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedSize(option)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  selectedSize === option
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-brand-deep border-brand-muted/40 hover:border-brand-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {genderOptions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-brand-deep/70 uppercase tracking-wide mb-1.5">Men / Women</p>
          <div className="flex flex-wrap gap-1.5">
            {genderOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedGender(option)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  selectedGender === option
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-brand-deep border-brand-muted/40 hover:border-brand-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {showQuantity && (
        <div className="mb-3">
          <p className="text-xs font-bold text-brand-deep/70 uppercase tracking-wide mb-1.5">Quantity</p>
          <div className="flex items-center border border-brand-muted/40 rounded-md overflow-hidden w-fit">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-brand-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-4 py-1.5 text-sm font-bold w-12 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              disabled={quantity >= MAX_QUANTITY}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-brand-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full bg-brand-deep text-white text-sm font-medium py-2.5 rounded hover:bg-brand-primary transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingBag size={16} />
        <span>ADD TO CART</span>
      </button>
    </>
  );
}
