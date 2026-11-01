import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowUp,
  Clock3,
  LockKeyhole,
  MapPin,
  Phone,
  Mail,
  UserRound,
} from "lucide-react";
import { contactDetails } from "@/app/data/contact";
import { services } from "@/app/data/services";
import styles from "./SiteFooter.module.css";

const serviceColumns = [
  services.slice(0, 6),
  services.slice(6, 12),
  services.slice(12),
];

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Our Methodology", href: "/#home-methodology" },
  { label: "Latest Insights", href: "/insights" },
  { label: "Contact Us", href: "/contact" },
] as const;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.main}>
          <section className={styles.brand} aria-label="Company information">
            <Link
              className={styles.logo}
              href="/"
              aria-label="Aprajita Strategics home"
            >
              <Image
                className={styles.logoImage}
                src="/images/aprajita-logo.png"
                alt="APRAJITA STRATEGICS – Engineering and Project Consultancy"
                width={1254}
                height={1254}
              />
            </Link>
            <h2>{contactDetails.companyName}</h2>
            <p className={styles.tagline}>
              Engineering with Purpose. Building with Precision.
            </p>
            <p className={styles.description}>
              APRAJITA STRATEGICS PRIVATE LIMITED provides architectural,
              engineering and project consultancy services covering design,
              planning, industrial systems and project-related requirements.
              We focus on practical solutions, professional coordination and an
              understanding of each project&apos;s objectives.
            </p>
          </section>

          <nav className={styles.services} aria-labelledby="footer-services">
            <h2 id="footer-services">Services</h2>
            <div className={styles.serviceColumns}>
              {serviceColumns.map((column, columnIndex) => (
                <ul key={columnIndex}>
                  {column.map((service) => (
                    <li key={service.slug}>
                      <Link href={`/services/${service.slug}`}>
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <Link className={styles.viewAll} href="/services">
              View All Services <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </nav>

          <nav className={styles.quickLinks} aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links">Quick Links</h2>
            <ul>
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section
            className={styles.contact}
            aria-labelledby="footer-contact-info"
          >
            <h2 id="footer-contact-info">Contact Information</h2>
            <address>
              <div className={styles.contactItem}>
                <UserRound size={17} aria-hidden="true" />
                <span>{contactDetails.contactPerson}</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={18} aria-hidden="true" />
                <span>
                  {contactDetails.address.map((line) => (
                    <span className={styles.addressLine} key={line}>
                      {line}
                    </span>
                  ))}
                </span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={17} aria-hidden="true" />
                <a href={contactDetails.phoneHref}>
                  {contactDetails.displayPhone}
                </a>
              </div>
              <div className={styles.contactItem}>
                <Mail size={17} aria-hidden="true" />
                <a href={contactDetails.emailHref}>{contactDetails.email}</a>
              </div>
              <div className={styles.contactItem}>
                <Clock3 size={17} aria-hidden="true" />
                <span>
                  {contactDetails.businessHours[0]}:{" "}
                  {contactDetails.businessHours[1]}
                </span>
              </div>
            </address>
          </section>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} APRAJITA STRATEGICS PRIVATE LIMITED. All Rights Reserved.</p>
          <div className={styles.bottomActions}>
            <Link className={styles.backToTop} href="/#top">
              Back to top <ArrowUp size={15} aria-hidden="true" />
            </Link>
            <Link className={styles.adminLink} href="/admin">
              <LockKeyhole size={15} aria-hidden="true" />
              Admin Login
            </Link>
          </div>
        </div>
      </footer>

    </>
  );
}
