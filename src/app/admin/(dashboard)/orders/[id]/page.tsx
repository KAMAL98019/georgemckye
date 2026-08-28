import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateOrderStatus, updatePaymentStatus } from "../actions";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "COD"];

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) notFound();

  const updateStatusWithId = updateOrderStatus.bind(null, order.id);
  const updatePaymentWithId = updatePaymentStatus.bind(null, order.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {order.createdAt.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Items</h2>
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-200 text-gray-700">
                <tr>
                  <th className="py-2 font-semibold">Product</th>
                  <th className="py-2 font-semibold">SKU</th>
                  <th className="py-2 font-semibold">Qty</th>
                  <th className="py-2 font-semibold text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-gray-900">{item.productName}</td>
                    <td className="py-3">{item.sku}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3 text-right">₹{item.price.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-1 text-sm text-right">
              <p className="text-gray-600">Subtotal: ₹{order.subtotal.toString()}</p>
              <p className="text-gray-600">Shipping: ₹{order.shipping.toString()}</p>
              <p className="text-gray-900 font-bold text-base">Estimated Total: ₹{order.total.toString()}</p>
            </div>
          </div>

          {order.customerNote && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-2">Customer Note</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.customerNote}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.customerName}</p>
              <p>{order.customerPhone}</p>
              {order.customerEmail && <p>{order.customerEmail}</p>}
            </div>
            <h3 className="font-bold text-gray-900 mt-4 mb-2 text-sm">Shipping Address</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.shippingAddress}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Order Status</h2>
            <form action={updateStatusWithId} className="flex flex-col gap-3">
              <select name="status" defaultValue={order.status} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button type="submit" className="bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-deep transition-colors text-sm font-medium">
                Update Status
              </button>
            </form>

            <h2 className="font-bold text-gray-900 mt-6 mb-4">Payment Status</h2>
            <form action={updatePaymentWithId} className="flex flex-col gap-3">
              <select name="paymentStatus" defaultValue={order.paymentStatus} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button type="submit" className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors text-sm font-medium">
                Update Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
