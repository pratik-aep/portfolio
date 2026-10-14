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
