import { notFound, permanentRedirect } from "next/navigation";
import { insights } from "@/app/data/insights";

type LegacyBlogArticleProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyBlogArticlePage({
  params,
}: LegacyBlogArticleProps) {
  const { id } = await params;
  const insight = insights.find((item) => item.originalId === id);

  if (!insight) notFound();

  permanentRedirect(`/insights/${insight.slug}`);
}
