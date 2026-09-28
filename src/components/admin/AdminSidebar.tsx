"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  MessageSquare,
  Users,
  Star,
  Settings,
  Ticket,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { adminLogout } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 bg-brand-deep text-white shrink-0 sticky top-0 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 hover:bg-brand-primary/30 rounded-lg"
          title="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="text-sm font-bold tracking-tight text-brand-cream">
          GEORGE MCKYE ADMIN
        </span>
        <div className="w-8" />
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-brand-deep text-white flex flex-col z-50 shadow-xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-brand-primary/30">
          <span className="text-base font-bold text-brand-cream">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-brand-primary rounded"
            title="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                  active
                    ? "bg-brand-primary text-white"
                    : "text-brand-cream/70 hover:text-white hover:bg-brand-primary/60"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-brand-primary/30">
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 w-full rounded text-sm text-brand-cream/70 hover:text-white hover:bg-red-500/80 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
