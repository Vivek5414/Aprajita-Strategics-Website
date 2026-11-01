import { PhoneCall } from "lucide-react";
import { contactDetails, getWhatsAppHref } from "@/app/data/contact";
import WhatsAppIcon from "@/app/components/ui/WhatsAppIcon";
import styles from "./FloatingContactActions.module.css";

export default function FloatingContactActions() {
  return (
    <nav className={styles.actions} aria-label="Quick contact">
      <a
        className={`${styles.button} ${styles.call}`}
        href={contactDetails.phoneHref}
        aria-label={`Call APRAJITA STRATEGICS at ${contactDetails.displayPhone}`}
        title="Call Now"
      >
        <PhoneCall size={22} aria-hidden="true" />
      </a>
      <a
        className={`${styles.button} ${styles.whatsApp}`}
        href={getWhatsAppHref()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with APRAJITA STRATEGICS on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon className={styles.whatsAppIcon} />
      </a>
    </nav>
  );
}
