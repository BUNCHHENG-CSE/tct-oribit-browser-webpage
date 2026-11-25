import Link from "next/link";
import Image from "next/image";

interface OrbitLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function OrbitLogo({ className = "", size = 28, showText = true }: OrbitLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 transition-opacity hover:opacity-80 ${className}`}
      aria-label="TCT Orbit home"
    >
      <Image src="/logo.png" alt="" width={size} height={size} priority className="shrink-0 object-contain" />
      {showText && <span className="font-semibold text-[17px] tracking-tight text-foreground">TCT Orbit</span>}
    </Link>
  );
}
