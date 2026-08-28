"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import type { Testimonial } from "@prisma/client";

const AUTOPLAY_INTERVAL = 6000;

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % testimonials.length) + testimonials.length) % testimonials.length);
    },
    [testimonials.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonials.length]);

  const pause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const testimonial = testimonials[index];

  return (
    <div
      className="relative max-w-2xl mx-auto"
      onMouseEnter={pause}
      onFocus={pause}
    >
      <div className="bg-brand-cream/30 rounded-2xl p-8 md:p-12 border border-brand-muted/20 text-center min-h-[280px] flex flex-col items-center justify-center transition-opacity duration-300">
        <Quote className="text-brand-primary/30 w-10 h-10 mb-4" />
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < testimonial.rating ? "fill-brand-primary text-brand-primary" : "text-brand-muted"}
            />
          ))}
        </div>
        <p className="text-lg text-brand-deep/80 leading-relaxed mb-6 max-w-xl">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <p className="font-bold text-brand-deep">{testimonial.name}</p>
      </div>

      {testimonials.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:translate-x-0 w-10 h-10 rounded-full bg-white border border-brand-muted/30 shadow-sm flex items-center justify-center text-brand-deep hover:bg-brand-primary hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-0 w-10 h-10 rounded-full bg-white border border-brand-muted/30 shadow-sm flex items-center justify-center text-brand-deep hover:bg-brand-primary hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-brand-primary" : "w-2 bg-brand-muted/50 hover:bg-brand-muted"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
