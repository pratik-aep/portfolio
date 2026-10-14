import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";

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
