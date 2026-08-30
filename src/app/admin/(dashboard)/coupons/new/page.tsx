import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CouponForm from "../CouponForm";
import { createCoupon } from "@/app/admin/coupon/actions";
import { redirect } from "next/navigation";

export default function NewCouponPage() {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const result = await createCoupon(formData);
    if (!result.error) {
      redirect("/admin/coupons");
    }
    return result;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/coupons" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Coupon</h1>
      </div>

      <CouponForm onSubmit={handleSubmit} submitLabel="Create Coupon" />
    </div>
  );
}
