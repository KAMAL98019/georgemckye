import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getCustomers() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      customerName: true,
      customerPhone: true,
      customerEmail: true,
      total: true,
      createdAt: true,
    },
  });

  const map = new Map<
    string,
    { name: string; phone: string; email: string | null; orderCount: number; totalSpent: number; lastOrder: Date }
  >();

  for (const order of orders) {
    const existing = map.get(order.customerPhone);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += Number(order.total);
      if (order.createdAt > existing.lastOrder) existing.lastOrder = order.createdAt;
    } else {
      map.set(order.customerPhone, {
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        orderCount: 1,
        totalSpent: Number(order.total),
        lastOrder: order.createdAt,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.lastOrder.getTime() - a.lastOrder.getTime());
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Customers</h1>
      <p className="text-sm text-gray-500 mb-6">
        Derived from WhatsApp order requests. George McKye does not require customer accounts to place a request.
      </p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Phone</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Orders</th>
              <th className="px-6 py-3 font-semibold">Total Spent</th>
              <th className="px-6 py-3 font-semibold">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.phone} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.email || "—"}</td>
                  <td className="px-6 py-4">{customer.orderCount}</td>
                  <td className="px-6 py-4">₹{customer.totalSpent.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">{customer.lastOrder.toLocaleDateString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
