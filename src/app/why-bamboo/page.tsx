import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeIn from "@/components/ui/FadeIn";
import { Leaf, Droplets, ShieldCheck, Wind } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Bamboo",
  description: "Discover why bamboo fabric makes soft, absorbent, sustainable everyday essentials.",
};

export default function WhyBambooPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream/20">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-brand-deep text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-transparent"></div>
          <div className="container mx-auto relative z-10 max-w-4xl text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Why Bamboo?</h1>
              <p className="text-lg md:text-xl text-brand-cream/90 max-w-2xl mx-auto">
                Discover the natural benefits of bamboo fabric and why it makes the perfect material for everyday essentials.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 px-4 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <FadeIn direction="up" delay={0.1} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-muted/20">
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-primary">
                <Leaf size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-deep mb-4">Naturally Hypoallergenic</h3>
              <p className="text-brand-deep/80 leading-relaxed">
                Bamboo fabric is naturally smooth and round without chemical treatment, meaning no sharp spurs to irritate the skin. It is perfect for those with sensitive skin or allergies.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.2} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-muted/20">
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-primary">
                <Droplets size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-deep mb-4">Incredible Absorbency</h3>
              <p className="text-brand-deep/80 leading-relaxed">
                Bamboo is highly water absorbent, able to take up to three times its weight in water. This makes our towels exceptionally good at drying you quickly and comfortably.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-muted/20">
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-primary">
                <Wind size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-deep mb-4">Breathable & Thermo-regulating</h3>
              <p className="text-brand-deep/80 leading-relaxed">
                The cross-section of the bamboo fiber is filled with various micro-gaps and micro-holes, making it highly breathable and keeping you comfortable in any climate.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.4} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-muted/20">
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-primary">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-deep mb-4">Eco-Friendly Sustainability</h3>
              <p className="text-brand-deep/80 leading-relaxed">
                Bamboo is one of the fastest-growing plants in the world. It requires no pesticides or fertilizers and needs very little water to thrive, making it an incredibly sustainable choice.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Conclusion / CTA */}
        <section className="bg-brand-cream py-24 px-4 text-center">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-brand-deep mb-6">Experience the Difference</h2>
            <p className="text-brand-deep/80 max-w-2xl mx-auto mb-8">
              Once you feel the incredible softness and quality of premium bamboo fabric, you won&apos;t want to go back to ordinary cotton.
            </p>
            <a href="/shop" className="inline-flex items-center justify-center bg-brand-primary text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-brand-primary/90 transition-colors">
              Shop The Collection
            </a>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
