import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  IndianRupee,
  Package,
  Users,
  Plus,
  Settings,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    revenueAgg,
    productCount,
    customerCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["CANCELLED"] } },
    }),
    prisma.product.count(),
    prisma.order.groupBy({ by: ["customerPhone"] }).then((rows) => rows.length),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    revenue: Number(revenueAgg._sum.total || 0),
    productCount,
    customerCount,
    recentOrders,
  };
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  PACKED: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-cyan-100 text-cyan-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock },
    { label: "Confirmed Orders", value: stats.confirmedOrders, icon: CheckCircle2 },
    { label: "Delivered Orders", value: stats.deliveredOrders, icon: Truck },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Products", value: stats.productCount, icon: Package },
    { label: "Customers", value: stats.customerCount, icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
              <card.icon size={18} className="text-brand-primary" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-brand-primary text-white py-2 px-4 rounded hover:bg-brand-deep transition-colors text-sm font-medium">
          <Plus size={16} /> Add Product
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-2 bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
          <ShoppingBag size={16} /> View Orders
        </Link>
        <Link href="/admin/products" className="flex items-center gap-2 bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
          <Package size={16} /> Manage Products
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-2 bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
          <Settings size={16} /> Settings
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-brand-primary hover:underline">View all</Link>
        </div>
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Order #</th>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Total</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stats.recentOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No orders yet. Requests from the website will appear here.
                </td>
              </tr>
            ) : (
              stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-brand-primary">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">₹{order.total.toString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.createdAt.toLocaleDateString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
