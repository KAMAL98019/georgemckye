import prisma from "@/lib/prisma";
import Link from "next/link";
import { Edit, ArrowUp, ArrowDown, Power } from "lucide-react";
import CategoryForm from "./CategoryForm";
import DeleteCategoryButton from "./DeleteCategoryButton";
import { toggleCategoryActive, reorderCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Categories</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-xl">
        <h2 className="font-bold text-gray-900 mb-4">Add New Category</h2>
        <CategoryForm />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Slug</th>
              <th className="px-6 py-3 font-semibold">Products</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No categories yet. Add one above.
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                  <td className="px-6 py-4">{category._count.products}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <form action={reorderCategory.bind(null, category.id, "up")}>
                        <button type="submit" disabled={index === 0} className="text-gray-400 hover:text-brand-primary disabled:opacity-30 transition-colors">
                          <ArrowUp size={16} />
                        </button>
                      </form>
                      <form action={reorderCategory.bind(null, category.id, "down")}>
                        <button type="submit" disabled={index === categories.length - 1} className="text-gray-400 hover:text-brand-primary disabled:opacity-30 transition-colors">
                          <ArrowDown size={16} />
                        </button>
                      </form>
                      <form action={toggleCategoryActive.bind(null, category.id, !category.isActive)}>
                        <button type="submit" title={category.isActive ? "Deactivate" : "Activate"} className="text-gray-400 hover:text-brand-primary transition-colors">
                          <Power size={16} />
                        </button>
                      </form>
                      <Link href={`/admin/categories/${category.id}/edit`} className="text-gray-400 hover:text-brand-primary transition-colors">
                        <Edit size={16} />
                      </Link>
                      <DeleteCategoryButton id={category.id} name={category.name} />
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
