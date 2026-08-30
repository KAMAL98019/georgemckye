"use client";

import { useCart } from "@/context/CartContext";
import { useCartSidebar } from "@/context/CartSidebarContext";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";

export default function CartSidebar() {
  const { items, removeFromCart, cartTotal } = useCart();
  const { isOpen, closeCart } = useCartSidebar();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} className="text-brand-primary" />
            <h2 className="text-lg font-bold text-brand-deep">Your Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size || ""}-${item.gender || ""}`}
                  className="flex gap-3 pb-4 border-b border-gray-200"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-brand-deep">
                      {item.name}
                    </h3>
                    {(item.size || item.gender) && (
                      <p className="text-xs text-gray-600 mt-1">
                        {[item.size, item.gender].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium text-gray-600">
                        ₹{item.price} × {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          removeFromCart(item.id, { size: item.size, gender: item.gender })
                        }
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Total:</span>
              <span className="text-brand-primary">₹{cartTotal}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full text-center bg-brand-primary text-white py-3 rounded-md font-bold hover:bg-brand-deep transition-colors"
            >
              Review Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
