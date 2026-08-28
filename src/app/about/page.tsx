import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeIn from "@/components/ui/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "The George McKye story — premium, natural everyday essentials crafted with care and quality.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream/20">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-brand-deep text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-transparent"></div>
          <div className="container mx-auto relative z-10 max-w-4xl text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Story</h1>
              <p className="text-lg md:text-xl text-brand-cream/90 max-w-2xl mx-auto">
                Dedicated to bringing you the finest everyday essentials crafted with care, quality, and a commitment to natural comfort.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 px-4 container mx-auto">
          <div className="max-w-3xl mx-auto space-y-12">
            
            <FadeIn direction="up" delay={0.1}>
              <h2 className="text-3xl font-bold text-brand-deep mb-4">The George McKye Vision</h2>
              <div className="prose prose-lg text-brand-deep/80 max-w-none">
                <p>
                  At George McKye, we believe that the items you use every single day should be nothing short of exceptional. We founded this brand with a simple vision: to elevate everyday routines through superior, thoughtfully crafted essentials.
                </p>
                <p className="mt-4">
                  We noticed a gap in the market for truly premium, long-lasting products that prioritize both unparalleled comfort and natural materials. That realization sparked our journey into the world of bamboo fabrics.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.2} className="border-t border-brand-muted/30 pt-12">
              <h2 className="text-3xl font-bold text-brand-deep mb-4">Uncompromising Quality</h2>
              <div className="prose prose-lg text-brand-deep/80 max-w-none">
                <p>
                  Quality isn&apos;t just a buzzword for us; it&apos;s the foundation of everything we create. We spend months sourcing the right materials, testing prototypes, and refining our manufacturing processes.
                </p>
                <p className="mt-4">
                  When you hold a George McKye product, you feel the difference immediately. It&apos;s in the weight of the fabric, the precision of the stitching, and the incredible softness that only gets better with time.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.3} className="border-t border-brand-muted/30 pt-12">
              <h2 className="text-3xl font-bold text-brand-deep mb-4">Commitment to You</h2>
              <div className="prose prose-lg text-brand-deep/80 max-w-none">
                <p>
                  Our customers are at the heart of our brand. We are proudly a BNI registered company, maintaining the highest standards of trust and business ethics. 
                </p>
                <p className="mt-4">
                  We stand behind every single product we sell. If it doesn&apos;t meet our rigorous standards for everyday comfort and durability, it doesn&apos;t carry the George McKye name.
                </p>
              </div>
            </FadeIn>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
