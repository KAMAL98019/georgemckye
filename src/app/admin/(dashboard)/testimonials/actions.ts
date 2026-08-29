"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "fs/promises";
import path from "path";
import { z } from "zod";
import { saveImageFile } from "@/lib/uploadImage";

const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  content: z.string().trim().min(1, "Testimonial content is required").max(2000),
  rating: z.coerce.number().int().min(1).max(5),
});

async function deleteImageFile(imageUrl: string | null) {
  if (!imageUrl) return;
  await unlink(path.join(process.cwd(), "public", imageUrl)).catch(() => null);
}

export async function createTestimonial(formData: FormData): Promise<{ error?: string }> {
  const parsed = testimonialSchema.safeParse({
    name: formData.get("name"),
    content: formData.get("content"),
    rating: formData.get("rating"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid testimonial data." };
  }

  let imageUrl: string | undefined;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const result = await saveImageFile(image);
    if (result.error) return { error: result.error };
    imageUrl = result.url;
  }

  await prisma.testimonial.create({ data: { ...parsed.data, imageUrl } });

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

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  let imageUrl = existing?.imageUrl ?? null;

  const removeImage = formData.get("removeImage") === "on";
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const result = await saveImageFile(image);
    if (result.error) return;
    await deleteImageFile(imageUrl);
    imageUrl = result.url ?? null;
  } else if (removeImage) {
    await deleteImageFile(imageUrl);
    imageUrl = null;
  }

  await prisma.testimonial.update({ where: { id }, data: { ...parsed.data, imageUrl } });

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
