"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { homepageFaqs } from "@/app/data/faqs";
import styles from "./HomeFAQs.module.css";

export default function HomeFAQs() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
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
      { threshold: 0.12 },
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
      aria-labelledby="home-faq-title"
      ref={sectionRef}
    >
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <SectionHeading
              eyebrow="Frequently asked questions"
              title="Frequently Asked Questions"
              description="Answers to common questions about our services and project approach."
              id="home-faq-title"
            />
            <span className={styles.introRule} aria-hidden="true" />
          </div>
          <div className={styles.questions}>
            {homepageFaqs.map(({ question, answer }, index) => {
              const isOpen = openQuestion === index;
              const questionId = `homepage-faq-question-${index + 1}`;
              const panelId = `homepage-faq-answer-${index + 1}`;
              return (
                <article className={styles.question} key={question}>
                  <h3>
                    <button
                      className={styles.trigger}
                      id={questionId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenQuestion(isOpen ? null : index)}
                    >
                      <span>{question}</span>
                      <span className={styles.indicator} aria-hidden="true">
                        <Plus
                          className={isOpen ? styles.indicatorOpen : ""}
                          size={19}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    className={`${styles.answer} ${isOpen ? styles.answerOpen : ""}`}
                    id={panelId}
                    role="region"
                    aria-labelledby={questionId}
                    aria-hidden={!isOpen}
                  >
                    <div className={styles.answerInner}>
                      <p>{answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
