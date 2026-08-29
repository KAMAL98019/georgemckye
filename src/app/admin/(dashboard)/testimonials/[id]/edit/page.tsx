import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { updateTestimonial } from "../../actions";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id: params.id } });
  if (!testimonial) notFound();

  const updateWithId = updateTestimonial.bind(null, testimonial.id);

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/testimonials" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Testimonial</h1>
      </div>

      <form action={updateWithId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
          <input name="name" required defaultValue={testimonial.name} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial *</label>
          <textarea name="content" required rows={4} defaultValue={testimonial.content} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <select name="rating" defaultValue={testimonial.rating} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary">
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
          {testimonial.imageUrl && (
            <div className="flex items-center gap-3 mb-3">
              <Image src={testimonial.imageUrl} alt={testimonial.name} width={56} height={56} className="rounded-full object-cover w-14 h-14" />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="removeImage" className="rounded border-gray-300" />
                Remove current photo
              </label>
            </div>
          )}
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" className="w-full text-sm text-gray-600" />
          <p className="text-xs text-gray-400 mt-1">Uploading a new photo replaces the current one. Leave empty to keep it, or check &quot;Remove&quot; for text-only.</p>
        </div>
        <button type="submit" className="bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-deep transition-colors text-sm font-medium">
          Save Changes
        </button>
      </form>
    </div>
  );
}
