"use client";

import { useState } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { submitContactEnquiry } from "@/lib/actions/enquiries";
import { MessageCircle } from "lucide-react";

export default function ContactForm() {
  const { whatsappNumber } = useSiteSettings();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const result = await submitContactEnquiry(formData);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
    }

    const message =
      `*New Enquiry from Website*\n\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      (formData.email ? `Email: ${formData.email}\n` : "") +
      `\nMessage:\n${formData.message}`;

    const url = buildWhatsAppUrl(whatsappNumber, message);
    window.open(url, "_blank", "noopener,noreferrer");

    setStatus("sent");
    setSubmitting(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-brand-deep mb-1">Name *</label>
        <input
          required
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-brand-muted/40 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-brand-cream/5"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-deep mb-1">Phone *</label>
        <input
          required
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-brand-muted/40 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-brand-cream/5"
          placeholder="+91 98765 43210"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-deep mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-brand-muted/40 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-brand-cream/5"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-deep mb-1">Message *</label>
        <textarea
          required
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="w-full border border-brand-muted/40 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-brand-cream/5"
          placeholder="How can we help you?"
        ></textarea>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {status === "sent" && (
        <p className="text-sm text-brand-primary">
          Saved. WhatsApp has opened with your message ready — press Send there to reach us.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold uppercase tracking-wider py-4 rounded-lg hover:bg-brand-primary/90 transition-colors mt-4 disabled:opacity-60"
      >
        <MessageCircle size={18} />
        <span>{submitting ? "Sending..." : "Send via WhatsApp"}</span>
      </button>
      <p className="text-xs text-center text-brand-deep/50">
        WhatsApp will open with this message ready to send. You must press Send in WhatsApp to notify us.
      </p>
    </form>
  );
}
