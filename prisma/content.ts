/**
 * Canonical site content stored in the database (release notes, blog posts, FAQs).
 * Used by both `prisma/seed.ts` (fresh databases) and `scripts/fix-content.ts`
 * (updating an existing database without wiping it).
 *
 * Facts here must match the shipped browser (v0.1.2): Chromium 156 / Electron 45.3.4,
 * free (proprietary, source not public), local JSON storage, Ghostery ad & tracker lists, CI builds for
 * Windows x64, macOS Apple Silicon, Linux x64 (AppImage + .deb).
 */

const RELEASE_BASE = "https://github.com/BUNCHHENG-CSE/tct-orbit-browser/releases/download/v0.1.2";

export const STABLE_RELEASE = {
  version: "v0.1.2",
  channel: "STABLE" as const,
  title: "TCT Orbit v0.1.2 — YouTube scrolling, faster Split View, better dark mode",
  notes: `### What's new in v0.1.2
- **YouTube scrolling fix**: Pages on YouTube scroll smoothly again.
- **Split View performance**: Faster, smoother Split View.
- **Dark-mode contrast**: Improved text and UI contrast in dark mode.
- **CI builds**: Installers for Windows (x64), macOS (Apple Silicon) and Linux (x64 AppImage and .deb) are now built by GitHub Actions.

### Good to know
- Engine: Chromium 156 (Electron 45.3.4).
- There is no auto-update yet. Download new versions from this site.
- Builds are not code-signed or notarized yet.`,
  publishedAt: new Date("2026-11-15T10:00:00Z"),
  // Only the platforms CI actually builds. Checksums and sizes are left empty
  // here on purpose: run "Sync GitHub Actions" in /admin/releases to pull the real
  // values from the GitHub release (sha256sums.txt / asset digests).
  assets: [
    { platform: "WINDOWS" as const, arch: "x64", fileType: "exe", fileUrl: `${RELEASE_BASE}/TCT-Orbit-Setup-0.1.2-x64.exe` },
    { platform: "MACOS" as const, arch: "arm64", fileType: "dmg", fileUrl: `${RELEASE_BASE}/TCT-Orbit-0.1.2-arm64.dmg` },
    { platform: "LINUX" as const, arch: "x64", fileType: "AppImage", fileUrl: `${RELEASE_BASE}/TCT-Orbit-0.1.2-x86_64.AppImage` },
    { platform: "LINUX" as const, arch: "x64", fileType: "deb", fileUrl: `${RELEASE_BASE}/tct-orbit_0.1.2_amd64.deb` },
  ],
};

const AUTHOR = "The Capy Team";

export const POSTS = [
  {
    slug: "introducing-tct-orbit",
    title: "Introducing TCT Orbit: the private, focused browser",
    excerpt:
      "TCT Orbit is a free Chromium browser with vertical tabs, Spaces, Split View and built-in ad blocking. Zero telemetry; your data stays local.",
    coverImage: "/screenshots/blog-introducing.png",
    author: AUTHOR,
    tags: ["Launch", "Product", "Privacy"],
    published: true,
    publishedAt: new Date("2026-11-15T09:00:00Z"),
    content: `Most browsers today ask you to accept telemetry, sponsored content and a tab strip that runs off the edge of the screen. We wanted something calmer: a browser that keeps your data on your machine and gets out of your way. That's **TCT Orbit**.

## What TCT Orbit is

- A desktop browser for **Windows, macOS and Linux**, built on **Chromium 156** (Electron 45.3.4), so modern websites just work.
- **Free forever**: no account, no ads, no subscription. Made by The Capy Team.
- **Zero telemetry.** Your history, bookmarks and notes are saved as local JSON files on your device.

## Built for focus

- **Vertical sidebar and Spaces:** keep Work, Research and Personal tabs apart. Hide the sidebar with \`Ctrl/Cmd+S\`.
- **Command Bar:** press \`Ctrl/Cmd+K\` to open a URL, jump to a tab or run an action.
- **Split View:** two tabs side by side with \`Ctrl/Cmd+\\\`.
- **Zen and Reader modes:** \`F11\` hides the browser UI, and \`F9\` turns articles into clean text.
- **Space notes and Pomodoro:** notes for each Space (\`Ctrl/Cmd+Shift+N\`) and a 25/5 focus timer with rain, white-noise and café soundscapes.

See them all on the [features page](/features).

## Private by default

Orbit's Privacy Shield is on from the first launch:

- Ad and tracker blocking with the **Ghostery ad & tracker lists**
- Canvas, WebGL and audio **fingerprint noise**
- **HTTPS-Only** and **DNS-over-HTTPS** (Mullvad, Cloudflare, Quad9 or AdGuard)
- **Third-party cookie blocking** and tracking-parameter stripping

Read how it works on the [privacy page](/privacy-features).

## What's not there yet

We'd rather tell you up front:

- No Chrome extension support yet.
- No auto-update yet. Check the [changelog](/changelog) for new versions.
- Builds aren't code-signed or notarized yet.

## Try it

[Download TCT Orbit v0.1.2](/download) for Windows 10/11 (x64), macOS 10.15+ (Apple Silicon) or Linux (x64), and see how browsing feels when your software respects your attention.`,
  },
  {
    slug: "why-we-store-everything-locally",
    title: "Why TCT Orbit stores everything locally",
    excerpt:
      "Where TCT Orbit keeps your history, bookmarks and notes, what its Privacy Shield blocks, and the only three network connections the browser makes on its own.",
    coverImage: "/screenshots/blog-privacy.png",
    author: AUTHOR,
    tags: ["Privacy", "Security", "Engineering"],
    published: true,
    publishedAt: new Date("2026-11-18T11:00:00Z"),
    content: `Timing patterns, screen sizes and DNS lookups can re-identify people even in "anonymized" data. So instead of promising to handle your data carefully, Orbit doesn't collect it at all.

## Where your data lives

Everything Orbit knows about you stays in local files on your own device.

| Data | Typical browser | TCT Orbit |
| :--- | :--- | :--- |
| History | Vendor sync servers | Local JSON files |
| Spaces and bookmarks | Cloud profile | Local JSON files |
| Notes | Cloud service | Local JSON files |
| Cookies | Local | Local, encrypted on disk |
| Sync | Vendor servers | Optional encrypted file in your own OneDrive, Dropbox or iCloud |

There's no Orbit account and no Orbit server, so there's nothing for us to leak, sell or hand over.

## What the Privacy Shield blocks

- **Ads and trackers**, using the Ghostery ad & tracker lists
- **Cookie banners** and hyperlink-auditing **pings**
- **Third-party cookies** and tracking parameters in URLs (like \`utm_source\` and \`fbclid\`)
- **Fingerprinting**: canvas, WebGL and audio readings get small amounts of noise
- **Insecure connections**: HTTPS-Only mode, plus DNS-over-HTTPS (Mullvad, Cloudflare, Quad9 or AdGuard)
- **IP leaks** through WebRTC

It also sends **Global Privacy Control**, uses a strict referrer policy, supports proxies (including Tor), and can clear the cache on exit.

## Hardening the app itself

- Web pages run in sandboxed, isolated windows.
- Orbit only runs its own bundled code, with tamper checks.
- Debug launch options are disabled.
- The User-Agent has no Electron signature, so you look like any other Chromium user.

## The only connections Orbit makes on its own

Apart from the sites you visit, the browser connects to just three things:

1. **Ghostery list servers**, to download the ad-blocker lists.
2. **Your DNS-over-HTTPS provider**, the one you picked.
3. **A Tor check**, only when Tor mode is on.

None of them carry analytics or usage data. Orbit is MIT-licensed, so you can check all of this in the source.

See the full breakdown on the [privacy page](/privacy-features), or [download Orbit](/download) and try it yourself.`,
  },
  {
    slug: "mastering-spaces-and-split-view",
    title: "How to use Spaces and Split View in TCT Orbit",
    excerpt:
      "A practical guide to Spaces, Split View, Space notes and the Command Bar in TCT Orbit, with the keyboard shortcuts that make each one fast.",
    coverImage: "/screenshots/blog-spaces.png",
    author: AUTHOR,
    tags: ["Productivity", "Guide"],
    published: true,
    publishedAt: new Date("2026-11-21T15:20:00Z"),
    content: `When invoices, docs, design files and holiday plans all share one tab strip, every task switch costs attention. Spaces and Split View give each task its own room. Here's how to get the most out of them.

## 1. Organize tabs with Spaces

A Space is a separate set of tabs in the vertical sidebar. A simple setup:

- **Work:** docs, issue trackers, pull requests
- **Research:** papers and reading lists
- **Personal:** music, news, banking

Switch Spaces from the sidebar or from the Command Bar (\`Ctrl/Cmd+K\`). Need more width? \`Ctrl/Cmd+S\` hides the sidebar.

## 2. Compare pages with Split View

Press \`Ctrl/Cmd+\\\` to show two tabs side by side, then drag the divider to resize. It's ideal for comparing an API response with its docs, or writing while you read. Split View got noticeably faster in v0.1.2.

## 3. Capture ideas with Space notes

Press \`Ctrl/Cmd+Shift+N\` to open notes for the current Space. Notes are saved locally on your device, right next to the tabs they're about.

## 4. Find any tab in seconds

- \`Ctrl/Cmd+Shift+A\` searches every open tab.
- **Tab Tidy** cleans up a crowded sidebar.
- **Task Manager** (\`Shift+Esc\`) shows which tabs are using memory and CPU.

## 5. Stay in the zone

- \`F11\` for Zen Mode, \`F9\` for Reader Mode.
- Start a 25/5 Pomodoro timer with rain, white-noise or café sounds.

## Cheat sheet

| Action | Shortcut |
| :--- | :--- |
| Command Bar | \`Ctrl/Cmd+K\` |
| Toggle sidebar | \`Ctrl/Cmd+S\` |
| Split View | \`Ctrl/Cmd+\\\` |
| Space notes | \`Ctrl/Cmd+Shift+N\` |
| Search all tabs | \`Ctrl/Cmd+Shift+A\` |
| Zen / Reader | \`F11\` / \`F9\` |

Press \`Ctrl/Cmd+/\` (or \`?\`) in Orbit for the full list, or see every shortcut on the [features page](/features#keyboard).`,
  },
];

export const FAQS = [
  {
    category: "General",
    question: "What makes TCT Orbit different from Chrome, Edge and Brave?",
    answer:
      "Orbit is built for focus and privacy. It sends zero telemetry, has no sponsored feeds, crypto or rewards programs, and keeps your data in local files on your device. It adds a vertical sidebar with Spaces, Split View, Zen and Reader modes, Space notes and a Pomodoro timer.",
    order: 1,
  },
  {
    category: "General",
    question: "Is TCT Orbit built on Chromium?",
    answer:
      "Yes. Orbit v0.1.2 is built on Electron 45.3.4 with Chromium 156, so modern websites work as expected. Chrome extensions are not supported yet.",
    order: 2,
  },
  {
    category: "General",
    question: "Is TCT Orbit free?",
    answer:
      "Yes. TCT Orbit is completely free, with no account, ads or subscription. It is developed by The Capy Team (TCT).",
    order: 3,
  },
  {
    category: "Privacy",
    question: "Does TCT Orbit collect any telemetry or browsing history?",
    answer:
      "No. Orbit has no analytics, crash-report or telemetry endpoints. History, bookmarks, Spaces, notes and settings are stored as local JSON files on your device, and cookies are encrypted on disk. The only connections the browser makes on its own are ad-blocker list downloads, your chosen DNS-over-HTTPS provider, and a Tor check when Tor mode is on.",
    order: 4,
  },
  {
    category: "Privacy",
    question: "What does the Privacy Shield block?",
    answer:
      "Ads and trackers (using the Ghostery ad & tracker lists), third-party cookies, cookie banners, hyperlink pings and URL tracking parameters. It also adds noise to canvas, WebGL and audio fingerprinting, enforces HTTPS-Only, supports DNS-over-HTTPS (Mullvad, Cloudflare, Quad9, AdGuard), protects against WebRTC leaks, sends Global Privacy Control, uses a strict referrer policy, and can clear the cache on exit. Proxies, including Tor, are supported.",
    order: 5,
  },
  {
    category: "Features",
    question: "Can I import my bookmarks and history from other browsers?",
    answer:
      "Yes. Orbit imports bookmarks and history from Chrome, Edge, Brave, Vivaldi, Opera and Firefox, and bookmarks from an HTML bookmarks file. Passwords are not imported.",
    order: 6,
  },
  {
    category: "Features",
    question: "Can I run Chrome extensions in TCT Orbit?",
    answer: "Not yet. Extensions are not supported in the current version.",
    order: 7,
  },
  {
    category: "Features",
    question: "How do Spaces differ from tab groups?",
    answer:
      "Tab groups add colored labels to one crowded tab strip. In Orbit, each Space is its own workspace in the vertical sidebar, with its own tabs and notes, so work and personal browsing stay apart.",
    order: 8,
  },
  {
    category: "Sync & Data",
    question: "How does sync work without a cloud server?",
    answer:
      "Orbit can save an encrypted backup file to a folder you already sync, such as OneDrive, Dropbox or iCloud. Your other devices read that file. There is no Orbit server, and we never see your data.",
    order: 9,
  },
  {
    category: "General",
    question: "Which operating systems are supported?",
    answer:
      "Windows 10/11 (x64), macOS 10.15 or newer on Apple Silicon, and Linux x64 (AppImage and .deb). There are no Windows ARM64 or Intel Mac builds yet.",
    order: 10,
  },
  {
    category: "General",
    question: "Does Orbit update itself?",
    answer:
      "Not yet. Auto-update isn't available, so download new versions from the Download page. The changelog lists every release.",
    order: 11,
  },
];
