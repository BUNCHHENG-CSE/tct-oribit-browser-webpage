// Lightweight crypto token validation compatible with Edge Middleware and Node runtime

const COOKIE_NAME = "orbit_sec_token";

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string comparison (works in Edge and Node runtimes). */
export function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createEdgeSessionToken(secret: string): Promise<string> {
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const enc = new TextEncoder();
  const key = await getKey(secret);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const signature = bufferToHex(signatureBuffer);
  const payloadB64 = btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${payloadB64}.${signature}`;
}

export async function verifyEdgeSessionToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  try {
    // decode base64url
    let base64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const payloadStr = atob(base64);
    const enc = new TextEncoder();
    const key = await getKey(secret);
    const expectedBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadStr));
    const expectedSig = bufferToHex(expectedBuffer);

    if (!timingSafeEqualStr(signature, expectedSig)) return false;

    const parsed = JSON.parse(payloadStr);
    if (!parsed.exp || Date.now() > parsed.exp) return false;
    return parsed.role === "admin";
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
