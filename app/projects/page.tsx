import type { Metadata } from "next";
import PageIntro from "@/app/components/content/PageIntro";
import { projects } from "@/app/data/projects";
import ProjectCatalogue from "./ProjectCatalogue";

export const metadata: Metadata = {
  title: "Projects",
  description: "Featured projects by APRAJITA STRATEGICS PRIVATE LIMITED.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our Portfolio"
        title="Projects That Reflect Our Expertise."
        description="Explore our project portfolio to understand our approach to engineering, architecture and project development. Each project represents its own requirements, design considerations and technical challenges."
      />
      <section className="section">
        <div className="container">
          <ProjectCatalogue projects={projects} />
        </div>
      </section>
    </>
  );
}
