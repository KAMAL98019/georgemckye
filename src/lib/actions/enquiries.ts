"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  phone: z.string().trim().min(6, "A valid phone number is required").max(20),
  message: z.string().trim().min(1, "Message is required").max(4000),
});

export async function submitContactEnquiry(
  input: z.infer<typeof enquirySchema>
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid enquiry data." };
  }

  try {
    await prisma.contactEnquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        message: parsed.data.message,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to save contact enquiry:", error);
    return { success: false, error: "Could not save your enquiry, but you can still continue to WhatsApp." };
  }
}

export async function markEnquiryStatus(id: string, status: "NEW" | "READ" | "RESOLVED") {
  await prisma.contactEnquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
}
