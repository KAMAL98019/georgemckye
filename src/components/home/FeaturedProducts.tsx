import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import AddToCartButtons from "@/components/ui/AddToCartButtons";
import FadeIn from "@/components/ui/FadeIn";
import { parseCsvOptions } from "@/lib/variants";
import { withRetry } from "@/lib/withRetry";

async function getFeaturedProducts() {
  try {
    const products = await withRetry(() =>
      prisma.product.findMany({
        where: {
          isFeatured: true,
          isPublished: true,
          category: { isActive: true },
        },
        include: {
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            take: 1,
          },
          category: true,
        },
        take: 4,
      })
    );
    return products;
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-deep mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-brand-deep/70 max-w-2xl">
              Discover our handpicked natural essentials, designed for everyday comfort and lasting quality.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex mt-6 md:mt-0 items-center justify-center border-b-2 border-brand-primary pb-1 text-sm font-bold text-brand-primary hover:text-brand-deep hover:border-brand-deep transition-colors"
          >
            VIEW ALL PRODUCTS
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.08} className="group flex flex-col bg-white rounded-lg overflow-hidden border border-brand-muted/20 hover:shadow-xl transition-all duration-300">
              <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-brand-cream/20">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted">
                    No Image
                  </div>
                )}
                
                {product.color && (
                    <div className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded">
                      {product.color}
                    </div>
                )}
                {product.salePrice && (
                  <div className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded">
                    SALE
                  </div>
                )}
              </Link>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-brand-natural font-semibold mb-2 uppercase tracking-wider">
                  {product.category?.name || 'Uncategorized'}
                </div>
                <Link href={`/products/${product.slug}`} className="hover:text-brand-primary transition-colors">
                  <h3 className="text-lg font-bold text-brand-deep mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 mb-4 mt-auto">
                  {product.salePrice ? (
                    <>
                      <span className="text-lg font-bold text-brand-primary">₹{product.salePrice.toString()}</span>
                      <span className="text-sm text-brand-muted line-through">₹{product.price.toString()}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-brand-deep">₹{product.price.toString()}</span>
                  )}
                </div>

                <AddToCartButtons
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    sku: product.sku,
                    image: product.images.length > 0 ? product.images[0].url : undefined
                  }}
                  sizeOptions={parseCsvOptions(product.sizeOptions)}
                  genderOptions={parseCsvOptions(product.genderOptions)} 
                />
              </div>
            </FadeIn>
          ))}
        </div>

        <Link
          href="/shop"
          className="md:hidden mt-8 w-full inline-flex items-center justify-center border-2 border-brand-primary py-3 text-sm font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors rounded"
        >
          VIEW ALL PRODUCTS
        </Link>
      </div>
    </section>
  );
}
