import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

// Note: crawlers only read robots.txt at a domain root. On a GitHub Pages
// project site (/portfolio) this file is informational until the site is
// served from its own domain.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
