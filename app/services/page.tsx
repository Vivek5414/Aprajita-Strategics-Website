import type { Metadata } from "next";
import PageCta from "@/app/components/content/PageCta";
import PageIntro from "@/app/components/content/PageIntro";
import ServiceCatalogueCard from "@/app/components/services/ServiceCatalogueCard";
import { contentRepository } from "@/app/data/contentRepository";
import styles from "./Services.module.css";

export const metadata: Metadata = {
  title: "Engineering, Design & Infrastructure Services",
  description:
    "Explore 17 engineering, architectural, project planning, industrial, energy, and environmental service areas from Aprajita Strategics.",
};

export default async function ServicesPage() {
  const services = await contentRepository.getServices();

  return (
    <>
      <PageIntro
        eyebrow="Our services"
        title="Engineering expertise for complex project requirements."
        description="Explore architectural, engineering, project planning, industrial, energy, and environmental services. The scope of each engagement is defined around the project brief and confirmed responsibilities."
      />

      <section
        className={`section ${styles.catalogue}`}
        aria-label="All services"
      >
        <div className={`container ${styles.serviceGrid}`}>
          {services.map((service, index) => (
            <ServiceCatalogueCard
              service={service}
              number={index + 1}
              key={service.slug}
            />
          ))}
        </div>
      </section>

      <PageCta
        title="Looking for the right project support?"
        description="Start with your goals, requirements, and project context. We can discuss which consultancy services are relevant."
        linkLabel="Request a consultation"
        href="/contact"
        openEnquiry
      />
    </>
  );
}
