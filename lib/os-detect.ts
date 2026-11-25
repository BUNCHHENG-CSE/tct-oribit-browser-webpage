export type DetectedOS = "WINDOWS" | "MACOS" | "LINUX" | "UNKNOWN";

export function detectOSFromUserAgent(userAgent?: string): DetectedOS {
  if (!userAgent) return "WINDOWS"; // default safe fallback

  const ua = userAgent.toLowerCase();
  if (ua.includes("win")) return "WINDOWS";
  if (ua.includes("mac") || ua.includes("iphone") || ua.includes("ipad")) return "MACOS";
  if (ua.includes("linux") || ua.includes("x11") || ua.includes("android")) return "LINUX";

  return "WINDOWS";
}

export function getClientOS(): DetectedOS {
  if (typeof window === "undefined" || !navigator) return "WINDOWS";

  // Use modern userAgentData if present
  const nav = navigator as unknown as { userAgentData?: { platform?: string } };
  if (nav.userAgentData?.platform) {
    const p = nav.userAgentData.platform.toLowerCase();
    if (p.includes("win")) return "WINDOWS";
    if (p.includes("mac")) return "MACOS";
    if (p.includes("linux")) return "LINUX";
  }

  return detectOSFromUserAgent(navigator.userAgent);
}

export function getOSLabel(os: DetectedOS): string {
  switch (os) {
    case "WINDOWS":
      return "Windows";
    case "MACOS":
      return "macOS";
    case "LINUX":
      return "Linux";
    default:
      return "Windows";
  }
}
