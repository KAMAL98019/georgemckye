"use server";

import prisma from "@/lib/prisma";
import { signAdminSession, ADMIN_SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

// Only allow redirecting back into /admin — anything else (external URLs,
// protocol-relative "//evil.com") is rejected to avoid an open-redirect.
function sanitizeCallbackUrl(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value) return "/admin/dashboard";
  if (!value.startsWith("/admin") || value.startsWith("//") || value.includes("://")) {
    return "/admin/dashboard";
  }
  return value;
}

function loginErrorRedirect(message: string, callbackUrl: string): never {
  const params = new URLSearchParams({ error: message });
  if (callbackUrl !== "/admin/dashboard") params.set("callbackUrl", callbackUrl);
  redirect(`/admin/login?${params.toString()}`);
}

export async function adminLogin(formData: FormData): Promise<void> {
  const callbackUrl = sanitizeCallbackUrl(formData.get("callbackUrl"));

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    loginErrorRedirect(parsed.error.issues[0]?.message || "Invalid credentials.", callbackUrl);
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user || user.role !== "ADMIN") {
    loginErrorRedirect("Invalid email or password.", callbackUrl);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    loginErrorRedirect("Invalid email or password.", callbackUrl);
  }

  const token = await signAdminSession({ userId: user.id, email: user.email, name: user.name });

  cookies().set(ADMIN_SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

  redirect(callbackUrl);
}

export async function adminLogout() {
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
