"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { adminLogout } from "@/lib/actions/auth";

export default function AdminSidebar({
  navItems,
}: {
  navItems: Array<{ href: string; label: string; icon: any }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-gray-200 rounded-lg"
        title="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <aside className="md:hidden fixed left-0 top-0 h-screen w-64 bg-brand-deep text-white flex flex-col z-40 shadow-xl">
            <div className="p-6 flex items-center justify-between">
              <span className="text-lg font-bold text-brand-cream">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-brand-primary rounded"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded text-brand-cream/70 hover:text-white hover:bg-brand-primary transition-colors text-left"
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-brand-primary/50">
              <form action={adminLogout}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-3 py-2 w-full rounded text-brand-cream/70 hover:text-white hover:bg-red-500/80 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
