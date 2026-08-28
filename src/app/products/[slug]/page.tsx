import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCartButtons from "@/components/ui/AddToCartButtons";
import ProductGallery from "@/components/ui/ProductGallery";
import { parseCsvOptions } from "@/lib/variants";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://georgemckye.shop";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 } },
  });

  if (!product || !product.isPublished) {
    return { title: "Product Not Found" };
  }

  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.description || `${product.name} from George McKye.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/products/${product.slug}` },
    openGraph: {
      title,
      description,
      images: product.images[0] ? [{ url: `${SITE_URL}${product.images[0].url}` }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      category: true,
    }
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    sku: product.sku,
    image: product.images.map((img) => `${SITE_URL}${img.url}`),
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: (product.salePrice ?? product.price).toString(),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
    <div className="flex flex-col min-h-screen bg-brand-cream/10">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery — hover to zoom, click to open a full preview */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 text-sm font-bold text-brand-natural uppercase tracking-wider flex items-center gap-2">
              <span>{product.category?.name || 'Uncategorized'}</span>
              {product.color && (
                <>
                  <span>•</span>
                  <span className="capitalize">{product.color}</span>
                </>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-brand-deep mb-2">{product.name}</h1>
            <p className="text-sm text-brand-deep/50 mb-6">SKU: {product.sku}</p>
            
            <div className="flex items-center gap-4 mb-8">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-brand-primary">₹{product.salePrice.toString()}</span>
                  <span className="text-xl text-brand-muted line-through">₹{product.price.toString()}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-brand-deep">₹{product.price.toString()}</span>
              )}
            </div>

            <div className="prose prose-sm text-brand-deep/80 mb-8 max-w-none">
              <p>{product.description || "A premium natural essential designed for everyday comfort."}</p>
            </div>

            {/* Action Buttons */}
            <div className="mb-12">
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
                showQuantity
              />
              <p className="text-xs text-brand-deep/50 mt-3 text-center">
                Fast, simple checkout via WhatsApp. Pay after confirmation.
              </p>
            </div>

            {/* Features Accordion/List */}
            <div className="border-t border-brand-muted/30 pt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-brand-deep mb-1">Ultra Soft & Absorbent</h4>
                  <p className="text-sm text-brand-deep/70">Naturally highly absorbent and gets softer with every wash.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-brand-deep mb-1">Premium Craftsmanship</h4>
                  <p className="text-sm text-brand-deep/70">Thoughtfully made for lasting quality and everyday dependability.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
