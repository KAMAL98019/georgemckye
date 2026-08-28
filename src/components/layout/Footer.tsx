import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { STORE_ADDRESS, STORE_PHONE, LOGO_URL } from "@/lib/constants";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import type { Category } from "@prisma/client";
import { withRetry } from "@/lib/withRetry";

export default async function Footer() {
  let categories: Category[] = [];
  try {
    categories = await withRetry(() =>
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
    );
  } catch (error) {
    console.error("Failed to load footer categories", error);
  }

  const settings = await getSiteSettings();

  return (
    <footer className="bg-brand-cream text-brand-deep border-t border-brand-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src={LOGO_URL}
                alt="George McKye Logo"
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-brand-primary"
              />
              <span className="font-bold text-xl tracking-tight text-brand-deep">
                GEORGE MCKYE
              </span>
            </Link>
            <p className="text-brand-deep/80 text-sm leading-relaxed max-w-sm mb-5">
              Thoughtfully crafted natural essentials designed around softness, comfort and lasting quality. Made for your everyday life.
            </p>
            <ul className="space-y-2 text-sm text-brand-deep/80">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-primary shrink-0" />
                <span>{STORE_PHONE}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brand-primary shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-primary shrink-0 mt-0.5" />
                <span>{STORE_ADDRESS}</span>
              </li>
            </ul>
            {(settings.instagramUrl || settings.facebookUrl) && (
              <div className="flex gap-3 mt-4">
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline">
                    Instagram <ExternalLink size={12} />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline">
                    Facebook <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold mb-4 tracking-wide text-brand-primary">SHOP</h4>
            <ul className="space-y-3 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/shop?category=${category.slug}`} className="hover:text-brand-primary transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/shop" className="hover:text-brand-primary transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 tracking-wide text-brand-primary">COMPANY</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
              <li><Link href="/why-bamboo" className="hover:text-brand-primary transition-colors">Why Bamboo</Link></li>
              <li><Link href="/contact" className="hover:text-brand-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 tracking-wide text-brand-primary">SUPPORT</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-muted/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-deep/60">
          <p>© {new Date().getFullYear()} George McKye. All rights reserved.</p>
          <div className="flex gap-4">
            <span>{STORE_ADDRESS}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
