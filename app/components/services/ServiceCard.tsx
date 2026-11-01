import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  Building2,
  Calculator,
  Cable,
  ClipboardList,
  Droplets,
  Flame,
  Layers3,
  Leaf,
  PanelsTopLeft,
  ShieldCheck,
  Sofa,
  Sun,
  Wind,
  Network,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/app/data/services";
import styles from "./ServiceCard.module.css";

const serviceIcons: Record<string, LucideIcon> = {
  ClipboardList,
  Calculator,
  Building2,
  Box,
  Sofa,
  PanelsTopLeft,
  Network,
  Cable,
  Wind,
  Sun,
  Flame,
  Layers3,
  Droplets,
  ShieldCheck,
  Leaf,
};

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = serviceIcons[service.icon] ?? Building2;

  return (
    <article className={styles.card}>
      <div className={styles.icon} aria-hidden="true">
        <Icon size={22} strokeWidth={1.6} />
      </div>
      <h3 className={styles.title}>
        <Link href={`/services/${service.slug}`}>{service.title}</Link>
      </h3>
      <p className={styles.description}>{service.shortDescription}</p>
      <Link
        className={styles.link}
        href={`/services/${service.slug}`}
        aria-label={`Learn more about ${service.title}`}
      >
        Learn more <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
