import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { contentRepository } from "@/app/data/contentRepository";
import { insights } from "@/app/data/insights";
import ArticleShareButton from "./ArticleShareButton";
import styles from "./InsightDetail.module.css";

type InsightDetailProps = {
  params: Promise<{ slug: string }>;
};

async function findInsight(slug: string) {
  const insights = await contentRepository.getInsights();
  return insights.find((insight) => insight.slug === slug);
}

export async function generateMetadata({
  params,
}: InsightDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = await findInsight(slug);

  if (!insight) return { title: "Insight not found" };

  return {
    title: insight.title,
    description: insight.summary,
    alternates: {
      canonical: `/insights/${insight.slug}`,
    },
    openGraph: {
      title: insight.title,
      description: insight.summary,
      type: "article",
      publishedTime: insight.publishedAt,
      images: insight.image ? [insight.image.src] : undefined,
    },
  };
}

export default async function InsightDetailPage({
  params,
}: InsightDetailProps) {
  const { slug } = await params;
  const insight = await findInsight(slug);
  if (!insight || !insight.content || !insight.image) notFound();
  const index = insights.findIndex((item) => item.slug === insight.slug);
  const previous = insights[index - 1];
  const next = insights[index + 1];

  const date = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${insight.publishedAt}T00:00:00Z`));

  return (
    <article className={styles.article}>
      <div className="container">
        <Link className={styles.backLink} href="/insights">
          <ArrowLeft size={17} aria-hidden="true" />
          All insights
        </Link>
        <header className={styles.header}>
          <p className={styles.category}>{insight.category}</p>
          <h1>{insight.title}</h1>
          <p className={styles.summary}>{insight.summary}</p>
          <p className={styles.byline}>
            {date}
            {insight.author ? ` · ${insight.author}` : ""}
            {insight.readingTime ? ` · ${insight.readingTime}` : ""}
          </p>
        </header>
        <figure className={styles.heroImage}>
          <Image
            src={insight.image.src}
            alt={insight.image.alt}
            fill
            priority
            sizes="(max-width: 64rem) 100vw, 80rem"
          />
        </figure>
        <div className={styles.content}>
          {insight.content.map((block, blockIndex) => {
            if (block.type === "paragraph") {
              return <p key={`${block.type}-${blockIndex}`}>{block.text}</p>;
            }

            return (
              <section
                className={styles.articleList}
                key={`${block.type}-${blockIndex}`}
              >
                <h2>{block.heading}</h2>
                <ul>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            );
          })}
          <div className={styles.articleMeta}>
            <h2>Tags:</h2>
            <div className={styles.tags} role="group" aria-label="Article tags">
              {insight.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <p className={styles.keywords}>
              <strong>Keywords:</strong> {insight.keywords.join(", ")}
            </p>
            <ArticleShareButton title={insight.title} />
            <h2>About Author</h2>
            <p>{insight.authorBio}</p>
          </div>
        </div>
        <section className={styles.cta}>
          <h2>Have a question about construction projects?</h2>
          <Link className="button button--primary" href="/contact">
            Contact Us Today
          </Link>
        </section>
        <nav
          className={styles.articleNavigation}
          aria-label="Article navigation"
        >
          {previous ? (
            <Link href={`/insights/${previous.slug}`}>
              <span>Previous article</span>
              {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/insights/${next.slug}`}>
              <span>Next article</span>
              {next.title}
            </Link>
          ) : null}
        </nav>
      </div>
    </article>
  );
}
