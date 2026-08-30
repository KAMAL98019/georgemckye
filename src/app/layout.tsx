import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { CartSidebarProvider } from "@/context/CartSidebarContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import CartSidebar from "@/components/cart/CartSidebar";
import { getSiteSettings } from "@/lib/settings";
import { STORE_PHONE, LOGO_URL } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://georgemckye.shop";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.seoTitle,
      template: "%s | George McKye",
    },
    description: settings.seoDescription,
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: SITE_URL,
      siteName: "George McKye",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "George McKye",
        url: SITE_URL,
        logo: `${SITE_URL}${LOGO_URL}`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: `+91${STORE_PHONE.replace(/^0/, "")}`,
          contactType: "customer service",
          email: settings.contactEmail,
        },
      },
      {
        "@type": "WebSite",
        name: "George McKye",
        url: SITE_URL,
      },
    ],
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SiteSettingsProvider settings={settings}>
          <CartProvider>
            <CartSidebarProvider>
              {children}
              <CartSidebar />
              <Toaster
                position="bottom-center"
                richColors
                toastOptions={{
                  style: {
                    fontFamily: "var(--font-sans)",
                  },
                }}
              />
            </CartSidebarProvider>
          </CartProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
