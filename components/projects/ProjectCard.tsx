import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/motion/Reveal";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Reveal className="project-card-wrap">
      <Link
        href={`/projects/${project.slug}/`}
        className="project-card"
        aria-label={`${project.title}: view project`}
      >
        <div className="project-media">
          <Image
            src={project.image}
            alt={`Illustrative interface for ${project.title}`}
            width={1200}
            height={750}
            sizes="(max-width: 767px) 100vw, (max-width: 1320px) 50vw, 640px"
          />
          <span className="preview-note">Concept preview</span>
        </div>
        <div className="project-body">
          <div className="project-meta">
            <span>
              {String(index + 1).padStart(2, "0")} · {project.category}
            </span>
            <span className="project-arrow" aria-hidden>
              <ArrowUpRight size={18} strokeWidth={1.75} />
            </span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <ul className="tags" aria-label="Technologies">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </Link>
    </Reveal>
  );
}
