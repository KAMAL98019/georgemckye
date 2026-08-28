import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import { Quote } from "lucide-react";

export default function BNITrust() {
  return (
    <section className="py-24 bg-brand-cream/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-muted/50 to-transparent"></div>
      
      <FadeIn className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          
          {/* Profile Image */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-brand-primary rounded-full transform translate-x-3 translate-y-3 opacity-20"></div>
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src="/owner_photo.jpeg"
                alt="Hemanth Srinivasan"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Quote className="text-brand-primary/20 w-12 h-12 mb-4" />
            <p className="text-lg md:text-xl text-brand-deep/80 leading-relaxed font-medium mb-8 max-w-2xl text-balance">
              &ldquo;We believe that the items you use every day should be nothing short of exceptional. Our goal is to bring you natural, uncompromising comfort that lasts.&rdquo;
            </p>
            
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full border-t border-brand-muted/30 pt-6">
              
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-brand-deep">Hemanth Srinivasan</h3>
                <p className="text-brand-primary font-medium tracking-wide">Founder, George McKye</p>
              </div>

              <div className="h-px md:h-12 w-16 md:w-px bg-brand-muted/30 my-4 md:my-0"></div>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-10 bg-white rounded shadow-sm px-2">
                  <Image
                    src="/bni_logo.jpg"
                    alt="BNI Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-brand-deep leading-tight">Proud BNI Member</p>
                  <p className="text-xs text-brand-deep/60">Trusted Business Network</p>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </FadeIn>
    </section>
  );
}
