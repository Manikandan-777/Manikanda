import { ImageResponse } from "next/og";

import { profile, settings } from "@/lib/content";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Generated Open Graph / Twitter card image. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#f6f3ee",
          color: "#221f1b",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: settings.theme.accent,
            }}
          />
          <div style={{ fontSize: 26, letterSpacing: 2, textTransform: "uppercase" }}>
            {profile.location || "Portfolio"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1.05 }}>{profile.name}</div>
          <div style={{ fontSize: 40, color: "#625b50" }}>{profile.title}</div>
        </div>

        <div style={{ fontSize: 28, color: settings.theme.accent }}>
          {settings.siteUrl.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
