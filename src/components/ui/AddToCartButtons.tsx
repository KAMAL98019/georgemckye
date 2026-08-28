"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, MessageCircle } from "lucide-react";
import WhatsAppCheckoutModal from "@/components/cart/WhatsAppCheckoutModal";

export default function AddToCartButtons({
  product,
  sizeOptions = [],
  genderOptions = [],
}: {
  product: { id: string; name: string; price: number; sku: string; image?: string };
  sizeOptions?: string[];
  genderOptions?: string[];
}) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);

  const validateSelection = (): boolean => {
    if (sizeOptions.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    if (genderOptions.length > 0 && !selectedGender) {
      toast.error("Please select Men / Women");
      return false;
    }
    return true;
  };

  const buildCartItem = () => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
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

  const handleWhatsApp = () => {
    if (!validateSelection()) return;
    addToCart(buildCartItem());
    setIsModalOpen(true);
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

      <div className="flex gap-2 w-full">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-brand-deep text-white text-sm font-medium py-2.5 rounded hover:bg-brand-primary transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} />
          <span>ADD</span>
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 bg-green-500 text-white text-sm font-medium py-2.5 rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle size={16} />
          <span>REQUEST</span>
        </button>
      </div>

      <WhatsAppCheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
