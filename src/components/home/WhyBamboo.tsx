import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default function WhyBamboo() {
  const benefits = [
    "Ultra Soft feel for everyday use",
    "Highly Absorbent material",
    "Quick Dry properties",
    "Long Lasting durability",
  ];

  return (
    <section className="py-20 bg-brand-cream/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <FadeIn direction="right" className="lg:w-1/2 relative">
            <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/why/portrait.jpg"
                alt="Bamboo material used in George McKye essentials"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-natural rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-muted/50 rounded-full -z-10"></div>
          </FadeIn>

          <FadeIn direction="left" delay={0.15} className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-deep mb-6">
              Why Bamboo?
            </h2>
            <p className="text-lg text-brand-deep/80 mb-8 leading-relaxed">
              We choose bamboo as our core material because it naturally aligns with our commitment to premium quality and everyday comfort.
              Our products are thoughtfully crafted to harness the inherent benefits of bamboo, providing you with essentials that are exceptionally soft, highly functional, and designed to last.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-brand-primary w-6 h-6 shrink-0" />
                  <span className="text-brand-deep font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/why-bamboo"
              className="inline-flex h-12 items-center justify-center bg-transparent border-2 border-brand-primary px-8 text-sm font-bold text-brand-primary shadow-sm transition-colors hover:bg-brand-primary hover:text-white"
            >
              LEARN MORE ABOUT OUR MATERIALS
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
