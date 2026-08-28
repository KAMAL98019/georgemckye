import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartPageContent from "@/components/cart/CartPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream/10">
      <Header />
      <CartPageContent />
      <Footer />
    </div>
  );
}
