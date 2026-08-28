import Link from "next/link";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import prisma from "@/lib/prisma";
import { deleteProduct, toggleProductPublish } from "@/app/admin/actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  }).catch((error) => {
    console.error("Failed to fetch products for admin", error);
    return [];
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-brand-primary text-white py-2 px-4 rounded hover:bg-brand-deep transition-colors"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">SKU</th>
              <th className="px-6 py-3 font-semibold">Price</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No products found. Click &quot;Add Product&quot; to create one.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                    {product.isFeatured && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{product.category?.name || "—"}</td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">₹{product.price.toString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.isPublished ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <form action={toggleProductPublish.bind(null, product.id, !product.isPublished)}>
                        <button type="submit" title={product.isPublished ? "Unpublish" : "Publish"} className="text-gray-400 hover:text-brand-primary transition-colors">
                          {product.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </form>
                      <Link href={`/admin/products/${product.id}/edit`} className="text-gray-400 hover:text-brand-primary transition-colors">
                        <Edit size={18} />
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteProduct.bind(null, product.id)}
                        confirmMessage={`Delete "${product.name}"? This removes its images too and can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
