import Image from "next/image";
import ArrowLink from "@/app/components/ui/ArrowLink";
import SectionHeading from "@/app/components/ui/SectionHeading";
import styles from "./AboutIntroduction.module.css";

export default function AboutIntroduction() {
  return (
    <section
      className={`section ${styles.section}`}
      aria-labelledby="about-introduction-title"
    >
      <div className={`container ${styles.layout}`}>
        <figure className={styles.imageFrame}>
          <Image
            className={styles.image}
            src="/images/home-building-infographic.webp"
            alt="Building infographic showing project planning, engineering and project delivery levels"
            fill
            sizes="(max-width: 48rem) 100vw, 50vw"
          />
        </figure>

        <div className={styles.content}>
          <SectionHeading
            eyebrow="About Aprajita Strategics"
            title="Shaping the Future with Precision & Elegance."
            id="about-introduction-title"
          />

          <div className={styles.description}>
            <p>
              APRAJITA STRATEGICS PRIVATE LIMITED is an engineering,
              architectural and project consultancy company focused on
              supporting a broad range of development requirements. Our work
              spans architectural planning, structural engineering, industrial
              infrastructure, building systems and project management.
            </p>
            <p>
              We approach every project by understanding its purpose, technical
              requirements and practical constraints. By bringing different
              engineering disciplines into consideration, we aim to develop
              solutions that balance functionality, design intent and project
              requirements.
            </p>
            <p>
              From initial planning and design to technical coordination and
              execution-related support, our focus remains on delivering
              thoughtful, structured and project-oriented professional
              services.
            </p>
          </div>

          <div className={styles.supportingCopy}>
            <h3>An Integrated Perspective on Every Project.</h3>
            <p>
              We believe successful projects require more than individual
              technical services. They depend on clear planning, informed
              design decisions and effective coordination across disciplines.
              Our approach is built around these principles.
            </p>
          </div>

          <ArrowLink href="/about">Learn More About Us</ArrowLink>
        </div>
      </div>
    </section>
  );
}
