import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "./Motion";
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Reveal>
      <Link href={`/projects/${project.slug}/`} className="project-card">
        <div className="project-image">
          <Image
            src={project.image}
            alt={`Illustrative interface for ${project.title}`}
            width={1200}
            height={750}
          />
          <span className="preview-note">Concept preview</span>
          <span className="image-arrow">
            <ArrowUpRight size={21} />
          </span>
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span>0{index + 1}</span>
            <span>{project.category}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="card-bottom">
            <div className="tags">
              {project.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <ArrowUpRight size={17} />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
export function FeaturedProjects() {
  return (
    <section className="featured container" id="work">
      <Reveal className="section-heading">
        <span className="eyebrow">FEATURED WORK</span>
        <h2>
          Selected projects.
          <br className="mobile-break" /> Real solutions.
        </h2>
        <p>
          A selection of the applications and platforms we&apos;ve built,
          <br className="desktop-break" /> combining modern technology with
          thoughtful design.
        </p>
      </Reveal>
      <div className="project-grid">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
      <Reveal className="featured-action">
        <Link className="button" href="/projects/">
          View All Projects <ArrowRight size={17} />
        </Link>
        <span>Four different challenges. One thoughtful approach.</span>
      </Reveal>
    </section>
  );
}
