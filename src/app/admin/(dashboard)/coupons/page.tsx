import Link from "next/link";
import { Trash2, Plus, Edit } from "lucide-react";
import { getCoupons, deleteCoupon } from "@/app/admin/coupon/actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-deep transition-colors"
        >
          <Plus size={18} />
          Add Coupon
        </Link>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">No coupons yet.</p>
          <Link
            href="/admin/coupons/new"
            className="text-brand-primary font-bold hover:underline"
          >
            Create one
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Max Uses</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Used</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Expires</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-brand-primary">{coupon.code}</td>
                    <td className="px-6 py-4 font-semibold">{coupon.discountPercent}%</td>
                    <td className="px-6 py-4">{coupon.maxUses || "Unlimited"}</td>
                    <td className="px-6 py-4">{coupon.usedCount}</td>
                    <td className="px-6 py-4 text-sm">
                      {coupon.expiryDate
                        ? new Date(coupon.expiryDate).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                          coupon.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/coupons/${coupon.id}/edit`}
                          className="text-gray-500 hover:text-brand-primary"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <ConfirmDeleteButton
                          action={deleteCoupon.bind(null, coupon.id)}
                          itemName={coupon.code}
                        >
                          <Trash2 size={16} />
                        </ConfirmDeleteButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
