import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  MessageSquare,
  Users,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { cookies } from "next/headers";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { adminLogout } from "@/lib/actions/auth";
import { LOGO_URL } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSession(token) : null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar — pinned full-height, only its nav list scrolls internally */}
      <aside className="w-64 bg-brand-deep text-white flex flex-col shrink-0">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image
              src={LOGO_URL}
              alt="George McKye Logo"
              width={40}
              height={40}
              className="rounded-full object-cover border border-brand-cream/20 shrink-0"
            />
            <span className="text-lg font-bold tracking-tight text-brand-cream leading-tight">
              GEORGE MCKYE
              <span className="block text-xs font-normal text-brand-natural">Admin Panel</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded text-brand-cream/70 hover:text-white hover:bg-brand-primary transition-colors"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-primary/50 shrink-0">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">{session?.name || session?.email || "Admin"}</span>
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
              {(session?.name || session?.email || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
