import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// Share-image renderer used by the opengraph-image / twitter-image routes.
// Runs at build time only (static export), reading fonts from node_modules
// so nothing is fetched over the network.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Satori takes plain colour values; these mirror styles/tokens.css.
const C = {
  bg: "#ffffff",
  ink: "#111111",
  text: "#666666",
  muted: "#929292",
  line: "#e8e8e8",
  accent: "#2f6b61",
};

const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

async function fonts() {
  const [regular, bold, mono] = await Promise.all([
    fontFile("inter", "inter-latin-400-normal.woff"),
    fontFile("inter", "inter-latin-700-normal.woff"),
    fontFile("jetbrains-mono", "jetbrains-mono-latin-500-normal.woff"),
  ]);
  return [
    { name: "Inter", data: regular, weight: 400 as const },
    { name: "Inter", data: bold, weight: 700 as const },
    { name: "Mono", data: mono, weight: 500 as const },
  ];
}

/** Reads a file from public/ as a data URI (e.g. a project preview SVG). */
export async function publicDataUri(path: string) {
  const file = await readFile(join(process.cwd(), "public", path));
  return `data:image/svg+xml;base64,${file.toString("base64")}`;
}

export async function renderOgImage({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.bg,
          fontFamily: "Inter",
          padding: 64,
          gap: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: -3,
                color: C.ink,
              }}
            >
              {site.name}
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                marginLeft: 5,
                borderRadius: 8,
                background: C.accent,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Mono",
                fontSize: 20,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.accent,
              }}
            >
              {eyebrow}
            </span>
            <span
              style={{
                marginTop: 20,
                fontSize: image ? 64 : 84,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: image ? -3 : -4.5,
                color: C.ink,
              }}
            >
              {title}
            </span>
            {description && (
              <span
                style={{
                  marginTop: 24,
                  fontSize: 26,
                  lineHeight: 1.45,
                  color: C.text,
                }}
              >
                {description}
              </span>
            )}
          </div>
          <span
            style={{
              fontFamily: "Mono",
              fontSize: 18,
              color: C.muted,
            }}
          >
            {site.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
        {image && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: 520,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              width={520}
              height={325}
              alt=""
              style={{
                borderRadius: 16,
                border: `1px solid ${C.line}`,
                boxShadow: "0 24px 60px rgba(0,0,0,0.14)",
              }}
            />
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
