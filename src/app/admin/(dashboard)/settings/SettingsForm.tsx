"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/settings";
import { updateSettings } from "./actions";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [values, setValues] = useState({
    whatsappNumber: settings.whatsappNumber,
    contactEmail: settings.contactEmail,
    instagramUrl: settings.instagramUrl,
    facebookUrl: settings.facebookUrl,
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));

    try {
      const result = await updateSettings(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Owner Number *</label>
        <input name="whatsappNumber" required value={values.whatsappNumber} onChange={handleChange} placeholder="+91 79040 39072" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        <p className="text-xs text-gray-500 mt-1">Include the country code — spaces and a leading + are fine, e.g. +91 79040 39072.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
        <input type="email" name="contactEmail" value={values.contactEmail} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
          <input name="instagramUrl" value={values.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
          <input name="facebookUrl" value={values.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title *</label>
        <input name="seoTitle" required value={values.seoTitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description *</label>
        <textarea name="seoDescription" required rows={2} value={values.seoDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
      </div>

      <p className="text-xs text-gray-500 border-t border-gray-200 pt-4">
        Logo, business address, and phone number are set as static content in the codebase and aren&apos;t editable here.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Settings saved.</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-primary text-white py-2 px-6 rounded-md hover:bg-brand-deep transition-colors disabled:opacity-60 text-sm font-medium"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
