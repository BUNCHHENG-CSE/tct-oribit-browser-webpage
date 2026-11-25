const BASE = "http://localhost:3000";

interface TestRoute {
  path: string;
  expectedStatus: number;
  expectedLocation?: string;
  description: string;
}

const TESTS: TestRoute[] = [
  // Public marketing pages
  { path: "/", expectedStatus: 200, description: "Home page" },
  { path: "/features", expectedStatus: 200, description: "Features deep-dive" },
  { path: "/privacy-features", expectedStatus: 200, description: "Privacy architecture" },
  { path: "/download", expectedStatus: 200, description: "Download hub" },
  { path: "/channels", expectedStatus: 200, description: "Release channels" },
  { path: "/changelog", expectedStatus: 200, description: "Changelog" },
  { path: "/blog", expectedStatus: 200, description: "Blog index" },
  { path: "/blog/introducing-tct-orbit", expectedStatus: 200, description: "Blog post page" },
  { path: "/support", expectedStatus: 200, description: "Support & FAQs" },
  { path: "/privacy-policy", expectedStatus: 200, description: "Privacy policy legal" },
  { path: "/terms", expectedStatus: 200, description: "Terms of service" },

  // SEO & Icons
  { path: "/robots.txt", expectedStatus: 200, description: "Robots.txt" },
  { path: "/sitemap.xml", expectedStatus: 200, description: "Sitemap XML" },
  { path: "/icon.png", expectedStatus: 200, description: "Browser icon 32x32" },
  { path: "/apple-icon.png", expectedStatus: 200, description: "Apple touch icon 180x180" },

  // Error Pages (404 and 401)
  { path: "/404", expectedStatus: 404, description: "Custom 404 Lost in Orbit page" },
  { path: "/401", expectedStatus: 200, description: "Custom 401 Restricted Sector page" },
  { path: "/non-existent-random-page-12345", expectedStatus: 404, description: "Dynamic 404 Not Found response" },

  // Security honeypots (probed paths return 404)
  { path: "/admin", expectedStatus: 404, description: "Honeypot /admin -> 404" },
  { path: "/dashboard", expectedStatus: 404, description: "Honeypot /dashboard -> 404" },
  { path: "/wp-admin", expectedStatus: 404, description: "Honeypot /wp-admin -> 404" },

  // Stealth admin route (unauthenticated redirects to login)
  { path: "/orbit-mission-ctrl-8x92", expectedStatus: 307, description: "Stealth admin root -> redirect login" },
  { path: "/orbit-mission-ctrl-8x92/login", expectedStatus: 200, description: "Stealth admin login page" },

  // Protected API endpoint (honeypots unauthenticated calls to 404)
  { path: "/api/admin/export-subscribers", expectedStatus: 404, description: "Export subscribers unauth -> 404 honeypot" },

  // Download redirects
  { path: "/api/download/non-existent-uuid", expectedStatus: 302, description: "Invalid asset download -> redirect /download" },
  { path: "/api/download/cmwssg9ok0001n4vj93gyityx", expectedStatus: 302, description: "Valid asset download -> redirect to BUNCHHENG-CSE repo" },
];

async function run() {
  console.log("=== Running Comprehensive Production Endpoint Verification ===\n");
  let passed = 0;
  let failed = 0;

  for (const t of TESTS) {
    try {
      const res = await fetch(`${BASE}${t.path}`, {
        redirect: "manual",
      });

      const statusMatch = res.status === t.expectedStatus;
      if (statusMatch) {
        console.log(`[PASS] ${res.status} | ${t.path} (${t.description})`);
        passed++;
      } else {
        console.error(`[FAIL] ${res.status} (expected ${t.expectedStatus}) | ${t.path} (${t.description})`);
        failed++;
      }
    } catch (err: any) {
      console.error(`[ERROR] ${t.path}:`, err.message);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} PASSED, ${failed} FAILED (Total: ${TESTS.length})`);
  if (failed > 0) {
    process.exit(1);
  }
}

run();
