import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/app/data/projects";
import EmptyState from "@/app/components/content/EmptyState";
import ProjectCard from "@/app/components/projects/ProjectCard";
import SectionHeading from "@/app/components/ui/SectionHeading";
import styles from "./HomePortfolio.module.css";

type HomePortfolioProps = {
  projects: readonly Project[];
};

export default function HomePortfolio({ projects }: HomePortfolioProps) {
  return (
    <section
      className={`section ${styles.section}`}
      id="projects"
      aria-labelledby="home-portfolio-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Our Portfolio"
          title="Projects That Reflect Our Expertise."
          id="home-portfolio-title"
          description="Explore our project portfolio to understand our approach to engineering, architecture and project development. Each project represents its own requirements, design considerations and technical challenges."
        />

        {projects.length > 0 ? (
          <div className={styles.grid}>
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects to display"
            description="No project entries are currently available."
          />
        )}
        <div className={styles.allProjects}>
          <Link className="button button--secondary" href="/projects">
            View all projects <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
