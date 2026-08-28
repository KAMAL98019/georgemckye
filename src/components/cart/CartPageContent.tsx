"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import WhatsAppCheckoutModal from "@/components/cart/WhatsAppCheckoutModal";
import Link from "next/link";
import { Trash2, Plus, Minus, MessageCircle } from "lucide-react";

export default function CartPageContent() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-brand-deep mb-8 text-center md:text-left">Your Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-brand-muted/20">
            <p className="text-lg text-brand-deep/70 mb-6">Your cart is currently empty.</p>
            <Link href="/shop" className="inline-flex items-center justify-center bg-brand-primary px-8 py-3 text-sm font-medium text-white rounded hover:bg-brand-deep transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow bg-white rounded-xl border border-brand-muted/20 p-6 shadow-sm">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-brand-muted/20 text-sm font-bold text-brand-natural uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1 text-right"></div>
              </div>

              <div className="divide-y divide-brand-muted/20">
                {items.map((item) => {
                  const variant = { size: item.size, gender: item.gender };
                  const lineKey = `${item.id}-${item.size || ""}-${item.gender || ""}`;
                  return (
                  <div key={lineKey} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      {/* Image placeholder since we might not have it in cart context */}
                      <div className="w-20 h-24 bg-brand-cream/30 rounded flex-shrink-0 flex items-center justify-center text-xs text-brand-muted">
                        Img
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-deep mb-1">{item.name}</h3>
                        <p className="text-sm text-brand-deep/60 mb-2">SKU: {item.sku}</p>
                        {(item.size || item.gender) && (
                          <p className="text-sm text-brand-deep/60 mb-2">
                            {[item.size, item.gender].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <p className="font-medium text-brand-primary">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-center">
                      <div className="flex items-center border border-brand-muted/30 rounded-md overflow-hidden w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, variant)}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-2 text-sm font-bold w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, variant)}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-right">
                      <span className="md:hidden font-bold text-brand-deep text-sm mr-2">Total:</span>
                      <span className="font-bold text-lg text-brand-deep">₹{item.price * item.quantity}</span>
                    </div>

                    <div className="col-span-1 md:col-span-1 text-right">
                      <button
                        onClick={() => removeFromCart(item.id, variant)}
                        className="text-red-400 hover:text-red-600 p-2 transition-colors inline-flex"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-white p-6 rounded-xl border border-brand-muted/20 sticky top-24 shadow-sm">
                <h3 className="text-xl font-bold text-brand-deep mb-6 pb-4 border-b border-brand-muted/20">Order Summary</h3>

                <div className="flex justify-between mb-4 text-brand-deep/80">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between mb-6 text-brand-deep/80 pb-6 border-b border-brand-muted/20">
                  <span>Shipping</span>
                  <span className="text-sm italic">Calculated next</span>
                </div>

                <div className="flex justify-between mb-8 text-xl font-bold text-brand-deep">
                  <span>Estimated Total</span>
                  <span>₹{cartTotal}</span>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 px-4 rounded-md font-bold hover:bg-[#1DA851] transition-colors shadow-sm"
                >
                  <MessageCircle size={20} />
                  <span>REQUEST ON WHATSAPP</span>
                </button>

                <p className="text-xs text-center text-brand-deep/50 mt-4 px-2">
                  Shipping and final pricing will be confirmed over WhatsApp before payment.
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>

      <WhatsAppCheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
