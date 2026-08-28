import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Feather, Droplets, Wind, ShieldCheck } from "lucide-react";

const benefits = [
  {
    title: "ULTRA SOFT",
    description: "Made to deliver a soft, comfortable feel for everyday use.",
    icon: Feather,
  },
  {
    title: "HIGHLY ABSORBENT",
    description: "Designed to absorb efficiently while keeping everyday comfort in mind.",
    icon: Droplets,
  },
  {
    title: "QUICK DRY",
    description: "Lightweight materials designed to dry quickly and stay comfortable.",
    icon: Wind,
  },
  {
    title: "LONG LASTING",
    description: "Thoughtfully made essentials designed for dependable everyday use.",
    icon: ShieldCheck,
  },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-brand-deep pt-20 pb-16">
      {/* Background Image */}
      <Image
        src="/images/hero/hero.png"
        alt="Folded bamboo towels styled with natural bamboo"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-deep/85 via-brand-deep/70 to-brand-deep/90"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center flex-grow justify-center">
        <div className="max-w-3xl text-center text-white mb-16 mt-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Naturally Better. <br />
            <span className="text-brand-cream">Made for Everyday Comfort.</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 mx-auto max-w-xl text-brand-cream/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Thoughtfully crafted natural essentials designed around softness, comfort and lasting quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-none bg-brand-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-natural"
            >
              SHOP COLLECTION
            </Link>
            <Link
              href="/why-bamboo"
              className="inline-flex h-12 items-center justify-center rounded-none border border-brand-cream bg-transparent px-8 text-sm font-medium text-brand-cream shadow-sm transition-colors hover:bg-brand-cream hover:text-brand-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-natural"
            >
              DISCOVER BAMBOO
            </Link>
          </div>
        </div>

        {/* Merged Why Choose Us Section */}
        <div className="w-full mt-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-cream mb-3 tracking-tight">
              Why Choose George McKye?
            </h2>
            <p className="text-base text-brand-cream/80">
              Everyday essentials designed with comfort, quality and thoughtful craftsmanship in mind.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-brand-cream/10 border border-brand-cream/20 flex items-center justify-center mb-5 text-brand-cream group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon strokeWidth={1.5} size={24} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-sm text-brand-cream/80 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
