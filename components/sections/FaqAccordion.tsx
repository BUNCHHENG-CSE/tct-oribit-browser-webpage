import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/queries/faqs";

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-3 lg:gap-16">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Questions?</h2>
          <p className="mt-4 text-muted-foreground">
            Can&apos;t find what you need?{" "}
            <Link href="/support" className="text-foreground underline underline-offset-4 hover:text-primary">
              Visit support
            </Link>
            .
          </p>
        </div>

        <Accordion className="lg:col-span-2">
          {faqs.slice(0, 5).map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-b border-border">
              <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
