import type { Metadata } from "next";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
} from "lucide-react";
import EnquiryForm from "@/app/components/enquiry/EnquiryForm";
import ConsultationCTA from "@/app/components/content/ConsultationCTA";
import PageIntro from "@/app/components/content/PageIntro";
import WhatsAppIcon from "@/app/components/ui/WhatsAppIcon";
import { contactDetails, getWhatsAppHref } from "@/app/data/contact";
import ContactPageReveal from "./ContactPageReveal";
import styles from "./ContactPage.module.css";

export const metadata: Metadata = {
  title: "Contact APRAJITA STRATEGICS",
  description:
    "Contact APRAJITA STRATEGICS PRIVATE LIMITED in Ratu, Ranchi to discuss engineering, design, infrastructure, or project consultancy requirements.",
};

const locationAddress =
  "APRAJITA STRATEGICS PRIVATE LIMITED, Ramji Prasad, Near Mata Vaishno Devi, Ratu, Ranchi, Jharkhand 835222, India";
const googleMapsDestination =
  "https://www.google.com/maps/search/?api=1&query=APRAJITA+STRATEGICS+PRIVATE+LIMITED%2C+Ramji+Prasad%2C+Near+Mata+Vaishno+Devi%2C+Ratu%2C+Ranchi%2C+Jharkhand+835222%2C+India";
const googleMapsEmbed = `https://maps.google.com/maps?hl=en&q=${encodeURIComponent(locationAddress)}&z=14&output=embed`;

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        eyebrow="Contact"
        title="Let's Start a Conversation"
        description="Tell us about your project, requirements or business objectives. Our team will be glad to understand your needs and discuss the right engineering and consultancy approach."
      />

      <section className={`section ${styles.contactSection}`}>
        <div className={`container ${styles.contactGrid}`}>
          <ContactPageReveal className={styles.information}>
            <p className={styles.companyName}>{contactDetails.companyName}</p>
            <h2>Contact information</h2>
            <p className={styles.introduction}>
              Reach out using the contact details below, or share your project
              information through the enquiry form.
            </p>

            <div className={styles.detailList}>
              <ContactPageReveal className={styles.detailReveal}>
                <article className={styles.detail}>
                  <span className={styles.icon} aria-hidden="true">
                    <MapPin size={21} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3>Office address</h3>
                    <address>
                      {contactDetails.address.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </address>
                  </div>
                </article>
              </ContactPageReveal>

              <ContactPageReveal className={styles.detailReveal}>
                <article className={styles.detail}>
                  <span className={styles.icon} aria-hidden="true">
                    <Phone size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3>Phone</h3>
                    <a href={contactDetails.phoneHref}>
                      {contactDetails.displayPhone}
                    </a>
                    <div className={styles.phoneActions}>
                      <a
                        className={styles.callButton}
                        href={contactDetails.phoneHref}
                        aria-label={`Call APRAJITA STRATEGICS at ${contactDetails.displayPhone}`}
                      >
                        <PhoneCall size={17} aria-hidden="true" />
                        Call Now
                      </a>
                      <a
                        className={styles.whatsAppButton}
                        href={getWhatsAppHref()}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Chat with APRAJITA STRATEGICS on WhatsApp at ${contactDetails.displayPhone}`}
                      >
                        <WhatsAppIcon className={styles.whatsAppIcon} />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              </ContactPageReveal>

              <ContactPageReveal className={styles.detailReveal}>
                <article className={styles.detail}>
                  <span className={styles.icon} aria-hidden="true">
                    <Mail size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3>Email</h3>
                    <a href={contactDetails.emailHref}>{contactDetails.email}</a>
                  </div>
                </article>
              </ContactPageReveal>

              <ContactPageReveal className={styles.detailReveal}>
                <article className={styles.detail}>
                  <span className={styles.icon} aria-hidden="true">
                    <Clock3 size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3>Business hours</h3>
                    {contactDetails.businessHours.map((line) => (
                      <span className={styles.detailText} key={line}>
                        {line}
                      </span>
                    ))}
                  </div>
                </article>
              </ContactPageReveal>
            </div>
          </ContactPageReveal>

          <ContactPageReveal className={styles.formPanelReveal}>
            <div className={styles.formPanel}>
              <p className={styles.formEyebrow}>Project enquiry</p>
              <h2>Tell us what you are planning.</h2>
              <p className={styles.formIntroduction}>
                Provide a few details to help frame the conversation. This
                frontend demo does not transmit or store form submissions.
              </p>
              <EnquiryForm variant="contact" />
            </div>
          </ContactPageReveal>
        </div>
      </section>

      <section
        className={`section section--muted ${styles.locationSection}`}
        aria-labelledby="office-location-title"
      >
        <div className={`container ${styles.location}`}>
          <ContactPageReveal className={styles.locationInformation}>
            <p className={styles.formEyebrow}>Our location</p>
            <h2 id="office-location-title">Ratu, Ranchi</h2>
            <p>
              {contactDetails.companyName}
              <br />
              Ramji Prasad, Near Mata Vaishno Devi,
              <br />
              Ratu, Ranchi, Jharkhand – 835222, India.
            </p>
          </ContactPageReveal>
          <ContactPageReveal className={styles.locationMapColumn}>
            <>
              <div className={styles.mapPreview}>
                <iframe
                  src={googleMapsEmbed}
                  title={`Map showing the Ratu, Ranchi area near ${locationAddress}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  tabIndex={-1}
                />
                <a
                  className={styles.mapLink}
                  href={googleMapsDestination}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${locationAddress} in Google Maps`}
                >
                  <span className={styles.visuallyHidden}>
                    Open location in Google Maps
                  </span>
                </a>
              </div>
              <a
                className={styles.directionsLink}
                href={googleMapsDestination}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions <span aria-hidden="true">→</span>
              </a>
            </>
          </ContactPageReveal>
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
