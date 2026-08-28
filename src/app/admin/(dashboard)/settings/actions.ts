"use server";

import { updateSiteSettings } from "@/lib/settings";
import { normalizePhoneNumber } from "@/lib/whatsapp";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  whatsappNumber: z.string().trim().min(6, "Enter a valid WhatsApp number with country code."),
  contactEmail: z.union([z.string().trim().email(), z.literal("")]),
  instagramUrl: z.union([z.string().trim().url(), z.literal("")]),
  facebookUrl: z.union([z.string().trim().url(), z.literal("")]),
  seoTitle: z.string().trim().min(1, "SEO title is required."),
  seoDescription: z.string().trim().min(1, "SEO description is required."),
});

export async function updateSettings(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const parsed = settingsSchema.safeParse({
    whatsappNumber: formData.get("whatsappNumber"),
    contactEmail: formData.get("contactEmail"),
    instagramUrl: formData.get("instagramUrl"),
    facebookUrl: formData.get("facebookUrl"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid settings." };
  }

  const normalizedWhatsapp = normalizePhoneNumber(parsed.data.whatsappNumber);
  if (normalizedWhatsapp.length < 10) {
    return { error: "Enter a valid WhatsApp number with country code (e.g. +91 79040 39072)." };
  }

  await updateSiteSettings({
    ...parsed.data,
    whatsappNumber: normalizedWhatsapp,
  });

  revalidatePath("/", "layout");
  return { success: true, error: undefined };
}
