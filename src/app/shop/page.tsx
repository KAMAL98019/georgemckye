import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Filter, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCartButtons from "@/components/ui/AddToCartButtons";
import { parseCsvOptions } from "@/lib/variants";
import type { Prisma } from "@prisma/client";
import type { Metadata } from "next";
import { withRetry } from "@/lib/withRetry";

// Force dynamic because we are querying DB based on searchParams
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse George McKye's collection of bamboo towels, t-shirts, and hankies — soft, absorbent, natural everyday essentials.",
};

// Shuffles so browsing "All Categories" mixes towels/t-shirts/hankies together
// instead of showing one long block per category. A plain Fisher-Yates shuffle
// distributes an unbalanced catalog (e.g. 13 towels vs 4 t-shirts) far more
// evenly across the whole list than a round-robin interleave would, which
// tends to dump the excess of the largest category as one long trailing run.
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const colorFilter = searchParams.color as string | undefined;
  const categoryFilter = searchParams.category as string | undefined;
  const searchQuery = searchParams.q as string | undefined;

  let products: Prisma.ProductGetPayload<{ include: { images: true; category: true } }>[] = [];

  try {
    const whereClause: Prisma.ProductWhereInput = {
      isPublished: true,
      category: { isActive: true },
    };
    if (colorFilter) {
      whereClause.color = colorFilter;
    }
    if (categoryFilter) {
      whereClause.category = { slug: categoryFilter };
    }
    if (searchQuery) {
      whereClause.name = { contains: searchQuery };
    }

    products = await withRetry(() =>
      prisma.product.findMany({
        where: whereClause,
        include: {
          images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 },
          category: true,
        },
        orderBy: { createdAt: 'desc' }
      })
    );

    // Only mix categories together when browsing everything — a specific
    // category filter should keep its natural (newest-first) order.
    if (!categoryFilter) {
      products = shuffle(products);
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  let availableColors: string[] = [];
  try {
    const productsWithColors = await withRetry(() =>
      prisma.product.findMany({
        where: { isPublished: true, color: { not: null }, category: { isActive: true } },
        select: { color: true },
        distinct: ["color"],
      })
    );
    availableColors = productsWithColors
      .map((p) => p.color)
      .filter((color): color is string => typeof color === "string" && color.trim().length > 0);
  } catch (err) {
    console.error("Failed to fetch colors:", err);
  }

  let categories: { name: string; slug: string }[] = [];
  try {
    categories = await withRetry(() =>
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { name: true, slug: true },
      })
    );
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  // Builds a filter link that updates one param while preserving the others,
  // so color and category filters can be combined instead of overwriting each other.
  function filterHref(updates: Record<string, string | undefined>): string {
    const params = new URLSearchParams();
    if (colorFilter) params.set("color", colorFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (searchQuery) params.set("q", searchQuery);

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) params.delete(key);
      else params.set(key, value);
    }

    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream/10">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-brand-deep mb-8 text-center">Shop Our Collection</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-brand-muted/20 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-brand-deep font-bold border-b border-brand-muted/20 pb-4">
                <Filter size={20} />
                <h3>Filters</h3>
              </div>
              
              {categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-sm uppercase text-brand-natural mb-4 tracking-wider">Category</h4>
                  <div className="space-y-3">
                    <Link href={filterHref({ category: undefined })} className={`block text-sm ${!categoryFilter ? 'font-bold text-brand-primary' : 'text-brand-deep hover:text-brand-primary'}`}>
                      All Categories
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={filterHref({ category: categoryFilter === cat.slug ? undefined : cat.slug })}
                        className={`block text-sm ${categoryFilter === cat.slug ? 'font-bold text-brand-primary' : 'text-brand-deep hover:text-brand-primary'}`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {availableColors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-sm uppercase text-brand-natural mb-4 tracking-wider">Color Variants</h4>
                  <Link href={filterHref({ color: undefined })} className={`block text-sm mb-3 ${!colorFilter ? 'font-bold text-brand-primary' : 'text-brand-deep hover:text-brand-primary'}`}>
                    All Colors
                  </Link>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {availableColors.map((c) => (
                      <Link
                        key={c}
                        href={filterHref({ color: colorFilter === c ? undefined : c })}
                        className={`block text-sm capitalize flex items-center gap-2 ${colorFilter === c ? 'font-bold text-brand-primary' : 'text-brand-deep hover:text-brand-primary'}`}
                      >
                        <span className="w-3 h-3 rounded-full border border-gray-300 inline-block shrink-0" style={{ backgroundColor: c === 'white' ? '#fff' : c === 'navy' ? '#000080' : c }}></span>
                        <span className="truncate">{c}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {(colorFilter || categoryFilter) && (
                <Link href="/shop" className="block text-sm font-bold text-brand-deep/60 hover:text-brand-primary pt-2 border-t border-brand-muted/20">
                  Clear All Filters
                </Link>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {products.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-brand-muted/20 flex flex-col items-center justify-center">
                <p className="text-lg text-brand-deep/70 mb-4">No products found for this variant.</p>
                <Link href="/shop" className="text-brand-primary font-bold hover:underline">Clear Filters</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-white rounded-lg overflow-hidden border border-brand-muted/20 hover:shadow-xl transition-all duration-300">
                    <Link href={`/products/${product.slug}`} className="relative w-full aspect-square overflow-hidden bg-brand-cream/20">
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
                    </Link>

                    <div className="p-6 flex flex-col">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="text-xs text-brand-natural font-semibold uppercase tracking-wider truncate">
                          {product.category?.name || 'Uncategorized'}
                        </div>
                        {product.color && (
                          <div className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                            {product.color}
                          </div>
                        )}
                      </div>

                      <Link href={`/products/${product.slug}`} className="hover:text-brand-primary transition-colors mb-3">
                        <h3 className="text-lg font-bold text-brand-deep line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-brand-primary">₹{product.salePrice.toString()}</span>
                            <span className="text-sm text-brand-muted line-through">₹{product.price.toString()}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-brand-deep">₹{product.price.toString()}</span>
                  )}
                      </div>

                      <div className="flex items-center gap-1.5 mb-5 text-xs font-semibold text-green-700">
                        <Truck size={14} />
                        <span>Free Shipping</span>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
