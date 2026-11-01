import {
  ArrowUpRight,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { homepageValues } from "@/app/data/homepage";
import SectionHeading from "@/app/components/ui/SectionHeading";
import styles from "./HomeCoreValues.module.css";

const icons: Record<(typeof homepageValues)[number]["title"], LucideIcon> = {
  Innovation: Lightbulb,
  Quality: ShieldCheck,
  Collaboration: Handshake,
  Excellence: Sparkles,
};

export default function HomeCoreValues() {
  return (
    <section
      className={`section ${styles.section}`}
      aria-labelledby="home-values-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="What guides us"
          title="Our Core Values."
          description="The principles we bring to our work and professional relationships."
          id="home-values-title"
        />
        <div className={styles.values}>
          {homepageValues.map((value, index) => {
            const Icon = icons[value.title];
            return (
              <article className={styles.value} key={value.title}>
                <div className={styles.valueTop}>
                  <Icon aria-hidden="true" size={24} strokeWidth={1.6} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
                <ArrowUpRight
                  className={styles.arrow}
                  aria-hidden="true"
                  size={18}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
