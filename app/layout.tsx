import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";
import { Navbar, Footer } from "@/components/Layout";
export const metadata: Metadata = {
  title: {
    default: "forgeD — Digital products, thoughtfully built.",
    template: "%s — forgeD",
  },
  description:
    "Websites, applications, AI-powered solutions, and custom digital products. Explore the work of forgeD.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
