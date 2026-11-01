import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./ArrowLink.module.css";

type ArrowLinkProps = ComponentProps<typeof Link> & {
  variant?: "light" | "dark";
};

export default function ArrowLink({
  children,
  variant = "dark",
  className,
  ...props
}: ArrowLinkProps) {
  const classes = [
    styles.link,
    variant === "light" ? styles.light : styles.dark,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link className={classes} {...props}>
      {children}
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
