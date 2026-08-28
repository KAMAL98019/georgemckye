import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import prisma from "@/lib/prisma";
import ProductForm from "../../ProductForm";
import { updateProduct, deleteProductImage, setPrimaryProductImage } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const initialValues = {
    name: product.name,
    categoryId: product.categoryId,
    price: product.price.toString(),
    salePrice: product.salePrice ? product.salePrice.toString() : "",
    color: product.color || "",
    material: product.material || "",
    size: product.size || "",
    sizeOptions: product.sizeOptions || "",
    genderOptions: product.genderOptions || "",
    sku: product.sku,
    description: product.description || "",
    careInstructions: product.careInstructions || "",
    features: product.features || "",
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    isFeatured: product.isFeatured,
    isPublished: product.isPublished,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      {product.images.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Current Images</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {product.images.map((image) => (
              <div key={image.id} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                <Image src={image.url} alt={product.name} fill className="object-cover" />
                {image.isPrimary && (
                  <span className="absolute top-1 left-1 bg-brand-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    PRIMARY
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isPrimary && (
                    <form action={setPrimaryProductImage.bind(null, product.id, image.id)}>
                      <button type="submit" title="Set as primary" className="bg-white/90 text-gray-700 p-1.5 rounded-full hover:bg-white">
                        <Star size={14} />
                      </button>
                    </form>
                  )}
                  <form action={deleteProductImage.bind(null, product.id, image.id)}>
                    <button type="submit" title="Delete image" className="bg-white/90 text-red-600 p-1.5 rounded-full hover:bg-white">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProductForm
        categories={categories}
        initialValues={initialValues}
        onSubmit={updateProduct.bind(null, product.id)}
        submitLabel="Save Changes"
      />
    </div>
  );
}
