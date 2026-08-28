import { MapPin, Navigation } from "lucide-react";

export default function StoreMap({
  address,
  mapUrl,
}: {
  address: string;
  mapUrl: string;
}) {
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="rounded-2xl overflow-hidden border border-brand-muted/20 shadow-sm bg-white">
      <div className="relative w-full aspect-[16/9]">
        <iframe
          src={embedSrc}
          title="George McKye store location"
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <MapPin className="text-brand-primary shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-brand-deep/80">{address}</p>
        </div>
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-deep transition-colors shrink-0"
          >
            <Navigation size={16} />
            Get Directions
          </a>
        )}
      </div>
    </div>
  );
}
