"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, MessageCircle } from "lucide-react";
import WhatsAppCheckoutModal from "@/components/cart/WhatsAppCheckoutModal";

export default function AddToCartButtons({ 
  product 
}: { 
  product: { id: string; name: string; price: number; sku: string; image?: string; } 
}) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      sku: product.sku,
      image: product.image
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleWhatsApp = () => {
    // We add to cart and then immediately open the checkout modal
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      sku: product.sku,
      image: product.image
    });
    setIsModalOpen(true);
  };

  return (
    <>
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
