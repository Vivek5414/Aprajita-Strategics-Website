"use client";

import {
  ArrowUpRight,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { homepageValues } from "@/app/data/homepage";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { updateCardPointer } from "./cardPointerEffects";
import styles from "./HomeCoreValues.module.css";

const icons: Record<(typeof homepageValues)[number]["title"], LucideIcon> = {
  Innovation: Lightbulb,
  Quality: ShieldCheck,
  Collaboration: Handshake,
  Excellence: Sparkles,
};

export default function HomeCoreValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealReady, setRevealReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    setRevealReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const sectionClasses = [
    "section",
    styles.section,
    revealReady ? styles.revealReady : "",
    isVisible ? styles.visible : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={sectionClasses}
      aria-labelledby="home-values-title"
      ref={sectionRef}
    >
      <div className="container">
        <div className={styles.heading}>
          <SectionHeading
            eyebrow="What guides us"
            title="Our Core Values."
            description="The principles we bring to our work and professional relationships."
            id="home-values-title"
          />
        </div>
        <ul className={styles.values}>
          {homepageValues.map((value, index) => {
            const Icon = icons[value.title];
            return (
              <li
                className={styles.value}
                key={value.title}
                onPointerMove={(event) => updateCardPointer(event, true)}
                onPointerLeave={(event) => updateCardPointer(event, false)}
              >
                <div className={styles.valueTop}>
                  <span className={styles.iconFrame}>
                    <Icon aria-hidden="true" size={23} strokeWidth={1.6} />
                  </span>
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className={styles.valueContent}>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
                <div className={styles.valueFooter} aria-hidden="true">
                  <span />
                  <ArrowUpRight
                    className={styles.arrow}
                    size={19}
                    strokeWidth={1.7}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
