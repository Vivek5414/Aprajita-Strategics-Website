import type { Metadata } from "next";
import ContentCard from "@/app/components/content/ContentCard";
import PageIntro from "@/app/components/content/PageIntro";
import { contentRepository } from "@/app/data/contentRepository";
import styles from "./Industries.module.css";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Explore the industrial facilities, commercial built environments, and infrastructure contexts considered by APRAJITA STRATEGICS.",
};

export default async function IndustriesPage() {
  const industries = await contentRepository.getIndustries();

  return (
    <>
      <PageIntro
        eyebrow="Industries and environments"
        title="Solutions shaped by the context they serve."
        description="Engineering and design considerations change with the place, its purpose, and the demands placed on it."
      />
      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={`content-grid content-grid--three ${styles.grid}`}>
            {industries.map((industry) => (
              <ContentCard
                key={industry.slug}
                title={industry.title}
                description={industry.description}
              />
            ))}
          </div>
          <p className="industryNote">
            These are the environments reflected in our consultancy focus, not
            a list of claimed past clients or completed projects.
          </p>
        </div>
      </section>
    </>
  );
}
