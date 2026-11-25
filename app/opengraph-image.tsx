import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const alt = "TCT Orbit — Browse in Orbit. Focused, Fast, Private.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#070a13",
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 30%, transparent 65%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Official Logo Graphic */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoBase64}
            alt="TCT Orbit"
            width={104}
            height={104}
            style={{
              filter: "drop-shadow(0 0 25px rgba(59, 130, 246, 0.6))",
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textAlign: "center",
            background: "linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "16px",
          }}
        >
          TCT Orbit
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
            marginBottom: "36px",
          }}
        >
          Browse in orbit. Focused, fast, private.
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["Chromium 156", "Zero Telemetry", "Local Data Only", "Windows • macOS • Linux"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#cbd5e1",
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
