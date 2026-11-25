import { getLatestRelease } from "@/lib/queries/releases";
import { getAllFaqs } from "@/lib/queries/faqs";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Showcase } from "@/components/sections/Showcase";
import { PrivacyShowcase } from "@/components/sections/PrivacyShowcase";
import { BuiltIn } from "@/components/sections/BuiltIn";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCta } from "@/components/sections/FinalCta";

export default async function HomePage() {
  const [latestRelease, faqs] = await Promise.all([getLatestRelease("STABLE"), getAllFaqs()]);

  return (
    <>
      <Hero latestRelease={latestRelease} />
      <Stats />
      <Showcase />
      <PrivacyShowcase />
      <BuiltIn />
      <FaqAccordion faqs={faqs} />
      <FinalCta release={latestRelease} />
    </>
  );
}
