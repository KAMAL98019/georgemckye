import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowRight } from "lucide-react";
import { withRetry } from "@/lib/withRetry";

const CATEGORY_COPY: Record<string, string> = {
  towels: "Soft, absorbent essentials designed for everyday comfort.",
  "t-shirts": "Natural comfort for everyday wear.",
  hankies: "Simple, soft and practical everyday essentials.",
};

async function getCategoriesWithImage() {
  try {
    const categories = await withRetry(() =>
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          products: {
            where: { isPublished: true },
            include: { images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 } },
            take: 1,
          },
        },
      })
    );
    return categories;
  } catch (error) {
    console.error("Failed to load categories for homepage:", error);
    return [];
  }
}

export default async function ProductCategories() {
  const categories = await getCategoriesWithImage();

  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-brand-cream/20">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-deep mb-4">Shop by Category</h2>
          <p className="text-lg text-brand-deep/70">
            Every essential, thoughtfully organized so you can find exactly what you need.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const image = category.products[0]?.images[0]?.url;
            return (
              <FadeIn key={category.id} delay={index * 0.1}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group relative flex flex-col justify-end aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-brand-muted/20 bg-brand-deep"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative z-10 p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm text-white/80 mb-4 max-w-xs">
                      {CATEGORY_COPY[category.slug] || category.description || ""}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider border-b-2 border-brand-cream pb-1 group-hover:gap-3 transition-all">
                      Shop Now <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
