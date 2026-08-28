import prisma from "@/lib/prisma";
import { withRetry } from "@/lib/withRetry";

export type SiteSettings = {
  whatsappNumber: string;
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
  seoTitle: string;
  seoDescription: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: process.env.WHATSAPP_OWNER_NUMBER || "917904039072",
  contactEmail: "contact@georgemckye.shop",
  instagramUrl: "",
  facebookUrl: "",
  seoTitle: "George McKye | Premium Natural Comfort",
  seoDescription:
    "Thoughtfully crafted natural essentials designed around softness, comfort and lasting quality.",
};

const KEY_MAP: Record<keyof SiteSettings, string> = {
  whatsappNumber: "whatsapp_owner_number",
  contactEmail: "contact_email",
  instagramUrl: "social_instagram",
  facebookUrl: "social_facebook",
  seoTitle: "seo_title",
  seoDescription: "seo_description",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await withRetry(() => prisma.siteSetting.findMany());
    const map = new Map(rows.map((row) => [row.key, row.value]));

    const settings = { ...DEFAULT_SETTINGS };
    (Object.keys(KEY_MAP) as (keyof SiteSettings)[]).forEach((field) => {
      const dbKey = KEY_MAP[field];
      const value = map.get(dbKey);
      if (value !== undefined && value !== "") {
        settings[field] = value;
      }
    });
    return settings;
  } catch (error) {
    console.error("Failed to load site settings, using defaults:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(
  values: Partial<Record<keyof SiteSettings, string>>
): Promise<void> {
  const entries = Object.entries(values) as [keyof SiteSettings, string][];
  await prisma.$transaction(
    entries.map(([field, value]) =>
      prisma.siteSetting.upsert({
        where: { key: KEY_MAP[field] },
        create: { key: KEY_MAP[field], value: value ?? "" },
        update: { value: value ?? "" },
      })
    )
  );
}

export { KEY_MAP as SETTINGS_KEY_MAP };
