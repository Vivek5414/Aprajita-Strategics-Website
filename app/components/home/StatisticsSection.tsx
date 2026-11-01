import styles from "./StatisticsSection.module.css";

const statistics = [
  { value: "15+", label: "Years Experience" },
  { value: "250+", label: "Projects Completed" },
  { value: "50+", label: "Expert Engineers" },
] as const;

export default function StatisticsSection() {
  return (
    <section className={styles.section} aria-label="Company statistics">
      <div className={`container ${styles.grid}`}>
        {statistics.map((statistic) => (
          <article className={styles.card} key={statistic.label}>
            <p className={styles.value}>{statistic.value}</p>
            <p className={styles.label}>{statistic.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
