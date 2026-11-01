import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import EmptyState from "@/app/components/content/EmptyState";
import SectionHeading from "@/app/components/ui/SectionHeading";
import type { Insight } from "@/app/data/insights";
import styles from "./HomeInsights.module.css";

type HomeInsightsProps = {
  insights: readonly Insight[];
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export default function HomeInsights({ insights }: HomeInsightsProps) {
  return (
    <section
      className={`section ${styles.section}`}
      aria-labelledby="home-insights-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Stay updated with industry insights and expert tips"
          title="Latest Blog Posts"
          id="home-insights-title"
        />
        {insights.length > 0 ? (
          <>
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
                    <p className={styles.meta}>
                      {dateFormatter.format(new Date(`${insight.publishedAt}T00:00:00Z`))}
                      <span aria-hidden="true">/</span>
                      {insight.category}
                    </p>
                    <h3>
                      <Link href={`/insights/${insight.slug}`}>
                        {insight.title}
                      </Link>
                    </h3>
                    <p className={styles.summary}>{insight.summary}</p>
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
            <div className={styles.allInsights}>
              <Link className="button button--secondary" href="/insights">
                View all insights <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            title="No blog posts to display"
            description="No articles are currently available."
          />
        )}
      </div>
    </section>
  );
}
