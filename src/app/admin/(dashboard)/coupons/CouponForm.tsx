"use client";

import { useState } from "react";
import { Save } from "lucide-react";

type CouponFormValues = {
  code: string;
  discountPercent: string;
  maxUses: string;
  expiryDate: string;
  isActive: boolean;
};

const EMPTY_VALUES: CouponFormValues = {
  code: "",
  discountPercent: "15",
  maxUses: "",
  expiryDate: "",
  isActive: true,
};

export default function CouponForm({
  initialValues,
  onSubmit,
  submitLabel = "Create Coupon",
}: {
  initialValues?: Partial<CouponFormValues>;
  onSubmit: (formData: FormData) => Promise<{ error?: string }>;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<CouponFormValues>({ ...EMPTY_VALUES, ...initialValues });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      setValues((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) formData.append(key, "on");
      } else {
        formData.append(key, value);
      }
    });

    try {
      const result = await onSubmit(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setMessage("Saved successfully.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
          <input
            name="code"
            value={values.code}
            onChange={handleChange}
            placeholder="e.g., BNI-12345"
            required
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          />
          <p className="text-xs text-gray-500 mt-1">Format: BNI-xxxxx (digits only)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percent *</label>
            <div className="flex items-center">
              <input
                name="discountPercent"
                type="number"
                value={values.discountPercent}
                onChange={handleChange}
                min="0.01"
                max="100"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
              />
              <span className="ml-2 text-gray-600">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (Optional)</label>
            <input
              name="maxUses"
              type="number"
              value={values.maxUses}
              onChange={handleChange}
              min="1"
              placeholder="Leave empty for unlimited"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
          <input
            name="expiryDate"
            type="datetime-local"
            value={values.expiryDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={values.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
          />
          <label className="text-sm text-gray-900">Active (Customers can use this coupon)</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-deep transition-colors disabled:opacity-60 font-medium flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
