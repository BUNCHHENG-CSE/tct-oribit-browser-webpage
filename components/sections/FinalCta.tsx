import Image from "next/image";
import { OsAwareDownloadButton } from "./OsAwareDownloadButton";
import type { SerializedRelease } from "@/lib/queries/releases";

interface FinalCtaProps {
  release?: SerializedRelease | null;
}

export function FinalCta({ release }: FinalCtaProps) {
  return (
    <section className="pb-24 pt-10 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div
          className="reveal relative isolate overflow-hidden rounded-[2rem] px-7 py-20 text-center text-white sm:py-28"
          style={{
            background:
              "radial-gradient(120% 120% at 0% 0%, oklch(0.6 0.2 258) 0%, transparent 55%), radial-gradient(120% 120% at 100% 100%, oklch(0.55 0.22 300) 0%, transparent 55%), oklch(0.32 0.12 270)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(255 255 255 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <Image
            src="/logo.png"
            alt=""
            width={72}
            height={72}
            className="mx-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          />
          <h2 className="mx-auto mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
            Take back your focus.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/80">
            Free for Windows, macOS and Linux. Bring your bookmarks and be browsing in under a minute.
          </p>
          <OsAwareDownloadButton release={release} variant="light" className="mt-10" />
        </div>
      </div>
    </section>
  );
}
