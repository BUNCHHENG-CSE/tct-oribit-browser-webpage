/**
 * Blog cover images (public/screenshots/blog-*.png), 1200×750.
 *
 *   bun scripts/generate-blog-covers.ts
 *
 * Layout rules so covers survive every crop the site uses:
 *  - blog cards: 16:10 (full image)
 *  - post hero: 16:9 (≈37px trimmed top/bottom)
 *  - social previews: ~1.91:1 (≈60px trimmed top/bottom)
 * → keep all text and key shapes between y=90 and y=660.
 *
 * Each cover has ONE short headline (the full post title is printed under the
 * card already) at a size that stays legible when the card is ~380px wide.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const W = 1200;
const H = 750;
const FONT = "'Segoe UI', Inter, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Cascadia Code', Consolas, 'SFMono-Regular', Menlo, monospace";

const outDir = path.join(process.cwd(), "public", "screenshots");
const logo = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "public", "icon-192.png"))
  .toString("base64")}`;

type Theme = { main: string; soft: string };

/* ------------------------------------------------------------------ */
/* Shared frame: background, brand row, category, headline, subline    */
/* ------------------------------------------------------------------ */

function frame(opts: {
  theme: Theme;
  category: string;
  headline: string[];
  sub: string;
  art: string;
}) {
  const { theme, category, headline, sub, art } = opts;
  const lineH = 76;
  const headTop = 318;
  const subY = headTop + (headline.length - 1) * lineH + 62;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#05070d"/>
      <stop offset="1" stop-color="#0b1222"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.72" cy="0.48" r="0.55">
      <stop offset="0" stop-color="${theme.main}" stop-opacity="0.38"/>
      <stop offset="1" stop-color="${theme.main}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.035"/>
    </pattern>
    <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#05070d" stop-opacity="0.9"/>
      <stop offset="0.5" stop-color="#05070d" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#121a2e"/>
      <stop offset="1" stop-color="#0b1120"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  ${art}

  <rect width="${W}" height="${H}" fill="url(#fadeL)" pointer-events="none"/>

  <!-- Brand row -->
  <image href="${logo}" x="72" y="104" width="44" height="44"/>
  <text x="130" y="134" font-family="${FONT}" font-size="22" font-weight="600" fill="#e2e8f0">TCT Orbit</text>
  <text x="236" y="134" font-family="${FONT}" font-size="22" fill="#64748b">Journal</text>

  <!-- Category -->
  <rect x="72" y="192" width="${category.length * 13 + 40}" height="38" rx="19" fill="${theme.main}" fill-opacity="0.16" stroke="${theme.soft}" stroke-opacity="0.45"/>
  <text x="92" y="217" font-family="${FONT}" font-size="16" font-weight="700" letter-spacing="2" fill="${theme.soft}">${category}</text>

  <!-- Headline -->
  ${headline
    .map(
      (line, i) =>
        `<text x="68" y="${headTop + i * lineH}" font-family="${FONT}" font-size="70" font-weight="800" letter-spacing="-2" fill="#ffffff">${line}</text>`,
    )
    .join("\n  ")}
  <text x="72" y="${subY}" font-family="${FONT}" font-size="26" fill="#94a3b8">${sub}</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Small drawing helpers                                               */
/* ------------------------------------------------------------------ */

const bar = (x: number, y: number, w: number, o = 0.12, h = 10) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#ffffff" fill-opacity="${o}"/>`;

function windowChrome(x: number, y: number, w: number, h: number, url: string) {
  return `
  <g filter="url(#shadow)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#win)" stroke="#ffffff" stroke-opacity="0.12"/>
  </g>
  <circle cx="${x + 24}" cy="${y + 24}" r="6" fill="#ef4444" fill-opacity="0.85"/>
  <circle cx="${x + 44}" cy="${y + 24}" r="6" fill="#f59e0b" fill-opacity="0.85"/>
  <circle cx="${x + 64}" cy="${y + 24}" r="6" fill="#10b981" fill-opacity="0.85"/>
  <rect x="${x + 96}" y="${y + 11}" width="${w - 120}" height="26" rx="13" fill="#ffffff" fill-opacity="0.06"/>
  <text x="${x + 114}" y="${y + 29}" font-family="${MONO}" font-size="13" fill="#64748b">${url}</text>
  <line x1="${x}" y1="${y + 48}" x2="${x + w}" y2="${y + 48}" stroke="#ffffff" stroke-opacity="0.07"/>`;
}

function keycap(x: number, y: number, label: string, w = 64) {
  return `
  <rect x="${x}" y="${y + 4}" width="${w}" height="52" rx="12" fill="#000" fill-opacity="0.5"/>
  <rect x="${x}" y="${y}" width="${w}" height="52" rx="12" fill="#1a2338" stroke="#ffffff" stroke-opacity="0.18"/>
  <text x="${x + w / 2}" y="${y + 34}" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="700" fill="#e2e8f0">${label}</text>`;
}

/* ------------------------------------------------------------------ */
/* 1. Introducing — window with Spaces sidebar, orbit ring, Command Bar */
/* ------------------------------------------------------------------ */

function introducing() {
  const theme = { main: "#2563eb", soft: "#7db3ff" };
  const x = 640, y = 160, w = 470, h = 360;
  const spaces = [
    { c: "#60a5fa", w: 70, active: true },
    { c: "#a78bfa", w: 84 },
    { c: "#34d399", w: 62 },
  ];
  const art = `
  <!-- orbit ring behind -->
  <ellipse cx="875" cy="350" rx="300" ry="110" fill="none" stroke="${theme.soft}" stroke-opacity="0.4" stroke-width="2.5" transform="rotate(-14 875 350)"/>
  <circle cx="1155" cy="320" r="11" fill="#7dd3fc"/>
  ${windowChrome(x, y, w, h, "tctorbit.com")}
  <!-- sidebar -->
  <rect x="${x + 1}" y="${y + 49}" width="128" height="${h - 50}" fill="#000" fill-opacity="0.22"/>
  ${spaces
    .map(
      (s, i) => `
  ${s.active ? `<rect x="${x + 12}" y="${y + 66 + i * 40}" width="106" height="30" rx="8" fill="${theme.main}" fill-opacity="0.25"/>` : ""}
  <circle cx="${x + 28}" cy="${y + 81 + i * 40}" r="6" fill="${s.c}"/>
  ${bar(x + 42, y + 76 + i * 40, s.w, s.active ? 0.5 : 0.16)}`,
    )
    .join("")}
  ${[0, 1, 2, 3].map((i) => bar(x + 20, y + 200 + i * 28, 90 - i * 8, 0.08)).join("")}
  <!-- page -->
  ${bar(x + 156, y + 82, 190, 0.55, 16)}
  ${bar(x + 156, y + 116, 280, 0.12)}
  ${bar(x + 156, y + 138, 250, 0.12)}
  <rect x="${x + 156}" y="${y + 170}" width="290" height="150" rx="14" fill="${theme.main}" fill-opacity="0.18"/>
  <circle cx="${x + 300}" cy="${y + 245}" r="34" fill="${theme.soft}" fill-opacity="0.35"/>
  <circle cx="${x + 300}" cy="${y + 245}" r="12" fill="${theme.soft}"/>
  <!-- command bar -->
  <g filter="url(#shadow)">
    <rect x="600" y="540" width="440" height="72" rx="18" fill="#141c30" stroke="${theme.soft}" stroke-opacity="0.45"/>
  </g>
  <circle cx="638" cy="576" r="10" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="645" y1="583" x2="653" y2="591" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <text x="668" y="584" font-family="${FONT}" font-size="20" fill="#cbd5e1">Search tabs, run actions…</text>
  <rect x="938" y="558" width="82" height="36" rx="9" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.15"/>
  <text x="979" y="582" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#e2e8f0">Ctrl K</text>`;

  return frame({
    theme,
    category: "LAUNCH",
    headline: ["Meet Orbit."],
    sub: "The private, focused browser.",
    art,
  });
}

/* ------------------------------------------------------------------ */
/* 2. Privacy — your device, the only 3 connections, blocked telemetry */
/* ------------------------------------------------------------------ */

function privacy() {
  const theme = { main: "#7c3aed", soft: "#c4b5fd" };
  const dev = { x: 640, y: 280, s: 170 };
  const cx = dev.x + dev.s, cy = dev.y + dev.s / 2;
  const nodes = [
    { label: "Ad-block lists", ok: true },
    { label: "Your DNS provider", ok: true },
    { label: "Tor check (Tor mode)", ok: true },
    { label: "Analytics", ok: false },
    { label: "Telemetry", ok: false },
  ];
  const nx = 920, top = 150, gap = 98;
  const art = `
  ${nodes
    .map((n, i) => {
      const ny = top + i * gap + 28;
      const color = n.ok ? "#34d399" : "#f87171";
      const mid = (cx + nx) / 2;
      return `
  <path d="M ${cx} ${cy} C ${mid} ${cy}, ${mid} ${ny}, ${nx} ${ny}" fill="none" stroke="${color}" stroke-opacity="${n.ok ? 0.7 : 0.45}" stroke-width="2.5" ${n.ok ? "" : 'stroke-dasharray="7 8"'}/>
  ${n.ok ? "" : `<circle cx="${nx - 34}" cy="${ny}" r="14" fill="#1b0f14" stroke="#f87171"/>
  <path d="M ${nx - 40} ${ny - 6} l 12 12 m 0 -12 l -12 12" stroke="#f87171" stroke-width="2.5" stroke-linecap="round"/>`}
  <rect x="${nx}" y="${ny - 28}" width="230" height="56" rx="14" fill="${n.ok ? "#0f1f1c" : "#1b1016"}" stroke="${color}" stroke-opacity="${n.ok ? 0.5 : 0.35}"/>
  <circle cx="${nx + 26}" cy="${ny}" r="9" fill="${color}" fill-opacity="${n.ok ? 1 : 0.8}"/>
  <text x="${nx + 46}" y="${ny + 7}" font-family="${FONT}" font-size="18" font-weight="600" fill="${n.ok ? "#d1fae5" : "#fca5a5"}" ${n.ok ? "" : 'text-decoration="line-through"'}>${n.label}</text>`;
    })
    .join("")}
  <!-- device -->
  <g filter="url(#shadow)">
    <rect x="${dev.x}" y="${dev.y}" width="${dev.s}" height="${dev.s}" rx="32" fill="#151030" stroke="${theme.soft}" stroke-opacity="0.55" stroke-width="2"/>
  </g>
  <!-- lock -->
  <path d="M ${dev.x + 60} ${dev.y + 74} v -16 a 25 25 0 0 1 50 0 v 16" fill="none" stroke="${theme.soft}" stroke-width="8" stroke-linecap="round"/>
  <rect x="${dev.x + 46}" y="${dev.y + 72}" width="78" height="62" rx="12" fill="${theme.soft}"/>
  <circle cx="${dev.x + 85}" cy="${dev.y + 98}" r="8" fill="#151030"/>
  <rect x="${dev.x + 82}" y="${dev.y + 100}" width="6" height="18" rx="3" fill="#151030"/>
  <text x="${dev.x + dev.s / 2}" y="${dev.y + dev.s + 40}" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="600" fill="#e2e8f0">Your device</text>
  <text x="${dev.x + dev.s / 2}" y="${dev.y + dev.s + 66}" text-anchor="middle" font-family="${MONO}" font-size="15" fill="#94a3b8">local .json files</text>`;

  return frame({
    theme,
    category: "PRIVACY",
    headline: ["Your data.", "Your device."],
    sub: "Zero telemetry, by design.",
    art,
  });
}

/* ------------------------------------------------------------------ */
/* 3. Spaces & Split View — sidebar Spaces, split panes, Ctrl + \      */
/* ------------------------------------------------------------------ */

function spaces() {
  const theme = { main: "#059669", soft: "#6ee7b7" };
  const x = 620, y = 140, w = 510, h = 370;
  const list = [
    { name: "Work", c: "#60a5fa", active: true },
    { name: "Research", c: "#a78bfa" },
    { name: "Personal", c: "#34d399" },
  ];
  const paneY = y + 64, paneH = h - 80;
  const leftX = x + 150, leftW = 170, rightX = leftX + leftW + 16, rightW = x + w - 14 - rightX;
  const pane = (px: number, pw: number, accent: string) => `
  <rect x="${px}" y="${paneY}" width="${pw}" height="${paneH}" rx="12" fill="#ffffff" fill-opacity="0.035" stroke="#ffffff" stroke-opacity="0.07"/>
  ${bar(px + 16, paneY + 20, pw * 0.55, 0.5, 14)}
  ${bar(px + 16, paneY + 50, pw - 32)}
  ${bar(px + 16, paneY + 70, pw - 60)}
  ${bar(px + 16, paneY + 90, pw - 44)}
  <rect x="${px + 16}" y="${paneY + 120}" width="${pw - 32}" height="${paneH - 140}" rx="10" fill="${accent}" fill-opacity="0.16"/>`;

  const art = `
  ${windowChrome(x, y, w, h, "spaces / work")}
  <rect x="${x + 1}" y="${y + 49}" width="134" height="${h - 50}" fill="#000" fill-opacity="0.22"/>
  ${list
    .map(
      (s, i) => `
  ${s.active ? `<rect x="${x + 10}" y="${y + 64 + i * 46}" width="116" height="36" rx="9" fill="${theme.main}" fill-opacity="0.28"/>` : ""}
  <circle cx="${x + 28}" cy="${y + 82 + i * 46}" r="6" fill="${s.c}"/>
  <text x="${x + 44}" y="${y + 88 + i * 46}" font-family="${FONT}" font-size="16" font-weight="${s.active ? 700 : 500}" fill="${s.active ? "#ffffff" : "#94a3b8"}">${s.name}</text>`,
    )
    .join("")}
  ${[0, 1, 2].map((i) => bar(x + 22, y + 226 + i * 28, 88 - i * 12, 0.08)).join("")}
  ${pane(leftX, leftW, "#60a5fa")}
  ${pane(rightX, rightW, theme.soft)}
  <!-- divider handle -->
  <rect x="${leftX + leftW + 4}" y="${paneY + paneH / 2 - 30}" width="8" height="60" rx="4" fill="${theme.soft}"/>
  <!-- shortcut -->
  ${keycap(700, 552, "Ctrl", 86)}
  <text x="804" y="588" font-family="${FONT}" font-size="26" font-weight="700" fill="#64748b">+</text>
  ${keycap(832, 552, "\\", 60)}
  <text x="914" y="586" font-family="${FONT}" font-size="20" font-weight="600" fill="#cbd5e1">Split View</text>`;

  return frame({
    theme,
    category: "GUIDE",
    headline: ["Spaces +", "Split View."],
    sub: "A practical guide, with shortcuts.",
    art,
  });
}

/* ------------------------------------------------------------------ */
/* Light variants: same artwork, dark palette swapped for a light one. */
/* The site shows blog-*-light.png in light mode, blog-*.png in dark.  */
/* ------------------------------------------------------------------ */

// Exact dark → light color swaps (backgrounds, surfaces, text).
// Order matters: original whites become ink FIRST, so surfaces swapped to white below stay white.
const LIGHT_SWAPS: Array<[RegExp, string]> = [
  // White strokes/fills at low opacity are "lines and bars on dark": make them ink on light.
  [/(fill|stroke|stop-color)="#ffffff"/g, '$1="#0f172a"'],
  // Black overlays (sidebar tint, keycap shadow) are far too heavy on light.
  [/fill="#000" fill-opacity="0\.22"/g, 'fill="#0f172a" fill-opacity="0.035"'],
  [/fill="#000" fill-opacity="0\.5"/g, 'fill="#0f172a" fill-opacity="0.12"'],
  [/flood-color="#000" flood-opacity="0\.55"/g, 'flood-color="#0f172a" flood-opacity="0.16"'],
  [/#05070d/g, "#f8fafc"], // page background / left fade
  [/#0b1222/g, "#e9eef6"], // background gradient end
  [/#121a2e/g, "#ffffff"], // window gradient
  [/#0b1120/g, "#f3f6fa"],
  [/#141c30/g, "#ffffff"], // command bar
  [/#1a2338/g, "#ffffff"], // keycaps
  [/#151030/g, "#f1ecff"], // privacy device
  [/#0f1f1c/g, "#ecfdf5"], // allowed connection card
  [/#1b1016/g, "#fef2f2"], // blocked connection card
  [/#1b0f14/g, "#fef2f2"],
  [/#d1fae5/g, "#065f46"], // allowed label text
  [/#fca5a5/g, "#b91c1c"], // blocked label text
  [/#f87171/g, "#dc2626"],
  [/#34d399/g, "#059669"],
  [/#e2e8f0/g, "#0f172a"], // primary text
  [/#cbd5e1/g, "#334155"],
  [/#94a3b8/g, "#475569"],
  [/#7dd3fc/g, "#0284c7"],
];

/** Light theme accents: the pale "soft" tints read poorly on white, so use the strong tone for text. */
const SOFT_TO_MAIN: Record<string, string> = { "#7db3ff": "#2563eb", "#c4b5fd": "#7c3aed", "#6ee7b7": "#059669" };

function toLight(svg: string) {
  let out = svg;
  for (const [from, to] of LIGHT_SWAPS) out = out.replace(from, to);
  // Category label text + Split View divider: swap pale accent for the strong one.
  for (const [soft, main] of Object.entries(SOFT_TO_MAIN)) {
    out = out.replace(new RegExp(`letter-spacing="2" fill="${soft}"`, "g"), `letter-spacing="2" fill="${main}"`);
  }
  return out;
}

const covers = [
  { name: "blog-introducing", svg: introducing() },
  { name: "blog-privacy", svg: privacy() },
  { name: "blog-spaces", svg: spaces() },
];

async function render(svg: string, file: string, background: string) {
  const info = await sharp(Buffer.from(svg))
    .flatten({ background }) // opaque: no alpha channel needed
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(outDir, file));
  console.log(`${file}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const c of covers) {
    await render(c.svg, `${c.name}.png`, "#05070d");
    await render(toLight(c.svg), `${c.name}-light.png`, "#f8fafc");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
