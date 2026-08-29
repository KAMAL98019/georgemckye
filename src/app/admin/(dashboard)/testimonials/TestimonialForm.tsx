"use client";

import { useRef, useState } from "react";
import { createTestimonial } from "./actions";

export default function TestimonialForm() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);
    formData.append("rating", rating);
    const image = fileInputRef.current?.files?.[0];
    if (image) formData.append("image", image);

    try {
      const result = await createTestimonial(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setName("");
        setContent("");
        setRating("5");
        if (fileInputRef.current) fileInputRef.current.value = "";
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="e.g. Ananya Sharma" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial *</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={3} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary">
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
        <input ref={fileInputRef} type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" className="w-full text-sm text-gray-600" />
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP or AVIF, under 1MB. Leave empty to show text only.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Testimonial added.</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-deep transition-colors disabled:opacity-60 text-sm font-medium"
      >
        {loading ? "Adding..." : "Add Testimonial"}
      </button>
    </form>
  );
}
