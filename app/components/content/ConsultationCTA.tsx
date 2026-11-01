import { ArrowRight } from "lucide-react";
import EnquiryTrigger from "@/app/components/enquiry/EnquiryTrigger";
import styles from "./ConsultationCTA.module.css";

export default function ConsultationCTA() {
  return (
    <section
      className={styles.section}
      aria-labelledby="consultation-cta-heading"
    >
      <div className={`container ${styles.content}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            Trusted engineering &amp; project consultancy
          </p>
          <h2 id="consultation-cta-heading">
            Let&apos;s Build Your Next Landmark With Confidence.
          </h2>
          <p className={styles.description}>
            Have a project requirement or an idea you&apos;d like to discuss?
            Connect with our team to explore the engineering, design and
            consultancy support your project may need.
          </p>
        </div>
        <EnquiryTrigger className={styles.button}>
          Request a Consultation
          <ArrowRight size={17} aria-hidden="true" />
        </EnquiryTrigger>
      </div>
    </section>
  );
}
