import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return { title: p?.title || "Project" };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const next =
    projects[
      (projects.findIndex((x) => x.slug === slug) + 1) % projects.length
    ];
  return (
    <main id="main" className="detail-page container">
      <Link href="/projects/" className="text-link back-link">
        <ArrowLeft size={16} /> All projects
      </Link>
      <div className="detail-heading">
        <span className="eyebrow">{p.category}</span>
        <h1>{p.title}</h1>
        <p>{p.short}</p>
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      <div className="detail-preview">
        <Image
          src={p.image}
          alt={`Illustrative ${p.title} application interface`}
          width={1200}
          height={750}
          priority
        />
      </div>
      <div className="detail-description">
        <div>
          <span className="eyebrow">THE IDEA</span>
          <h2>
            Complexity,
            <br />
            brought into focus.
          </h2>
        </div>
        <div>
          <p>{p.description}</p>
          <ul>
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="asset-disclosure">
            This is an illustrative interface based on the supplied project
            brief. Original project screenshots and technical details are
            awaiting confirmation.
          </div>
        </div>
      </div>
      <div className="next-project">
        <div>
          <span className="eyebrow">UP NEXT</span>
          <h3>{next.title}</h3>
        </div>
        <Link className="button" href={`/projects/${next.slug}/`}>
          Explore project <ArrowUpRight size={17} />
        </Link>
      </div>
    </main>
  );
}
