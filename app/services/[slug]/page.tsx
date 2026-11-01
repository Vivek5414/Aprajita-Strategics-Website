import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import PageCta from "@/app/components/content/PageCta";
import PageIntro from "@/app/components/content/PageIntro";
import ServiceCard from "@/app/components/services/ServiceCard";
import {
  contentRepository,
} from "@/app/data/contentRepository";
import { legacyServiceRedirects } from "@/app/data/services";
import styles from "./ServiceDetail.module.css";

type ServiceDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await contentRepository.getServices();
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await contentRepository.getService(slug);

  if (!service) return { title: "Service not found" };

  return {
    title: service.seo.title,
    description: service.seo.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailProps) {
  const { slug } = await params;
  const legacyDestination = legacyServiceRedirects[slug];

  if (legacyDestination) redirect(legacyDestination);

  const [service, allServices, categories] = await Promise.all([
    contentRepository.getService(slug),
    contentRepository.getServices(),
    contentRepository.getServiceCategories(),
  ]);

  if (!service) notFound();

  const category = categories.find(
    (item) => item.slug === service.categorySlug,
  );
  const relatedServices = allServices
    .filter(
      (candidate) =>
        candidate.slug !== service.slug &&
        candidate.categorySlug === service.categorySlug,
    )
    .slice(0, 3);

  return (
    <>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          {category ? (
            <li>{category.title}</li>
          ) : null}
          <li aria-current="page">{service.title}</li>
        </ol>
      </nav>

      <PageIntro
        eyebrow={category?.title ?? "Our services"}
        title={service.title}
        description={service.shortDescription}
      />

      <section className={`section ${styles.detailSection}`}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.main}>
            {category ? (
              <figure className={styles.featureImage}>
                <Image
                  src={category.image.src}
                  alt={category.image.alt}
                  fill
                  priority
                  sizes="(max-width: 48rem) 100vw, 66vw"
                />
              </figure>
            ) : null}

            <section className={styles.contentSection}>
              <p className={styles.eyebrow}>Overview</p>
              <h2>Considered around your project brief.</h2>
              <p>{service.description}</p>
            </section>

            <section className={styles.contentSection}>
              <p className={styles.eyebrow}>Potential applications &amp; industries</p>
              <h2>Where this service may be relevant</h2>
              <p className={styles.disclaimer}>
                These are illustrative application settings, not claims of
                completed projects or prior client work.
              </p>
              <ul className={styles.applicationList}>
                {service.applications.map((application) => (
                  <li key={application}>
                    <Check size={18} aria-hidden="true" />
                    <span>{application}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.approach}>
              <p className={styles.eyebrow}>Engineering approach</p>
              <h2>Define the brief. Coordinate the interfaces.</h2>
              <p>{service.approach}</p>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <section className={styles.scope}>
              <p className={styles.eyebrow}>Scope of services</p>
              <h2>Potential scope</h2>
              <ul>
                {service.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.capabilities}>
              <p className={styles.eyebrow}>Key capabilities</p>
              <ul>
                {service.capabilities.map((capability) => (
                  <li key={capability}>
                    <Check size={17} aria-hidden="true" />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Link className={styles.categoryLink} href="/services">
              Browse all services
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      {relatedServices.length > 0 ? (
        <section className={`section section--muted ${styles.related}`}>
          <div className="container">
            <p className={styles.eyebrow}>Related services</p>
            <h2>Connected capabilities</h2>
            <div className={styles.relatedGrid}>
              {relatedServices.map((related) => (
                <ServiceCard service={related} key={related.slug} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <PageCta
        title="Discuss your project requirements."
        description="Share your project context and the support you are looking for."
        linkLabel="Request a consultation"
        href="/contact"
        openEnquiry
        serviceSlug={service.slug}
      />
    </>
  );
}
