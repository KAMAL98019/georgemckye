"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    }
  };

  if (open) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-32 sm:w-48 border border-brand-muted/40 rounded-full py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white"
        />
        <button type="button" onClick={() => setOpen(false)} className="p-2 hover:text-brand-natural transition-colors" aria-label="Close search">
          <X className="w-5 h-5" />
        </button>
      </form>
    );
  }

  return (
    <button onClick={() => setOpen(true)} className="p-2 hover:text-brand-natural transition-colors" aria-label="Search">
      <Search className="w-5 h-5" />
    </button>
  );
}
