import { projects } from "@/data/projects";
import { publicDataUri, renderOgImage } from "@/lib/og-image";

// Share images, rendered once at build time to out/og/<name>.png. The
// ".png" lives in the route param so GitHub Pages serves an image MIME
// type (file-based opengraph-image routes export without an extension).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { image: "default.png" },
    ...projects.map((p) => ({ image: `${p.slug}.png` })),
  ];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ image: string }> },
) {
  const { image } = await params;
  const project = projects.find((p) => `${p.slug}.png` === image);
  if (!project)
    return renderOgImage({
      eyebrow: "Built to make an impact",
      title: "Engineering what's next.",
      description:
        "We design and build websites, applications, and intelligent digital experiences.",
    });
  // `image` carries the deploy base path; strip it to read from public/.
  const file = project.image.slice(project.image.indexOf("/previews/"));
  return renderOgImage({
    eyebrow: project.category,
    title: project.title,
    description: project.short,
    image: await publicDataUri(file),
  });
}
