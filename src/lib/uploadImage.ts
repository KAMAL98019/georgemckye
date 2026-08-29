import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB per image
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];

export async function saveImageFile(image: File): Promise<{ url?: string; error?: string }> {
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
