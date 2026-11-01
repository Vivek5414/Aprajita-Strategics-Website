"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { useEnquiry } from "./EnquiryContext";

type EnquiryTriggerProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  serviceSlug?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function EnquiryTrigger({
  children,
  className,
  ariaLabel,
  serviceSlug,
  onClick,
}: EnquiryTriggerProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <button
      className={className}
      type="button"
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event);
        openEnquiry(serviceSlug);
      }}
    >
      {children}
    </button>
  );
}
