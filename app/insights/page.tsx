import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import EmptyState from "@/app/components/content/EmptyState";
import PageIntro from "@/app/components/content/PageIntro";
import { contentRepository } from "@/app/data/contentRepository";
import styles from "./InsightsList.module.css";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Perspectives on engineering, architectural design, infrastructure, and project delivery from APRAJITA STRATEGICS.",
};

export default async function InsightsPage() {
  const insights = await contentRepository.getInsights();

  return (
    <>
      <PageIntro
        title="All Blog Posts"
        description="Explore our latest articles on construction, architecture, and industry insights"
      />
      <section className="section">
        <div className="container">
          {insights.length > 0 ? (
            <div className={styles.grid}>
              {insights.map((insight) => (
                <article className={styles.card} key={insight.slug}>
                  {insight.image ? (
                    <Link
                      className={styles.image}
                      href={`/insights/${insight.slug}`}
                      aria-label={`Read article: ${insight.title}`}
                    >
                      <Image
                        src={insight.image.src}
                        alt={insight.image.alt}
                        fill
                        sizes="(max-width: 36rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                      />
                    </Link>
                  ) : null}
                  <div className={styles.content}>
                    <p className={styles.category}>{insight.category}</p>
                    <h2>
                      <Link href={`/insights/${insight.slug}`}>
                        {insight.title}
                      </Link>
                    </h2>
                    <p>{insight.summary}</p>
                    <p className={styles.meta}>
                      {new Intl.DateTimeFormat("en", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(`${insight.publishedAt}T00:00:00Z`))}
                      <span aria-hidden="true"> · </span>
                      {insight.readingTime}
                    </p>
                    <Link
                      className={styles.readLink}
                      href={`/insights/${insight.slug}`}
                    >
                      Read Article <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="New perspectives are in preparation"
              description="Articles and updates will appear here as they are ready to share."
            />
          )}
        </div>
      </section>
    </>
  );
}
