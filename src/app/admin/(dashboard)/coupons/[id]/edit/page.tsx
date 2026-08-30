import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import CouponForm from "../../CouponForm";
import { updateCoupon } from "@/app/admin/coupon/actions";

export const dynamic = "force-dynamic";

export default async function EditCouponPage({ params }: { params: { id: string } }) {
  const coupon = await prisma.coupon.findUnique({ where: { id: params.id } });
  if (!coupon) notFound();

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const result = await updateCoupon(params.id, formData);
    if (!result.error) {
      redirect("/admin/coupons");
    }
    return result;
  };

  const initialValues = {
    code: coupon.code,
    discountPercent: coupon.discountPercent.toString(),
    maxUses: coupon.maxUses?.toString() || "",
    expiryDate: coupon.expiryDate
      ? new Date(coupon.expiryDate).toISOString().slice(0, 16)
      : "",
    isActive: coupon.isActive,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/coupons" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Coupon</h1>
      </div>

      <CouponForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
