"use client";

import { useState } from "react";
import { Upload, Save, X } from "lucide-react";

type Category = { id: string; name: string };

export type ProductFormValues = {
  name: string;
  categoryId: string;
  price: string;
  salePrice: string;
  color: string;
  material: string;
  size: string;
  sku: string;
  description: string;
  careInstructions: string;
  features: string;
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
  isPublished: boolean;
};

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  categoryId: "",
  price: "",
  salePrice: "",
  color: "",
  material: "",
  size: "",
  sku: "",
  description: "",
  careInstructions: "",
  features: "",
  seoTitle: "",
  seoDescription: "",
  isFeatured: false,
  isPublished: true,
};

export default function ProductForm({
  categories,
  initialValues,
  onSubmit,
  submitLabel = "Save Product",
}: {
  categories: Category[];
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<ProductFormValues>({ ...EMPTY_VALUES, ...initialValues });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    if (type === "checkbox") {
      setValues((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setValues((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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
    // Stock isn't tracked in the admin UI — availability is managed manually over WhatsApp.
    formData.append("stock", "999");
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const result = await onSubmit(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setMessage("Saved successfully.");
        setImageFiles([]);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 space-y-6">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input name="name" value={values.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g. Bamboo Bath Towel" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="categoryId" value={values.categoryId} onChange={handleChange} required className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input name="sku" value={values.sku} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="Auto-generated if left blank" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input type="number" name="price" value={values.price} onChange={handleChange} step="0.01" required min="0" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="1200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
            <input type="number" name="salePrice" value={values.salePrice} onChange={handleChange} step="0.01" min="0" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="Optional" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color Variant</label>
            <input name="color" value={values.color} onChange={handleChange} placeholder="e.g. navy" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <input name="material" value={values.material} onChange={handleChange} placeholder="e.g. 100% Bamboo Fabric" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <input name="size" value={values.size} onChange={handleChange} placeholder="e.g. 70cm x 140cm" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>

          <div className="flex items-center gap-6 mt-6">
            <label className="flex items-center gap-2 text-sm text-gray-900">
              <input type="checkbox" name="isFeatured" checked={values.isFeatured} onChange={handleChange} className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
              Featured (Show on Homepage)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-900">
              <input type="checkbox" name="isPublished" checked={values.isPublished} onChange={handleChange} className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
              Published (Visible on site)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={values.description} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="Product description..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
            <textarea name="careInstructions" value={values.careInstructions} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g. Machine wash cold, tumble dry low" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <textarea name="features" value={values.features} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="One feature per line" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seoTitle" value={values.seoTitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <input name="seoDescription" value={values.seoDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Images (Max 1MB each)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-deep focus-within:outline-none">
                  <span>Upload files</span>
                  <input id="file-upload" type="file" multiple accept="image/jpeg, image/png, image/webp, image/avif" className="sr-only" onChange={handleFiles} />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP, AVIF up to 1MB each — select multiple</p>
            </div>
          </div>

          {imageFiles.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-primary text-white py-2 px-4 rounded-md shadow hover:bg-brand-deep transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          <span>{loading ? "Saving..." : submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
