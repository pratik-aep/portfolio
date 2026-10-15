import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { activeSocials, shareMetadata, site } from "@/data/site";
import { asset } from "@/lib/asset";

const title = `${site.name} — Engineering what's next`;

// Defaults for any route that doesn't set its own (e.g. the 404 page).
export const metadata: Metadata = {
  metadataBase: new URL(`${site.url}/`),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  icons: { icon: asset("/favicon.svg") },
  ...shareMetadata({ path: "/", title }),
  alternates: undefined,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Structured data. `sameAs` lists only the profiles actually configured.
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: `${site.url}/`,
  description: site.description,
  logo: `${site.url}/favicon.svg`,
  ...(site.email && { email: site.email }),
  sameAs: activeSocials()
    .filter((s) => s.key !== "email")
    .map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          // Static, build-time JSON; no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
