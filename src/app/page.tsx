import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BNITrust from "@/components/home/BNITrust";
import ScrollingMarquee from "@/components/home/ScrollingMarquee";
import WhyBamboo from "@/components/home/WhyBamboo";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ProductCategories from "@/components/home/ProductCategories";
import Testimonials from "@/components/home/Testimonials";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import StoreMap from "@/components/ui/StoreMap";
import FadeIn from "@/components/ui/FadeIn";
import { STORE_ADDRESS, STORE_MAP_URL } from "@/lib/constants";

export default async function Home() {
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    "Hello George McKye, I have an inquiry."
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Hero />
        <BNITrust />
        <ScrollingMarquee />
        <WhyBamboo />

        {/* We use a React Suspense boundary or just render it since it's an async component */}
        <FeaturedProducts />
        <ProductCategories />
        <Testimonials />

        {/* WhatsApp Request CTA Section */}
        <section className="py-24 bg-brand-primary text-white text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Need Help Finding Your Essentials?</h2>
            <p className="text-lg md:text-xl text-brand-cream/90 mb-10">
              Message us directly on WhatsApp for personalized recommendations and immediate support.
            </p>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-3 bg-[#25D366] px-8 rounded-full text-base font-bold shadow-lg transition-transform hover:scale-105"
            >
              <MessageSquare size={24} />
              <span>CHAT WITH US</span>
            </Link>
          </div>
        </section>

        {/* Visit Us Section */}
        <section className="py-24 bg-brand-cream/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <FadeIn className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-deep mb-4">Visit Us</h2>
              <p className="text-lg text-brand-deep/70">
                Come see us in person, or get directions straight to our door.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <StoreMap address={STORE_ADDRESS} mapUrl={STORE_MAP_URL} />
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
