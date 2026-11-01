"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/app/data/projects";
import EmptyState from "@/app/components/content/EmptyState";
import ProjectCard from "@/app/components/projects/ProjectCard";
import styles from "./ProjectCatalogue.module.css";

type ProjectCatalogueProps = {
  projects: readonly Project[];
};

const allProjectsCategory = "All Projects";

export default function ProjectCatalogue({
  projects,
}: ProjectCatalogueProps) {
  const categories = useMemo(
    () => [
      allProjectsCategory,
      ...new Set(
        projects
          .filter((project) => project.sector.trim().length > 0)
          .map((project) => project.sector),
      ),
    ],
    [projects],
  );
  const [activeCategory, setActiveCategory] = useState(allProjectsCategory);
  const filteredProjects = useMemo(
    () =>
      activeCategory === allProjectsCategory
        ? projects
        : projects.filter((project) => project.sector === activeCategory),
    [activeCategory, projects],
  );

  return (
    <div className={styles.catalogue}>
      <div className={styles.filters} role="group" aria-label="Filter projects">
        {categories.map((category) => (
          <button
            aria-pressed={category === activeCategory}
            className={`${styles.filter} ${category === activeCategory ? styles.activeFilter : ""}`}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
            aria-controls="project-results"
          >
            {category}
          </button>
        ))}
      </div>
      <p className={styles.resultCount} aria-live="polite">
        {filteredProjects.length}{" "}
        {filteredProjects.length === 1 ? "project" : "projects"}
      </p>
      {filteredProjects.length > 0 ? (
        <div className={styles.grid} id="project-results">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects to display"
          description="No project entries are currently available."
        />
      )}
    </div>
  );
}
