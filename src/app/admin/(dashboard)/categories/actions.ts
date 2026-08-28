"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(500).optional(),
});

export async function createCategory(formData: FormData): Promise<{ error?: string }> {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid category data." };
  }

  const baseSlug = slugify(parsed.data.name);
  if (!baseSlug) {
    return { error: "Please provide a valid category name." };
  }

  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${attempt}`;
    attempt++;
  }

  const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
  return {};
}

export async function updateCategory(id: string, formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) return;

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) return {};

  if (category._count.products > 0) {
    const count = category._count.products;
    return {
      error: `Can't delete "${category.name}" — it still has ${count} product${count === 1 ? "" : "s"}. Move or delete those products first.`,
    };
  }

  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { error: "Failed to delete category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
  return {};
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  await prisma.category.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function reorderCategory(id: string, direction: "up" | "down") {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= categories.length) return;

  const current = categories[index];
  const swap = categories[swapIndex];

  await prisma.$transaction([
    prisma.category.update({ where: { id: current.id }, data: { sortOrder: swap.sortOrder } }),
    prisma.category.update({ where: { id: swap.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/categories");
  revalidatePath("/");
}
