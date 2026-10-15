import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/projects/"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/contact/"), changeFrequency: "yearly", priority: 0.6 },
    ...projects.map((p) => ({
      url: url(`/projects/${p.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
