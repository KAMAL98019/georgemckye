import Link from "next/link";
import Image from "next/image";
import CartBadge from "./CartBadge";
import SearchBox from "./SearchBox";
import MobileMenu from "./MobileMenu";
import { LOGO_URL } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-brand-cream border-b border-brand-muted/30 shadow-sm transition-all duration-300">
      <div className="bg-brand-primary text-white text-xs py-1.5 text-center font-medium tracking-wide">
        Premium Natural Comfort • Thoughtfully Made
      </div>
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LOGO_URL}
              alt="George McKye Logo"
              width={76}
              height={76}
              className="rounded-full object-cover shadow-sm border border-brand-primary/10"
            />
            <span className="font-bold text-xl tracking-tight text-brand-deep hidden sm:block">
              GEORGE MCKYE
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide text-brand-deep">
          <Link href="/" className="hover:text-brand-natural transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-brand-natural transition-colors">Shop</Link>
          <Link href="/why-bamboo" className="hover:text-brand-natural transition-colors">Why Bamboo</Link>
          <Link href="/about" className="hover:text-brand-natural transition-colors">About</Link>
          <Link href="/contact" className="hover:text-brand-natural transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 text-brand-deep">
          <SearchBox />
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
