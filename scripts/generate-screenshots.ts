import fs from "fs";
import path from "path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "screenshots");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function makeSvg(title: string, subtitle: string, color: string, accent: string) {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeSlug = title.toLowerCase().replace(/[^a-z0-9]/g, "-");

  return `<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#070a13" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#070a13" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${color}" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="windowBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0.05)" />
      </linearGradient>
    </defs>

    <rect width="1200" height="750" fill="url(#bg)" />
    <circle cx="600" cy="250" r="450" fill="url(#glow)" />

    <!-- Stars -->
    <circle cx="120" cy="90" r="1.5" fill="#ffffff" opacity="0.6" />
    <circle cx="340" cy="180" r="1.2" fill="#ffffff" opacity="0.4" />
    <circle cx="890" cy="80" r="1.8" fill="#ffffff" opacity="0.7" />
    <circle cx="1050" cy="220" r="1.3" fill="#ffffff" opacity="0.5" />
    <circle cx="210" cy="450" r="1" fill="#ffffff" opacity="0.3" />
    <circle cx="980" cy="560" r="1.4" fill="#ffffff" opacity="0.6" />
    <circle cx="1120" cy="620" r="1.5" fill="#ffffff" opacity="0.5" />

    <!-- Mockup Window -->
    <g transform="translate(100, 80)">
      <rect width="1000" height="590" rx="16" fill="#0b1120" stroke="url(#windowBorder)" stroke-width="1.5" />
      
      <!-- Window Titlebar -->
      <rect width="1000" height="48" rx="16" fill="#070b14" />
      <rect y="36" width="1000" height="12" fill="#070b14" />
      <circle cx="28" cy="24" r="6" fill="#ef4444" opacity="0.8" />
      <circle cx="48" cy="24" r="6" fill="#f59e0b" opacity="0.8" />
      <circle cx="68" cy="24" r="6" fill="#10b981" opacity="0.8" />

      <!-- Omnibox -->
      <rect x="220" y="10" width="560" height="28" rx="6" fill="#162035" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      <circle cx="236" cy="24" r="5" fill="${accent}" opacity="0.8" />
      <text x="250" y="28" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">tctorbit://spaces/${safeSlug}</text>

      <!-- Sidebar -->
      <rect x="0" y="48" width="200" height="542" fill="#070b14" opacity="0.9" />
      <line x1="200" y1="48" x2="200" y2="590" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      
      <!-- Space items -->
      <rect x="16" y="68" width="168" height="32" rx="6" fill="${color}" opacity="0.2" />
      <rect x="24" y="78" width="12" height="12" rx="3" fill="${accent}" />
      <text x="46" y="88" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#ffffff">Active Space</text>

      <rect x="16" y="110" width="168" height="28" rx="6" fill="transparent" />
      <circle cx="30" cy="124" r="4" fill="#64748b" />
      <text x="46" y="128" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">General Tabs (14)</text>

      <rect x="16" y="146" width="168" height="28" rx="6" fill="transparent" />
      <circle cx="30" cy="160" r="4" fill="#64748b" />
      <text x="46" y="164" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">Research Vault</text>

      <!-- Content Area -->
      <g transform="translate(240, 90)">
        <text x="0" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="700" fill="#ffffff">${safeTitle}</text>
        <text x="0" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#94a3b8">${safeSubtitle}</text>

        <!-- Graphic inside view -->
        <rect x="0" y="140" width="700" height="300" rx="12" fill="#070d1a" stroke="rgba(255,255,255,0.06)" />
        <circle cx="350" cy="290" r="180" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.4" />
        <circle cx="350" cy="290" r="80" fill="${color}" opacity="0.15" />
        <circle cx="350" cy="290" r="16" fill="${accent}" />
        <circle cx="477" cy="290" r="8" fill="#38bdf8" />
        <text x="350" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">Zero Cloud Telemetry • 100% Local Sovereign Data</text>
      </g>
    </g>
  </svg>`;
}

const screenshots = [
  // Blog covers (blog-*.png) are made by scripts/generate-blog-covers.ts.
  {
    name: "spaces-screenshot.png",
    title: "Organize with Spaces",
    subtitle: "Custom icons, palettes, and isolated tab contexts.",
    color: "#2563eb",
    accent: "#38bdf8",
  },
  {
    name: "splitview-screenshot.png",
    title: "Two Pages, One View",
    subtitle: "Side-by-side verification with 60fps GPU fluid divider resizing.",
    color: "#8b5cf6",
    accent: "#a855f7",
  },
  {
    name: "zen-screenshot.png",
    title: "Enter Zen Mode",
    subtitle: "Strip away all banners, toolbars, and clutter with one keystroke.",
    color: "#10b981",
    accent: "#34d399",
  },
  {
    name: "shield-screenshot.png",
    title: "Orbit Privacy Shield",
    subtitle: "Ad & tracker blocking with Ghostery lists, plus fingerprint noise.",
    color: "#f59e0b",
    accent: "#fbbf24",
  },
  {
    name: "browser-main.png",
    title: "TCT Orbit Browser",
    subtitle: "Focused, fast, private desktop browser for Windows, macOS and Linux.",
    color: "#2563eb",
    accent: "#60a5fa",
  },
];

async function generate() {
  for (const s of screenshots) {
    const svg = makeSvg(s.title, s.subtitle, s.color, s.accent);
    const target = path.join(outDir, s.name);
    await sharp(Buffer.from(svg)).png().toFile(target);
    console.log(`Generated ${s.name}`);
  }
}

generate().catch(console.error);
