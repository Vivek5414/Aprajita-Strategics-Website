"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ArrowRight } from "lucide-react";
import { getWhatsAppHref } from "@/app/data/contact";
import { services } from "@/app/data/services";
import styles from "./EnquiryForm.module.css";

type EnquiryFormProps = {
  variant: "contact" | "modal";
  defaultServiceSlug?: string;
  onClose?: () => void;
};

type ContactFormState = "idle" | "invalid" | "prepared";

type QuickEnquiryField = "name" | "phone" | "service";
type QuickEnquiryErrors = Partial<Record<QuickEnquiryField, string>>;

export default function EnquiryForm({
  variant,
  defaultServiceSlug,
  onClose,
}: EnquiryFormProps) {
  if (variant === "modal") {
    return (
      <QuickEnquiryForm
        defaultServiceSlug={defaultServiceSlug}
        onClose={onClose}
      />
    );
  }

  return <ContactForm />;
}

function QuickEnquiryForm({
  defaultServiceSlug,
  onClose,
}: {
  defaultServiceSlug?: string;
  onClose?: () => void;
}) {
  const [errors, setErrors] = useState<QuickEnquiryErrors>({});
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const whatsappLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (whatsappUrl) whatsappLinkRef.current?.focus();
  }, [whatsappUrl]);

  function clearFieldError(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const fieldName = event.currentTarget.name;
    if (
      fieldName !== "name" &&
      fieldName !== "phone" &&
      fieldName !== "service"
    ) {
      return;
    }
    const field: QuickEnquiryField = fieldName;
    if (!errors[field]) return;

    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const service = String(formData.get("service") ?? "");
    const normalizedPhone = phone.replace(/[\s()-]/g, "");
    const phoneDigits = normalizedPhone.replace(/\D/g, "");
    const nextErrors: QuickEnquiryErrors = {};

    if (!name) nextErrors.name = "Enter your full name.";
    if (!phone) {
      nextErrors.phone = "Enter your phone number.";
    } else if (
      !/^\+?\d{7,15}$/.test(normalizedPhone) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      nextErrors.phone =
        "Enter a valid phone number with 7 to 15 digits.";
    }
    if (!service) nextErrors.service = "Select a service.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

    setSubmitting(true);
    setSubmissionError("");
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        service,
        source: "WEBSITE_QUICK",
        website: String(formData.get("website") ?? ""),
      }),
    }).catch(() => null);

    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setSubmissionError(
        result.error ?? "We could not submit your enquiry. Please try again.",
      );
      setSubmitting(false);
      return;
    }

    const result = (await response.json()) as { referenceCode: string };
    setReferenceCode(result.referenceCode);
    const selectedService = services.find((item) => item.slug === service);
    const message = [
      "Hello, I would like to discuss a project with APRAJITA STRATEGICS.",
      `Full name: ${name}`,
      `Phone number: ${phone}`,
      `Service required: ${selectedService?.title ?? service}`,
      `Enquiry reference: ${result.referenceCode}`,
    ]
      .filter(Boolean)
      .join("\n");
    setWhatsappUrl(getWhatsAppHref(message));
    setSubmitting(false);
  }

  if (whatsappUrl) {
    return (
      <div className={styles.handoffPanel} role="status" aria-live="polite">
        <h3>Message ready to send.</h3>
        <p>
          Your enquiry is recorded with reference{" "}
          <strong>{referenceCode}.</strong>{" "}
          The WhatsApp message is only a draft; WhatsApp has not sent it.
        </p>
        <a
          className={`button button--primary ${styles.submit}`}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          ref={whatsappLinkRef}
        >
          Send Message <ArrowRight size={17} aria-hidden="true" />
        </a>
        {onClose ? (
          <button className={styles.cancel} type="button" onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className={`${styles.form} ${styles.quickForm}`}
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="enquiry-modal-website">Leave this field empty</label>
        <input id="enquiry-modal-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={styles.quickFields}>
        <div className={styles.field}>
          <label htmlFor="enquiry-modal-name">
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            autoComplete="name"
            id="enquiry-modal-name"
            name="name"
            placeholder="Enter your full name"
            required
            maxLength={120}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "enquiry-modal-name-error" : undefined}
            onChange={clearFieldError}
          />
          {errors.name ? (
            <p className={styles.fieldError} id="enquiry-modal-name-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="enquiry-modal-phone">
            Phone Number <span aria-hidden="true">*</span>
          </label>
          <input
            autoComplete="tel"
            id="enquiry-modal-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="+91 Enter your phone number"
            required
            maxLength={24}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "enquiry-modal-phone-error" : undefined}
            onChange={clearFieldError}
          />
          {errors.phone ? (
            <p className={styles.fieldError} id="enquiry-modal-phone-error">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="enquiry-modal-service">
            Service Required <span aria-hidden="true">*</span>
          </label>
          <select
            id="enquiry-modal-service"
            name="service"
            defaultValue={defaultServiceSlug ?? ""}
            required
            aria-invalid={Boolean(errors.service)}
            aria-describedby={
              errors.service ? "enquiry-modal-service-error" : undefined
            }
            onChange={clearFieldError}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option value={service.slug} key={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.service ? (
            <p className={styles.fieldError} id="enquiry-modal-service-error">
              {errors.service}
            </p>
          ) : null}
        </div>
      </div>

      <button
        className={`button button--primary ${styles.submit}`}
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Send Message"} <ArrowRight size={17} aria-hidden="true" />
      </button>
      {submissionError ? <p className={styles.error} role="alert">{submissionError}</p> : null}
    </form>
  );
}

function ContactForm() {
  const [formState, setFormState] = useState<ContactFormState>("idle");
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");
  const formId = "enquiry-contact";
  const whatsappLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (whatsappUrl) whatsappLinkRef.current?.focus();
  }, [whatsappUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const serviceSlug = String(formData.get("service") ?? "");
    const service = services.find((item) => item.slug === serviceSlug);
    setSubmitting(true);
    setSubmissionError("");
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        company: String(formData.get("company") ?? "").trim(),
        service: serviceSlug,
        projectLocation: String(formData.get("projectLocation") ?? "").trim(),
        requirements: String(formData.get("message") ?? "").trim(),
        source: "WEBSITE_CONTACT",
        website: String(formData.get("website") ?? ""),
      }),
    }).catch(() => null);
    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setSubmissionError(
        result.error ?? "We could not submit your enquiry. Please try again.",
      );
      setFormState("invalid");
      setSubmitting(false);
      return;
    }
    const result = (await response.json()) as { referenceCode: string };
    setReferenceCode(result.referenceCode);
    const message = [
      "Hello, I would like to discuss a project with APRAJITA STRATEGICS.",
      `Name: ${String(formData.get("name") ?? "").trim()}`,
      `Email: ${String(formData.get("email") ?? "").trim()}`,
      `Phone: ${String(formData.get("phone") ?? "").trim() || "Not provided"}`,
      `Company: ${String(formData.get("company") ?? "").trim() || "Not provided"}`,
      `Service: ${service?.title ?? "Not specified"}`,
      `Project location: ${String(formData.get("projectLocation") ?? "").trim() || "Not provided"}`,
      `Message: ${String(formData.get("message") ?? "").trim()}`,
      `Enquiry reference: ${result.referenceCode}`,
    ].join("\n");
    setWhatsappUrl(getWhatsAppHref(message));
    setFormState("prepared");
    setSubmitting(false);
  }

  return (
    <form
      className={`${styles.form} ${styles.contactForm}`}
      onSubmit={handleSubmit}
      onInvalidCapture={() => setFormState("invalid")}
      onInput={() => {
        if (formState !== "idle") {
          setFormState("idle");
          setWhatsappUrl(null);
        }
        setSubmissionError("");
      }}
    >
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input id={`${formId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-name`}>
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            autoComplete="name"
            id={`${formId}-name`}
            name="name"
            required
            maxLength={120}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-email`}>
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            autoComplete="email"
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            maxLength={254}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-phone`}>Phone number</label>
          <input
            autoComplete="tel"
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            pattern="\+?[0-9][0-9 \-]{6,23}"
            title="Enter a phone number with at least seven digits; spaces, +, and hyphens are allowed."
            maxLength={24}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-company`}>Company name</label>
          <input
            autoComplete="organization"
            id={`${formId}-company`}
            name="company"
            maxLength={160}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-service`}>Service required</label>
          <select id={`${formId}-service`} name="service" defaultValue="">
            <option value="">Select a service (optional)</option>
            {services.map((service) => (
              <option value={service.slug} key={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-location`}>Project location</label>
          <input
            autoComplete="address-level2"
            id={`${formId}-location`}
            name="projectLocation"
            maxLength={160}
          />
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label htmlFor={`${formId}-message`}>
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            required
            rows={6}
            maxLength={1500}
          />
        </div>
      </div>

      <button
        className={`button button--primary ${styles.submit}`}
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Send Message"}
        <ArrowRight size={17} aria-hidden="true" />
      </button>
      {submissionError ? <p className={styles.error} role="alert">{submissionError}</p> : null}

      <p
        className={`${styles.status} ${formState === "prepared" ? styles.prepared : ""} ${formState === "invalid" ? styles.error : ""}`}
        aria-live="polite"
        role={formState === "prepared" || formState === "invalid" ? "status" : undefined}
      >
        {formState === "prepared"
          ? `Your enquiry is recorded (reference ${referenceCode}). WhatsApp has not sent your message.`
          : formState === "invalid"
            ? submissionError || "Please complete the required fields and check that your email and phone number are valid."
            : ""}
      </p>
      {whatsappUrl ? (
        <a
          className={`button button--primary ${styles.submit}`}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          ref={whatsappLinkRef}
        >
          Send Message
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      ) : null}
    </form>
  );
}
