import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FadeIn from "@/components/ui/FadeIn";

export default function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream/20">
      <Header />

      <main className="flex-grow">
        <section className="bg-brand-deep text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-transparent"></div>
          <div className="container mx-auto relative z-10 max-w-4xl text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
              <p className="text-lg md:text-xl text-brand-cream/90 max-w-2xl mx-auto">{intro}</p>
            </FadeIn>
          </div>
        </section>

        <section className="py-20 px-4 container mx-auto">
          <FadeIn direction="up" className="max-w-3xl mx-auto prose prose-lg text-brand-deep/80">
            {children}
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
