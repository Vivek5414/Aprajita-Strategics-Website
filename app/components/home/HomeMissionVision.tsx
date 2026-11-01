import { ArrowUpRight } from "lucide-react";
import {
  homepageMission,
  homepageVision,
} from "@/app/data/homepage";
import styles from "./HomeMissionVision.module.css";

export default function HomeMissionVision() {
  return (
    <section
      className={`section ${styles.section}`}
      aria-labelledby="mission-vision-title"
    >
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <p className="eyebrow">Purpose and direction</p>
          <h2 id="mission-vision-title">Guided by Purpose. Focused on Progress.</h2>
          <p>
            Our mission and vision express the principles that guide our
            approach to engineering, design and project consultancy.
          </p>
        </div>
        <div className={styles.statements}>
          {[homepageMission, homepageVision].map((statement, index) => (
            <article className={styles.statement} key={statement.title}>
              <span className={styles.number}>
                0{index + 1} <ArrowUpRight size={17} aria-hidden="true" />
              </span>
              <h3>{statement.title}</h3>
              {statement.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
