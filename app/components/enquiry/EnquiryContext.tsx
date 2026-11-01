"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import EnquiryModal from "./EnquiryModal";

const SESSION_SHOWN_KEY = "aprajita-enquiry-popup-shown";

type EnquiryContextValue = {
  openEnquiry: (serviceSlug?: string) => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

type EnquiryProviderProps = {
  children: ReactNode;
  firstVisitPopup?: boolean;
  firstVisitDelayMs?: number;
};

export function EnquiryProvider({
  children,
  firstVisitPopup = false,
  firstVisitDelayMs = 8000,
}: EnquiryProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<
    string | undefined
  >();

  const openEnquiry = useCallback((serviceSlug?: string) => {
    window.sessionStorage.setItem(SESSION_SHOWN_KEY, "true");
    setSelectedServiceSlug(serviceSlug);
    setIsOpen(true);
  }, []);
  const closeEnquiry = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!firstVisitPopup || window.sessionStorage.getItem(SESSION_SHOWN_KEY)) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!window.sessionStorage.getItem(SESSION_SHOWN_KEY)) {
        window.sessionStorage.setItem(SESSION_SHOWN_KEY, "true");
        setSelectedServiceSlug(undefined);
        setIsOpen(true);
      }
    }, firstVisitDelayMs);

    return () => window.clearTimeout(timer);
  }, [firstVisitDelayMs, firstVisitPopup]);

  return (
    <EnquiryContext.Provider value={{ openEnquiry }}>
      {children}
      <EnquiryModal
        isOpen={isOpen}
        selectedServiceSlug={selectedServiceSlug}
        onClose={closeEnquiry}
      />
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);

  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider.");
  }

  return context;
}
