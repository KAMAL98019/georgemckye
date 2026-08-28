"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB per image
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "product";
  let slug = base;
  let attempt = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${attempt}`;
    attempt++;
  }
}

async function saveImageFile(image: File): Promise<{ url?: string; error?: string }> {
  if (image.size > MAX_FILE_SIZE) {
    return { error: `Image "${image.name}" must be less than 1MB.` };
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
    return { error: `Image "${image.name}" must be a JPG, PNG, WEBP or AVIF file.` };
  }

  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const ext = path.extname(image.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true }).catch(() => null);
    await writeFile(path.join(uploadDir, filename), buffer);
    return { url: `/uploads/${filename}` };
  } catch (error) {
    console.error("Error saving image:", error);
    return { error: "Failed to save one of the images." };
  }
}

const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200),
  categoryId: z.string().trim().min(1, "Please select a category"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.union([z.coerce.number().positive(), z.nan()]).optional(),
  stock: z.coerce.number().int().min(0).default(0),
  color: z.string().trim().optional(),
  material: z.string().trim().optional(),
  size: z.string().trim().optional(),
  sizeOptions: z.string().trim().optional(),
  genderOptions: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  description: z.string().trim().optional(),
  careInstructions: z.string().trim().optional(),
  features: z.string().trim().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export async function uploadProduct(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || undefined,
    stock: formData.get("stock") || 0,
    color: formData.get("color") || undefined,
    material: formData.get("material") || undefined,
    size: formData.get("size") || undefined,
    sizeOptions: formData.get("sizeOptions") || undefined,
    genderOptions: formData.get("genderOptions") || undefined,
    sku: formData.get("sku") || undefined,
    description: formData.get("description") || undefined,
    careInstructions: formData.get("careInstructions") || undefined,
    features: formData.get("features") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid product data." };
  }
  const data = parsed.data;

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    return { error: "Selected category was not found." };
  }

  const images = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const savedUrls: string[] = [];
  for (const image of images) {
    const result = await saveImageFile(image);
    if (result.error) return { error: result.error };
    if (result.url) savedUrls.push(result.url);
  }

  try {
    const slug = await uniqueSlug(data.name);
    const sku = data.sku && data.sku.length > 0 ? data.sku : `GMK-${Date.now().toString().slice(-6)}`;

    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      return { error: `SKU "${sku}" is already in use.` };
    }

    await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku,
        description: data.description || "",
        price: data.price,
        salePrice: data.salePrice && !Number.isNaN(data.salePrice) ? data.salePrice : null,
        stock: data.stock,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
        color: data.color || null,
        material: data.material || null,
        size: data.size || null,
        sizeOptions: data.sizeOptions || null,
        genderOptions: data.genderOptions || null,
        careInstructions: data.careInstructions || null,
        features: data.features || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        categoryId: data.categoryId,
        images: {
          create: savedUrls.map((url, index) => ({ url, isPrimary: index === 0, sortOrder: index })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { error: "Database error occurred while creating the product." };
  }
}

export async function updateProduct(id: string, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || undefined,
    stock: formData.get("stock") || 0,
    color: formData.get("color") || undefined,
    material: formData.get("material") || undefined,
    size: formData.get("size") || undefined,
    sizeOptions: formData.get("sizeOptions") || undefined,
    genderOptions: formData.get("genderOptions") || undefined,
    sku: formData.get("sku") || undefined,
    description: formData.get("description") || undefined,
    careInstructions: formData.get("careInstructions") || undefined,
    features: formData.get("features") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid product data." };
  }
  const data = parsed.data;

  const images = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const savedUrls: string[] = [];
  for (const image of images) {
    const result = await saveImageFile(image);
    if (result.error) return { error: result.error };
    if (result.url) savedUrls.push(result.url);
  }

  try {
    const existingImageCount = await prisma.productImage.count({ where: { productId: id } });

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || "",
        price: data.price,
        salePrice: data.salePrice && !Number.isNaN(data.salePrice) ? data.salePrice : null,
        stock: data.stock,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
        color: data.color || null,
        material: data.material || null,
        size: data.size || null,
        sizeOptions: data.sizeOptions || null,
        genderOptions: data.genderOptions || null,
        careInstructions: data.careInstructions || null,
        features: data.features || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        categoryId: data.categoryId,
        images: {
          create: savedUrls.map((url, index) => ({
            url,
            isPrimary: existingImageCount === 0 && index === 0,
            sortOrder: existingImageCount + index,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
  } catch (error) {
    console.error("Failed to update product:", error);
    return { error: "Database error occurred while updating the product." };
  }

  return { success: true };
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
  if (!product) return;

  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return;
  }

  // Only remove the physical files once the DB row is actually gone, so a failed
  // delete never orphans ProductImage rows that point at now-missing files.
  for (const image of product.images) {
    if (image.url.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", image.url)).catch(() => null);
    }
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function toggleProductPublish(id: string, isPublished: boolean) {
  await prisma.product.update({ where: { id }, data: { isPublished } });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function deleteProductImage(productId: string, imageId: string) {
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;

  await prisma.productImage.delete({ where: { id: imageId } });

  if (image.isPrimary) {
    const nextImage = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { sortOrder: "asc" },
    });
    if (nextImage) {
      await prisma.productImage.update({ where: { id: nextImage.id }, data: { isPrimary: true } });
    }
  }

  if (image.url.startsWith("/uploads/")) {
    await unlink(path.join(process.cwd(), "public", image.url)).catch(() => null);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function setPrimaryProductImage(productId: string, imageId: string) {
  await prisma.$transaction([
    prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } }),
    prisma.productImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
  ]);

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/");
  revalidatePath("/shop");
}
