"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { homepageFaqs } from "@/app/data/faqs";
import styles from "./HomeFAQs.module.css";

export default function HomeFAQs() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  return (
    <section
      className={`section ${styles.section}`}
      aria-labelledby="home-faq-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Frequently asked questions"
          title="Learn More About Our Work."
          description="Answers to common questions about our services and project approach."
          id="home-faq-title"
        />
        <div className={styles.questions}>
          {homepageFaqs.map(({ question, answer }, index) => {
            const isOpen = openQuestion === index;
            const panelId = `homepage-faq-answer-${index + 1}`;
            return (
              <article className={styles.question} key={question}>
                <h3>
                  <button
                    className={styles.trigger}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenQuestion(isOpen ? null : index)}
                  >
                    {question}
                    <ChevronDown
                      className={isOpen ? styles.chevronOpen : ""}
                      aria-hidden="true"
                      size={20}
                    />
                  </button>
                </h3>
                <div
                  className={styles.answer}
                  id={panelId}
                  hidden={!isOpen}
                >
                  <p>{answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
