import Link from "next/link";
import Hero from "@/app/components/home/Hero";
import StatisticsSection from "@/app/components/home/StatisticsSection";
import AboutIntroduction from "@/app/components/home/AboutIntroduction";
import HomeExpertise from "@/app/components/home/HomeExpertise";
import HomeMissionVision from "@/app/components/home/HomeMissionVision";
import HomeCoreValues from "@/app/components/home/HomeCoreValues";
import SectionHeading from "@/app/components/ui/SectionHeading";
import EnquiryTrigger from "@/app/components/enquiry/EnquiryTrigger";
import HomeServices from "@/app/components/services/HomeServices";
import HomePortfolio from "./HomePortfolio";
import HomeMethodology from "./HomeMethodology";
import HomeTestimonials from "./HomeTestimonials";
import HomeInsights from "./HomeInsights";
import HomeFAQs from "./HomeFAQs";
import { contentRepository } from "@/app/data/contentRepository";
import styles from "./HomeContent.module.css";

export default async function HomeContent() {
  const [services, projects, testimonials, insights] = await Promise.all([
    contentRepository.getServices(),
    contentRepository.getProjects(),
    contentRepository.getTestimonials(),
    contentRepository.getInsights(),
  ]);

  return (
    <div className={styles.homePage}>
      <Hero />

      <StatisticsSection />

      <AboutIntroduction />

      <HomeExpertise />

      <HomeMissionVision />

      <HomeCoreValues />

      <section className={`section ${styles.approach}`} aria-labelledby="home-approach">
        <div className="container">
          <div className={styles.approachGrid}>
            <SectionHeading
              eyebrow="Why APRAJITA STRATEGICS"
              title="Why Choose APRAJITA STRATEGICS PRIVATE LIMITED?"
              id="home-approach"
              description="Choosing an engineering and consultancy partner is an important part of project planning. We focus on understanding requirements, considering relevant technical disciplines and developing practical approaches aligned with project objectives."
              light
            />
            <div className={styles.principles}>
              <article>
                <span>01</span>
                <div>
                  <h3>Multidisciplinary Perspective</h3>
                  <p>
                    Our service portfolio covers architecture, structural
                    engineering, building systems, industrial infrastructure
                    and project consultancy.
                  </p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h3>Project-Focused Planning</h3>
                  <p>
                    We consider objectives, technical requirements and
                    practical constraints before developing an appropriate
                    approach.
                  </p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <h3>Coordinated Thinking</h3>
                  <p>
                    We recognize the importance of communication and
                    coordination across the disciplines involved in a
                    project.
                  </p>
                </div>
              </article>
              <article>
                <span>04</span>
                <div>
                  <h3>Practical Engineering Solutions</h3>
                  <p>
                    We aim to balance design intent with functionality,
                    technical requirements and real-world project
                    considerations.
                  </p>
                </div>
              </article>
            </div>
          </div>
          <div className={styles.approachClosing}>
            <p>
              Our focus is not simply on providing individual services, but on
              understanding how different aspects of a project work together.
            </p>
            <EnquiryTrigger className={styles.approachAction}>
              Discuss Your Project <span aria-hidden="true">→</span>
            </EnquiryTrigger>
          </div>
        </div>
      </section>

      <HomeServices services={services} />

      <HomePortfolio projects={projects} />

      <HomeMethodology />

      <HomeTestimonials testimonials={testimonials} />

      <HomeInsights insights={insights} />

      <HomeFAQs />

      <section className={styles.contactBand} id="contact">
        <div className="container">
          <div>
            <p className={styles.contactEyebrow}>Get in touch</p>
            <h2>Ready to Build Your Vision?</h2>
            <p>
              Every project begins with an idea and a set of requirements.
              Share your objectives and start a conversation about the right
              approach for your project.
            </p>
            <span className={styles.contactSupporting}>
              Have a specific requirement? Tell us about your project.
            </span>
          </div>
          <div className={styles.contactActions}>
            <EnquiryTrigger className={styles.contactLink}>
              Request a Consultation <span aria-hidden="true">→</span>
            </EnquiryTrigger>
            <Link className={styles.contactSecondary} href="/contact">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
