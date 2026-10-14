import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
export const metadata: Metadata = { title: "Projects" };
export default function ProjectsPage() {
  return (
    <main id="main" className="projects-page container">
      <div className="page-heading">
        <span className="eyebrow">THE PORTFOLIO</span>
        <h1>
          Different challenges.
          <br />
          <span className="muted">Thoughtful solutions.</span>
        </h1>
        <p>
          A closer look at the worlds we work in. Data, intelligence,
          <br className="desktop-break" /> and immersive experiences — brought
          into focus.
        </p>
      </div>
      <div className="project-grid collection-grid">
        {projects.map((p, i) => (
          <ProjectCard project={p} index={i} key={p.slug} />
        ))}
      </div>
      <div className="collection-end">
        <p>Your idea could be next.</p>
        <Link href="/#contact" className="button">
          Let&apos;s talk about it <ArrowUpRight size={17} />
        </Link>
      </div>
    </main>
  );
}
