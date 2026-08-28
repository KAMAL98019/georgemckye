import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeIn from "@/components/ui/FadeIn";
import ContactForm from "@/components/contact/ContactForm";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { normalizePhoneNumber } from "@/lib/whatsapp";
import StoreMap from "@/components/ui/StoreMap";
import { STORE_ADDRESS, STORE_MAP_URL } from "@/lib/constants";
import type { Metadata } from "next";

// Renders Footer (categories) at request time instead of freezing whatever
// state the DB was in during the build's static-generation step.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with George McKye for order enquiries, product questions, and support.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const normalizedWhatsapp = normalizePhoneNumber(settings.whatsappNumber);
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream/20">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-brand-deep text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-transparent"></div>
          <div className="container mx-auto relative z-10 max-w-4xl text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
              <p className="text-lg md:text-xl text-brand-cream/90 max-w-2xl mx-auto">
                Have a question about our products or your order? We&apos;re here to help. Reach out to us through any of the channels below.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-24 px-4 container mx-auto">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Details */}
            <div className="space-y-12">
              <FadeIn direction="right" delay={0.1}>
                <h2 className="text-3xl font-bold text-brand-deep mb-8">Contact Information</h2>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-primary shrink-0">
                      <MessageCircle size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-brand-deep mb-1">WhatsApp Support</h4>
                      <p className="text-brand-deep/70 mb-2">The fastest way to reach us for order inquiries and support.</p>
                      <a href={`https://wa.me/${normalizedWhatsapp}`} className="text-brand-primary font-bold hover:underline">
                        +{normalizedWhatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-primary shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-brand-deep mb-1">Email Us</h4>
                      <p className="text-brand-deep/70 mb-2">For general inquiries and wholesale requests.</p>
                      <a href={`mailto:${settings.contactEmail}`} className="text-brand-primary font-bold hover:underline">
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-primary shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-brand-deep mb-1">Headquarters</h4>
                      <p className="text-brand-deep/70">{STORE_ADDRESS}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Contact Form */}
            <FadeIn direction="left" delay={0.2}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-muted/20">
                <h3 className="text-2xl font-bold text-brand-deep mb-6">Send us a message</h3>
                <ContactForm />
              </div>
            </FadeIn>

          </div>
        </section>

        {/* Store Location Map */}
        <section className="pb-24 px-4 container mx-auto">
          <div className="max-w-5xl mx-auto">
            <FadeIn direction="up">
              <StoreMap address={STORE_ADDRESS} mapUrl={STORE_MAP_URL} />
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
