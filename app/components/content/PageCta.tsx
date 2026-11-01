import ArrowLink from "@/app/components/ui/ArrowLink";
import EnquiryTrigger from "@/app/components/enquiry/EnquiryTrigger";
import styles from "./PageCta.module.css";

type PageCtaProps = {
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  openEnquiry?: boolean;
  serviceSlug?: string;
};

export default function PageCta({
  title,
  description,
  linkLabel,
  href,
  openEnquiry = false,
  serviceSlug,
}: PageCtaProps) {
  return (
    <section className={`section section--compact ${styles.section}`}>
      <div className="container">
        <h2>{title}</h2>
        <p>{description}</p>
        {openEnquiry ? (
          <EnquiryTrigger
            className="button button--primary"
            serviceSlug={serviceSlug}
          >
            {linkLabel}
            <span aria-hidden="true">→</span>
          </EnquiryTrigger>
        ) : (
          <ArrowLink href={href}>{linkLabel}</ArrowLink>
        )}
      </div>
    </section>
  );
}
