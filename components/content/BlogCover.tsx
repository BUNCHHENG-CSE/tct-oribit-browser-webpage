import Image from "next/image";

/**
 * Built-in covers (/screenshots/blog-*.png) ship a matching "-light" variant
 * (see scripts/generate-blog-covers.ts). CSS shows the one that fits the theme,
 * so toggling light/dark swaps it instantly with no JS. Custom covers render as-is.
 */
function lightVariant(src: string): string | null {
  const m = src.match(/^(\/screenshots\/blog-[a-z0-9-]+?)(-light)?\.png(\?.*)?$/);
  if (!m || m[2]) return null;
  return `${m[1]}-light.png${m[3] ?? ""}`;
}

export function BlogCover({
  src,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const light = lightVariant(src);

  if (!light) {
    return <Image src={src} alt="" fill priority={priority} sizes={sizes} className={`object-cover ${className}`} />;
  }

  return (
    <>
      <Image src={light} alt="" fill priority={priority} sizes={sizes} className={`object-cover dark:hidden ${className}`} />
      <Image src={src} alt="" fill priority={priority} sizes={sizes} className={`hidden object-cover dark:block ${className}`} />
    </>
  );
}
