import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/app/data/services";
import EnquiryTrigger from "@/app/components/enquiry/EnquiryTrigger";
import styles from "./ServiceCatalogueCard.module.css";

type ServiceCatalogueCardProps = {
  service: Service;
  number: number;
};

export default function ServiceCatalogueCard({
  service,
  number,
}: ServiceCatalogueCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageFrame}>
        <Image
          src={`/images/services/${service.slug}.webp`}
          alt={`${service.title} service`}
          fill
          sizes="(max-width: 36rem) 100vw, (max-width: 64rem) 50vw, 33vw"
        />
        <span className={styles.number}>
          {String(number).padStart(2, "0")}
        </span>
      </div>
      <div className={styles.content}>
        <h2>{service.title}</h2>
        <p>{service.shortDescription}</p>
        <div className={styles.actions}>
          <Link
            className={styles.detailsLink}
            href={`/services/${service.slug}`}
            aria-label={`View details for ${service.title}`}
          >
            View Details <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <EnquiryTrigger
            className={styles.enquiryButton}
            serviceSlug={service.slug}
            ariaLabel={`Send an enquiry about ${service.title}`}
          >
            Send Enquiry
          </EnquiryTrigger>
        </div>
      </div>
    </article>
  );
}
