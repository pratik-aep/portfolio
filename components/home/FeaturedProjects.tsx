import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function FeaturedProjects() {
  return (
    <section className="featured container" id="work">
      <Reveal className="section-heading">
        <span className="eyebrow">Featured work</span>
        <h2>
          Selected projects.
          <br /> Real solutions.
        </h2>
        <p>
          A selection of applications and platforms we&apos;ve built, combining
          modern technology with thoughtful design.
        </p>
      </Reveal>
      <div className="project-grid">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
      <Reveal className="featured-action">
        <Link className="button button-lg" href="/projects/">
          View All Projects <ArrowRight size={18} />
        </Link>
      </Reveal>
    </section>
  );
}
