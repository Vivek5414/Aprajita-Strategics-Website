import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EnquiryTrigger from "@/app/components/enquiry/EnquiryTrigger";
import { projects } from "@/app/data/projects";
import styles from "./ProjectDetail.module.css";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.image.src],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <article className={styles.project}>
      <div className="container">
        <Link className={styles.backLink} href="/projects">
          <ArrowLeft size={17} aria-hidden="true" />
          All projects
        </Link>
        <header className={styles.header}>
          <p className={styles.category}>{project.sector}</p>
          <h1>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>
        </header>

        <figure className={styles.heroImage}>
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            priority
            sizes="(max-width: 64rem) 100vw, 80rem"
            style={{ objectPosition: project.image.objectPosition }}
          />
        </figure>

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
          {project.duration ? (
            <div>
              <dt>Duration</dt>
              <dd>{project.duration}</dd>
            </div>
          ) : null}
        </dl>

        <section className={styles.details}>
          <div>
            <p className={styles.detailsEyebrow}>Project Information</p>
            <h2>Key Features</h2>
          </div>
          <ul>
            {project.keyFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className={styles.cta}>
          <div>
            <h2>Have a project with similar requirements?</h2>
            <p>
              Let&apos;s discuss how we can support your project objectives.
            </p>
          </div>
          <EnquiryTrigger className="button button--primary">
            Discuss Your Project <ArrowRight size={17} aria-hidden="true" />
          </EnquiryTrigger>
        </section>
      </div>
    </article>
  );
}
