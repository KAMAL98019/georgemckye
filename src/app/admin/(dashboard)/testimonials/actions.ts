"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  content: z.string().trim().min(1, "Testimonial content is required").max(2000),
  rating: z.coerce.number().int().min(1).max(5),
});

export async function createTestimonial(formData: FormData): Promise<{ error?: string }> {
  const parsed = testimonialSchema.safeParse({
    name: formData.get("name"),
    content: formData.get("content"),
    rating: formData.get("rating"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid testimonial data." };
  }

  await prisma.testimonial.create({ data: parsed.data });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return {};
}

export async function updateTestimonial(id: string, formData: FormData) {
  const parsed = testimonialSchema.safeParse({
    name: formData.get("name"),
    content: formData.get("content"),
    rating: formData.get("rating"),
  });
  if (!parsed.success) return;

  await prisma.testimonial.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialPublish(id: string, isPublished: boolean) {
  await prisma.testimonial.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
