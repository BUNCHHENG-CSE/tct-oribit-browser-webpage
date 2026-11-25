import type { Metadata } from "next";
import { getAllFaqs } from "@/lib/queries/faqs";
import { SupportClient } from "@/components/sections/SupportClient";

export const metadata: Metadata = {
  title: "Support & Knowledge Base — Help, FAQs & Contact",
  description:
    "Search the TCT Orbit knowledge base, read FAQs, report bugs, or get in touch directly with The Capy Team (TCT) core engineering group.",
};

export default async function SupportPage() {
  const faqs = await getAllFaqs();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <div className="relative pt-12 pb-24 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-sm font-medium text-primary">Support</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
          How can we help?
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Search common questions, or send us a message below.
        </p>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SupportClient initialFaqs={faqs} />
      </div>
    </div>
  );
}
