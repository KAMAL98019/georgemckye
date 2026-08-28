import { Sparkles } from "lucide-react";

export default function ScrollingMarquee() {
  const words = [
    "ULTRA SOFT", 
    "HIGHLY ABSORBENT", 
    "QUICK DRY", 
    "LONG LASTING",
    "NATURAL COMFORT", 
    "THOUGHTFULLY MADE", 
    "EVERYDAY ESSENTIALS"
  ];
  
  const repeatCount = 8; // Ensure it fills ultra-wide screens
  
  return (
    <div className="w-full bg-brand-deep py-6 overflow-hidden border-y border-brand-primary/40 shadow-inner">
      <div className="flex w-max animate-marquee whitespace-nowrap motion-reduce:animate-none">
        {Array.from({ length: repeatCount }).map((_, i) => (
          <div key={`m-${i}`} className="flex items-center">
            {words.map((word, wIdx) => (
              <div key={`w-${wIdx}`} className="flex items-center">
                <span className="text-sm md:text-base font-medium text-brand-cream tracking-[0.25em] px-8 md:px-12">
                  {word}
                </span>
                <Sparkles className="text-brand-natural/70 opacity-60" size={14} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
