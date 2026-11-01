import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EnquiryTrigger from "@/app/components/enquiry/EnquiryTrigger";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section
      className={styles.hero}
      id="top"
      aria-labelledby="home-hero-title"
    >
      <Image
        className={styles.image}
        src="/images/engineering-hero.webp"
        alt="Contemporary glass office towers viewed from below"
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          ENGINEERING <span aria-hidden="true">|</span> ARCHITECTURE{" "}
          <span aria-hidden="true">|</span> PROJECT CONSULTANCY
        </p>

        <h1 className={styles.title} id="home-hero-title">
          Building the Future
          <br />
          <span>With Precision</span>
        </h1>

        <p className={styles.description}>
          We provide premium structural, architectural, and engineering
          consultancy to bring your most ambitious projects to life.
          Sustainable, modern, and reliable.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} href="/services">
            Our Services
            <span className={styles.actionArrow} aria-hidden="true">
              →
            </span>
          </Link>
          <EnquiryTrigger className={styles.secondaryAction}>
            Consult With Us
            <ArrowRight size={17} aria-hidden="true" />
          </EnquiryTrigger>
        </div>
      </div>

      <div className={styles.imageLabel} aria-hidden="true">
        <span className={styles.imageLabelRule} />
        Engineering with Purpose. Building with Precision.
      </div>
    </section>
  );
}
