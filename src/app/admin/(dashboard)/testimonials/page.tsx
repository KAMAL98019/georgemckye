import prisma from "@/lib/prisma";
import Link from "next/link";
import { Edit, Star } from "lucide-react";
import TestimonialForm from "./TestimonialForm";
import { deleteTestimonial, toggleTestimonialPublish } from "./actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Testimonials</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-xl">
        <h2 className="font-bold text-gray-900 mb-4">Add New Testimonial</h2>
        <TestimonialForm />
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          No testimonials yet. Add one above.
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${testimonial.isPublished ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                    {testimonial.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{testimonial.content}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <form action={toggleTestimonialPublish.bind(null, testimonial.id, !testimonial.isPublished)}>
                  <button type="submit" className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                    {testimonial.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <Link href={`/admin/testimonials/${testimonial.id}/edit`} className="text-gray-400 hover:text-brand-primary transition-colors">
                  <Edit size={18} />
                </Link>
                <ConfirmDeleteButton
                  action={deleteTestimonial.bind(null, testimonial.id)}
                  confirmMessage={`Delete this testimonial from "${testimonial.name}"? This can't be undone.`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
