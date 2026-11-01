"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type SetStateAction } from "react";
import { navigation } from "@/app/data/site";
import EnquiryTrigger from "@/app/components/enquiry/EnquiryTrigger";
import styles from "./SiteHeader.module.css";

type MenuState = {
  pathname: string;
  mobileOpen: boolean;
};

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuState, setMenuState] = useState<MenuState>({
    pathname,
    mobileOpen: false,
  });
  const isCurrentMenuState = menuState.pathname === pathname;
  const mobileOpen = isCurrentMenuState && menuState.mobileOpen;
  const setMobileOpen = useCallback(
    (next: SetStateAction<boolean>) => {
      setMenuState((current) => ({
        pathname,
        mobileOpen:
          typeof next === "function"
            ? next(current.pathname === pathname && current.mobileOpen)
            : next,
      }));
    },
    [pathname],
  );
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        menuToggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, setMobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const firstLink = headerRef.current?.querySelector<HTMLAnchorElement>(
      `.${styles.mobilePanel} a`,
    );
    firstLink?.focus();
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.inner}>
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
            priority
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              className={`${styles.navLink} ${isActive(item.href) ? styles.active : ""}`}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <EnquiryTrigger className={styles.consultation}>
          Request a Consultation
          <ArrowRight size={16} aria-hidden="true" />
        </EnquiryTrigger>

        <button
          className={styles.menuToggle}
          ref={menuToggleRef}
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        className={`${styles.mobilePanel} ${mobileOpen ? styles.mobilePanelOpen : ""}`}
        id="mobile-navigation"
        hidden={!mobileOpen}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              className={`${styles.mobileLink} ${isActive(item.href) ? styles.active : ""}`}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              key={item.href}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <EnquiryTrigger
            className={styles.mobileConsultation}
            onClick={() => setMobileOpen(false)}
          >
            Request a Consultation <ArrowRight size={16} aria-hidden="true" />
          </EnquiryTrigger>
        </nav>
      </div>
    </header>
  );
}
