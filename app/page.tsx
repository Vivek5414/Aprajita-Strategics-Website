import type { Metadata } from "next";
import HomeContent from "@/app/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Building the Future With Precision",
  description:
    "APRAJITA STRATEGICS PRIVATE LIMITED provides architectural, engineering, project management and industrial infrastructure consultancy.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Building the Future With Precision | APRAJITA STRATEGICS",
    description:
      "Architectural, engineering, project management and industrial infrastructure consultancy.",
    url: "/",
    siteName: "APRAJITA STRATEGICS PRIVATE LIMITED",
    type: "website",
    images: [
      {
        url: "/images/engineering-hero.jpg",
        alt: "Contemporary glass office towers viewed from below",
      },
    ],
  },
};

export default function HomePage() {
  return <HomeContent />;
}
