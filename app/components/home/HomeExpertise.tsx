"use client";

import {
  BadgeCheck,
  Boxes,
  Building2,
  ClipboardList,
  DraftingCompass,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { homepageExpertise, type HomepageExpertise } from "@/app/data/homepage";
import styles from "./HomeExpertise.module.css";

const icons: Record<HomepageExpertise["title"], LucideIcon> = {
  "Architectural Planning": DraftingCompass,
  "Structural Engineering": Building2,
  "Project Management": ClipboardList,
  Sustainability: Leaf,
  "BIM Technology": Boxes,
  "Quality Assurance": BadgeCheck,
};

export default function HomeExpertise() {
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
      aria-labelledby="home-expertise-title"
      ref={sectionRef}
    >
      <div className="container">
        <div className={styles.heading}>
          <SectionHeading
            eyebrow="Areas of expertise"
            title="Our Areas of Expertise."
            description="Our work brings together design, engineering and project disciplines to respond to the specific requirements of each assignment."
            id="home-expertise-title"
          />
        </div>
        <ul className={styles.list}>
          {homepageExpertise.map((item) => {
            const Icon = icons[item.title];
            return (
              <li className={styles.item} key={item.title}>
                <span className={styles.iconFrame}>
                  <Icon aria-hidden="true" size={24} strokeWidth={1.7} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
