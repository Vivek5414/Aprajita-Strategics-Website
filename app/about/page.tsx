import type { Metadata } from "next";
import {
  Award,
  Boxes,
  Building2,
  ClipboardList,
  Compass,
  DraftingCompass,
  Leaf,
  Lightbulb,
  Network,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageIntro from "@/app/components/content/PageIntro";
import PageCta from "@/app/components/content/PageCta";
import SectionHeading from "@/app/components/ui/SectionHeading";
import AboutPageReveal from "./AboutPageReveal";
import styles from "./AboutPage.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about APRAJITA STRATEGICS PRIVATE LIMITED, its engineering and architectural expertise, purpose, values, and project approach.",
};

type AboutCardContent = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const expertise: AboutCardContent[] = [
  {
    title: "Architectural Planning",
    description:
      "Developing architectural concepts and planning solutions that consider space utilization, functionality, aesthetics and project objectives.",
    icon: DraftingCompass,
  },
  {
    title: "Structural Engineering",
    description:
      "Addressing structural design requirements through engineering principles, technical assessment and consideration of safety and performance.",
    icon: Building2,
  },
  {
    title: "Project Management",
    description:
      "Supporting project planning, coordination and management activities with attention to scope, resources, timelines and execution requirements.",
    icon: ClipboardList,
  },
  {
    title: "Sustainability",
    description:
      "Considering resource efficiency, environmental impact and sustainable practices as part of appropriate project planning and design decisions.",
    icon: Leaf,
  },
  {
    title: "BIM Technology",
    description:
      "Using Building Information Modelling concepts and digital coordination approaches to support design visualization and multidisciplinary collaboration.",
    icon: Boxes,
  },
  {
    title: "Quality Assurance",
    description:
      "Emphasizing technical review, design coordination and quality-focused processes throughout relevant project stages.",
    icon: ShieldCheck,
  },
];

const values: AboutCardContent[] = [
  {
    title: "Innovation",
    description:
      "We remain open to new ideas, evolving technologies and practical approaches that can improve the way projects are planned and developed.",
    icon: Lightbulb,
  },
  {
    title: "Quality",
    description:
      "We emphasize attention to detail, technical understanding and consistency in our professional work.",
    icon: ShieldCheck,
  },
  {
    title: "Collaboration",
    description:
      "We value clear communication and coordination between clients, consultants, technical teams and other project stakeholders.",
    icon: UsersRound,
  },
  {
    title: "Excellence",
    description:
      "We aim to maintain high professional standards through continuous learning, responsible decisions and a commitment to improvement.",
    icon: Award,
  },
];

const purposeCards: AboutCardContent[] = [
  {
    title: "Our Mission",
    description:
      "To provide thoughtful architectural, engineering and project consultancy services that respond to client requirements through technical understanding, practical planning and professional integrity. We aim to approach every assignment with attention to detail, coordinated thinking and a clear understanding of the project objectives.",
    icon: Target,
  },
  {
    title: "Our Vision",
    description:
      "To build lasting professional relationships through responsible engineering, considered design and a consistent commitment to project requirements. We aspire to contribute to functional, efficient and well-planned built environments through multidisciplinary expertise and continuous improvement.",
    icon: Compass,
  },
];

function AboutCard({
  item,
  index,
  className = "",
}: {
  item: AboutCardContent;
  index: number;
  className?: string;
}) {
  const Icon = item.icon;

  return (
    <AboutPageReveal className={styles.cardReveal}>
      <article className={`${styles.card} ${className}`}>
        <span className={styles.cardNumber} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.iconFrame} aria-hidden="true">
          <Icon size={28} strokeWidth={1.6} />
        </span>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <span className={styles.cardRule} aria-hidden="true" />
      </article>
    </AboutPageReveal>
  );
}

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <PageIntro
        eyebrow="About APRAJITA STRATEGICS"
        title="Engineering Knowledge With a Practical Project Perspective."
        description="APRAJITA STRATEGICS PRIVATE LIMITED brings architectural, engineering and project consultancy perspectives to a broad range of development requirements."
      />

      <section className={`section ${styles.story}`}>
        <div className={`container ${styles.storyGrid}`}>
          <AboutPageReveal className={styles.storyHeading}>
            <SectionHeading
              eyebrow="Who we are"
              title="A Project-Oriented Engineering Consultancy."
            />
          </AboutPageReveal>
          <AboutPageReveal className={styles.storyCopy}>
            <div className="prose">
              <p>
                Our work spans architectural planning, structural engineering,
                industrial infrastructure, building systems and project
                management. Each assignment is approached with attention to its
                purpose, technical requirements and practical constraints.
              </p>
              <p>
                By bringing different engineering disciplines into
                consideration, we aim to develop solutions that balance
                functionality, design intent and project requirements. From
                initial planning and design to technical coordination and
                execution-related support, our focus remains on thoughtful,
                structured and project-oriented professional services.
              </p>
            </div>
          </AboutPageReveal>
        </div>
      </section>

      <section className={`section ${styles.expertise}`}>
        <div className="container">
          <AboutPageReveal className={styles.sectionHeading}>
            <SectionHeading
              eyebrow="Our expertise"
              title="Multidisciplinary Knowledge. Practical Engineering Solutions."
              description="Our areas of expertise cover disciplines involved in planning, designing and developing built environments. We consider technical understanding alongside practical project requirements."
            />
          </AboutPageReveal>
          <div className={styles.expertiseGrid}>
            {expertise.map((item, index) => (
              <AboutCard item={item} index={index} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.purpose}`}>
        <div className="container">
          <AboutPageReveal className={styles.sectionHeading}>
            <SectionHeading eyebrow="Our purpose" title="Mission & Vision" />
          </AboutPageReveal>
          <div className={styles.purposeGrid}>
            {purposeCards.map((item, index) => (
              <AboutCard
                className={styles.purposeCard}
                item={item}
                index={index}
                key={item.title}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.values}`}>
        <div className="container">
          <AboutPageReveal className={styles.sectionHeading}>
            <SectionHeading
              eyebrow="What guides us"
              title="The Principles Behind Our Work."
              description="Our values shape how we approach projects, work with clients and make professional decisions."
            />
          </AboutPageReveal>
          <div className={styles.valuesGrid}>
            {values.map((item, index) => (
              <AboutCard item={item} index={index} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.approach}`}>
        <div className="container">
          <AboutPageReveal className={styles.approachPanel}>
            <Network
              className={styles.approachIcon}
              size={32}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <SectionHeading
              eyebrow="Our approach"
              title="An Integrated Perspective on Every Project."
              description="Successful projects depend on clear planning, informed design decisions and effective coordination across disciplines. We work to keep these considerations connected to project objectives and agreed responsibilities."
            />
          </AboutPageReveal>
        </div>
      </section>

      <PageCta
        title="Let's discuss your project requirements."
        description="Share your objectives and the kind of architectural, engineering or consultancy support you are considering."
        linkLabel="Request a consultation"
        href="/contact"
        openEnquiry
      />
    </main>
  );
}
