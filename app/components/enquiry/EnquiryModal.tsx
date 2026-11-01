"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import styles from "./EnquiryModal.module.css";

type EnquiryModalProps = {
  isOpen: boolean;
  selectedServiceSlug?: string;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function EnquiryModal({
  isOpen,
  selectedServiceSlug,
  onClose,
}: EnquiryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getClientRects().length > 0);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialogRef.current.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    function handleFocusIn(event: FocusEvent) {
      if (
        dialogRef.current &&
        event.target instanceof Node &&
        !dialogRef.current.contains(event.target)
      ) {
        closeButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      const returnTarget = returnFocusRef.current;
      if (returnTarget?.isConnected && returnTarget.getClientRects().length > 0) {
        returnTarget?.focus();
      } else if (returnTarget !== document.body) {
        document
          .querySelector<HTMLButtonElement>(
            'header button[aria-controls="mobile-navigation"]',
          )
          ?.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.dialog}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-dialog-title"
        aria-describedby="enquiry-dialog-description"
        tabIndex={-1}
      >
        <div className={styles.header}>
          <div>
            <h2 id="enquiry-dialog-title">Quick Enquiry</h2>
            <p id="enquiry-dialog-description">
              Share your project details, then review and send your enquiry in
              WhatsApp.
            </p>
          </div>
          <button
            className={styles.close}
            type="button"
            aria-label="Close enquiry dialog"
            onClick={onClose}
            ref={closeButtonRef}
          >
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        <EnquiryForm
          variant="modal"
          defaultServiceSlug={selectedServiceSlug}
          onClose={onClose}
        />
      </section>
    </div>
  );
}
