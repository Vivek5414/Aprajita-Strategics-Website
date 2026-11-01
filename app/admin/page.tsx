import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import styles from "./AdminPlaceholder.module.css";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Administrative access is not available on this website.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPlaceholderPage() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.content}`}>
        <span className={styles.icon} aria-hidden="true">
          <LockKeyhole size={24} />
        </span>
        <p className={styles.eyebrow}>Administrative access</p>
        <h1>Admin sign-in is not available.</h1>
        <p>
          This website does not currently provide an administrative login or
          authentication service.
        </p>
        <Link className="button button--primary" href="/">
          Return to homepage
        </Link>
      </div>
    </section>
  );
}
