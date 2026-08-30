"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { createWhatsAppOrder } from "@/lib/actions/orders";
import { validateCouponAction } from "@/actions/coupon";
import { calculateDiscountedPrice } from "@/lib/couponValidator";
import { X, Send, Ticket } from "lucide-react";

type WhatsAppCheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appliedCoupon?: { code: string; discountPercent: string } | null;
  discountAmount?: number;
  finalTotal?: number;
};

export default function WhatsAppCheckoutModal({ isOpen, onClose, appliedCoupon, discountAmount, finalTotal }: WhatsAppCheckoutModalProps) {
  const { items, cartTotal, clearCart } = useCart();
  const { whatsappNumber } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [modalCoupon, setModalCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isLoadingCoupon, setIsLoadingCoupon] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsLoadingCoupon(true);
    setCouponError("");

    const result = await validateCouponAction(couponCode);
    if (result.valid) {
      setModalCoupon(result.coupon);
      setCouponCode("");
    } else {
      setCouponError(result.error || "Invalid coupon");
      setModalCoupon(null);
    }

    setIsLoadingCoupon(false);
  };

  const removeCoupon = () => {
    setModalCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const effectiveCoupon = appliedCoupon || modalCoupon;
  const discountData = effectiveCoupon
    ? calculateDiscountedPrice(cartTotal, Number(effectiveCoupon.discountPercent))
    : null;
  const finalCartTotal = discountData ? discountData.finalPrice : cartTotal;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    setSubmitting(true);

    let orderNumber = "";
    try {
      const result = await createWhatsAppOrder({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        note: formData.note,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity, size: item.size, gender: item.gender })),
      });
      if (result.success) {
        orderNumber = result.orderNumber;
      }
    } catch (err) {
      console.error("Failed to log order before WhatsApp handoff:", err);
    }

    let message = `*Your WhatsApp Request*\n\nHello George McKye,\nI would like to request the following products.\n\n`;
    if (orderNumber) {
      message += `Reference: ${orderNumber}\n\n`;
    }
    message += `*PRODUCTS*\n-------------------------\n`;
    items.forEach((item) => {
      message += `${item.name}\nSKU: ${item.sku}\n`;
      if (item.size) message += `Size: ${item.size}\n`;
      if (item.gender) message += `Men/Women: ${item.gender}\n`;
      message += `Quantity: ${item.quantity}\nPrice: ₹${item.price * item.quantity}\n\n`;
    });

    if (effectiveCoupon) {
      message += `*Coupon: ${effectiveCoupon.code}*\n`;
      message += `Discount: ₹${discountData?.discount} (${effectiveCoupon.discountPercent.toString()}% off)\n`;
      message += `*Total after discount: ₹${finalCartTotal}*\n\n`;
    } else {
      message += `*Estimated Total: ₹${cartTotal}*\n\n`;
    }
    message += `*CUSTOMER DETAILS*\n-------------------------\n`;
    message += `Name: ${formData.name}\nPhone: ${formData.phone}\n`;
    if (formData.email) message += `Email: ${formData.email}\n`;
    message += `\n*DELIVERY ADDRESS*\n-------------------------\n`;
    message += `${formData.addressLine1}\n`;
    if (formData.addressLine2) message += `${formData.addressLine2}\n`;
    message += `${formData.city}\n${formData.state}\n${formData.pincode}\nIndia\n`;
    if (formData.note) {
      message += `\nNote:\n${formData.note}\n`;
    }
    message += `\nThank you.`;

    const url = buildWhatsAppUrl(whatsappNumber, message);

    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-brand-primary text-white flex items-center justify-between">
          <h2 className="text-xl font-bold">Complete Request via WhatsApp</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="whatsapp-checkout" onSubmit={handleCheckout} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input required name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input required name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input required name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Note</label>
                <textarea name="note" value={formData.note} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
            </div>
          </form>

          {!modalCoupon && !appliedCoupon && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Have a Coupon Code?</label>
              <div className="flex gap-2">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="BNI-15"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <Ticket size={14} className="absolute right-3 top-2.5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isLoadingCoupon || !couponCode.trim()}
                  className="px-3 py-2 bg-brand-primary text-white text-sm font-medium rounded hover:bg-brand-deep transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
            </div>
          )}

          <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Order Summary</h3>
            <div className="max-h-32 overflow-y-auto space-y-2 mb-4">
              {items.map(item => (
                <div key={`${item.id}-${item.size || ""}-${item.gender || ""}`} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.name}
                    {(item.size || item.gender) && (
                      <span className="text-gray-400"> ({[item.size, item.gender].filter(Boolean).join(", ")})</span>
                    )}
                  </span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            {effectiveCoupon && discountData && (
              <>
                <div className="flex justify-between text-sm pt-2 pb-2 border-t border-gray-200 text-green-700 font-semibold">
                  <span>Coupon: {effectiveCoupon.code}</span>
                  <span>-₹{discountData.discount}</span>
                </div>
              </>
            )}
            {effectiveCoupon && modalCoupon && (
              <button
                type="button"
                onClick={removeCoupon}
                className="text-xs text-gray-500 hover:text-red-600 mt-2 transition-colors"
              >
                Remove coupon
              </button>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
              <span>Estimated Total:</span>
              <span>₹{finalCartTotal}</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Your details will be included in the WhatsApp message you choose to send to the business. We do not send this information anywhere until you press Send in WhatsApp.
          </p>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-md transition-colors">
            Back
          </button>
          <button
            type="submit"
            form="whatsapp-checkout"
            disabled={submitting}
            className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-2 font-bold rounded-md hover:bg-[#1DA851] transition-colors disabled:opacity-60"
          >
            <Send size={18} />
            <span>{submitting ? "Preparing..." : "Continue to WhatsApp"}</span>
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 py-2 bg-gray-50">
          WhatsApp will open with this message ready to send. You must press Send in WhatsApp to notify us.
        </p>
      </div>
    </div>
  );
}
