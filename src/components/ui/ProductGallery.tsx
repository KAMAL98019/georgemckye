"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

type GalleryImage = { id: string; url: string };

export default function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/5] md:aspect-square bg-white rounded-xl overflow-hidden border border-brand-muted/20 flex items-center justify-center text-brand-muted bg-brand-cream/30">
        No Image Available
      </div>
    );
  }

  const selected = images[selectedIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const goTo = (index: number) => setSelectedIndex(((index % images.length) + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Main image — hover to zoom, click to open lightbox */}
      <div
        ref={containerRef}
        className="relative aspect-[4/5] md:aspect-square bg-white rounded-xl overflow-hidden border border-brand-muted/20 cursor-zoom-in group"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={selected.url}
          alt={productName}
          fill
          priority
          className="object-cover transition-transform duration-200 ease-out"
          style={
            isZooming
              ? { transform: "scale(2)", transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
              : undefined
          }
        />
        <div className="absolute bottom-3 right-3 bg-white/90 rounded-full p-2 text-brand-deep opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn size={18} />
        </div>
      </div>

      {/* Thumbnails — hover or click to switch the main image */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onMouseEnter={() => goTo(index)}
              onClick={() => goTo(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                index === selectedIndex ? "border-brand-primary" : "border-brand-muted/20 hover:border-brand-primary/50"
              }`}
            >
              <Image src={img.url} alt={productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox preview */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Close preview"
          >
            <X size={28} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(selectedIndex - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(selectedIndex + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-2xl aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={selected.url} alt={productName} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
