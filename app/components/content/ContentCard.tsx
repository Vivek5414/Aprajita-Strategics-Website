import type { ReactNode } from "react";
import styles from "./ContentCard.module.css";

type ContentCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  id?: string;
};

export default function ContentCard({
  eyebrow,
  title,
  description,
  children,
  id,
}: ContentCardProps) {
  return (
    <article className={styles.card} id={id}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {children}
    </article>
  );
}
