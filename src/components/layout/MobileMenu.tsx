"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/why-bamboo", label: "Why Bamboo" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="md:hidden p-2 text-brand-deep" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-brand-cream shadow-2xl flex flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg text-brand-deep">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1 text-brand-deep">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 px-2 text-base font-bold text-brand-deep hover:text-brand-primary border-b border-brand-muted/20 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
