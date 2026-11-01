"use client";

import {
  BadgeCheck,
  ClipboardList,
  Construction,
  DraftingCompass,
  MessageCircle,
  PackageCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { updateCardPointer } from "./cardPointerEffects";
import styles from "./HomeMethodology.module.css";

const steps = [
  {
    title: "Consultation",
    icon: MessageCircle,
    description:
      "Understand the client's requirements, project objectives, expectations and initial considerations.",
  },
  {
    title: "Planning",
    icon: ClipboardList,
    description:
      "Assess project requirements and establish a direction for planning, technical coordination and resource considerations.",
  },
  {
    title: "Design",
    icon: DraftingCompass,
    description:
      "Develop relevant architectural and engineering design solutions based on agreed requirements and project specifications.",
  },
  {
    title: "Approval",
    icon: BadgeCheck,
    description:
      "Coordinate relevant design information and address feedback as required by the project review and approval process.",
  },
  {
    title: "Execution",
    icon: Construction,
    description:
      "Support applicable execution and coordination activities in accordance with the agreed project scope and responsibilities.",
  },
  {
    title: "Delivery",
    icon: PackageCheck,
    description:
      "Bring relevant project activities toward completion, with attention to agreed requirements, documentation and coordination.",
  },
] as const;

export default function HomeMethodology() {
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
      aria-labelledby="home-methodology"
      ref={sectionRef}
    >
      <div className="container">
        <div className={styles.heading}>
          <SectionHeading
            eyebrow="How we work"
            title="Our Methodology"
            description="Every project requires a clear understanding of its objectives, technical requirements and development process. Our methodology follows a structured sequence intended to support informed decisions, effective coordination and organized project progression."
            id="home-methodology"
          />
        </div>
        <ol className={styles.steps}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                onPointerMove={(event) => updateCardPointer(event, true)}
                onPointerLeave={(event) => updateCardPointer(event, false)}
              >
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.card}>
                  <span className={styles.iconFrame}>
                    <Icon aria-hidden="true" size={27} strokeWidth={1.6} />
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <span className={styles.cardRule} aria-hidden="true" />
                </div>
              </li>
            );
          })}
        </ol>
        <p className={styles.closing}>
          A clear process helps bring structure to complex requirements and
          keeps project objectives at the centre of every stage.
        </p>
      </div>
    </section>
  );
}
