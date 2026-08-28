import prisma from "@/lib/prisma";
import FadeIn from "@/components/ui/FadeIn";
import TestimonialsCarousel from "./TestimonialsCarousel";

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    return [];
  }
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-deep mb-4">What Our Customers Say</h2>
          <p className="text-lg text-brand-deep/70">
            Real feedback from customers who&apos;ve made George McKye part of their everyday routine.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TestimonialsCarousel testimonials={testimonials} />
        </FadeIn>
      </div>
    </section>
  );
}
