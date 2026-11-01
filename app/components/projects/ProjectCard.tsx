import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/app/data/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const projectUrl = `/projects/${project.slug}`;

  return (
    <article className={styles.card}>
      <Link
        className={styles.image}
        href={projectUrl}
        aria-label={`View ${project.title} project`}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="(max-width: 36rem) 100vw, 50vw"
          style={{ objectPosition: project.image.objectPosition }}
        />
        <span className={styles.imageArrow} aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
      </Link>

      <div className={styles.content}>
        <p className={styles.category}>{project.sector}</p>
        <h3 className={styles.title}>
          <Link href={projectUrl}>{project.title}</Link>
        </h3>
        <p className={styles.summary}>{project.summary}</p>

        <dl className={styles.metadata}>
          {project.location ? (
            <div>
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
          ) : null}
          {project.completionYear ? (
            <div>
              <dt>Year</dt>
              <dd>{project.completionYear}</dd>
            </div>
          ) : null}
        </dl>

        <Link className={styles.viewProject} href={projectUrl}>
          <span>View Project</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
