"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./AboutPage.module.css";

type AboutPageRevealProps = {
  children: ReactNode;
  className?: string;
};

export default function AboutPageReveal({
  children,
  className,
}: AboutPageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    setReady(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        styles.reveal,
        ready ? styles.revealReady : "",
        visible ? styles.revealed : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
