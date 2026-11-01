import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/app/data/services";
import SectionHeading from "@/app/components/ui/SectionHeading";
import EnquiryTrigger from "@/app/components/enquiry/EnquiryTrigger";
import ServiceCatalogueCard from "./ServiceCatalogueCard";
import styles from "./HomeServices.module.css";

type HomeServicesProps = {
  services: readonly Service[];
};

export default function HomeServices({ services }: HomeServicesProps) {
  return (
    <section
      className={`section ${styles.section}`}
      aria-labelledby="home-services-title"
    >
      <div className="container">
        <div className={styles.intro}>
          <SectionHeading
            eyebrow="Our services"
            title="Engineering Solutions Across Every Project Stage."
            id="home-services-title"
            light
          />
          <p>
            From initial planning and design to specialized engineering systems
            and project execution support, APRAJITA STRATEGICS offers a broad
            range of services to address diverse architectural, industrial and
            infrastructure requirements.
          </p>
          <p>
            Our multidisciplinary service portfolio is designed to support
            different project needs through technical planning, engineering
            design and coordinated professional services.
          </p>
        </div>

        <div className={styles.serviceGrid}>
          {services.map((service, index) => (
            <ServiceCatalogueCard
              service={service}
              number={index + 1}
              key={service.slug}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <div className={styles.closingCopy}>
            <p>Have a project requirement?</p>
            <span>Let&apos;s discuss the right engineering approach.</span>
          </div>
          <div className={styles.actionLinks}>
            <EnquiryTrigger className="button button--primary">
              Request a Consultation <ArrowRight size={18} aria-hidden="true" />
            </EnquiryTrigger>
            <Link className={styles.servicesLink} href="/services">
              View all services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
