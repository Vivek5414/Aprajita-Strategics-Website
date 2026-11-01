import SectionHeading from "@/app/components/ui/SectionHeading";
import styles from "./HomeMethodology.module.css";

const steps = [
  {
    title: "Consultation",
    description:
      "Understand the client's requirements, project objectives, expectations and initial considerations.",
  },
  {
    title: "Planning",
    description:
      "Assess project requirements and establish a direction for planning, technical coordination and resource considerations.",
  },
  {
    title: "Design",
    description:
      "Develop relevant architectural and engineering design solutions based on agreed requirements and project specifications.",
  },
  {
    title: "Approval",
    description:
      "Coordinate relevant design information and address feedback as required by the project review and approval process.",
  },
  {
    title: "Execution",
    description:
      "Support applicable execution and coordination activities in accordance with the agreed project scope and responsibilities.",
  },
  {
    title: "Delivery",
    description:
      "Bring relevant project activities toward completion, with attention to agreed requirements, documentation and coordination.",
  },
] as const;

export default function HomeMethodology() {
  return (
    <section
      className={`section ${styles.section}`}
      aria-labelledby="home-methodology"
    >
      <div className="container">
        <SectionHeading
          eyebrow="How we work"
          title="Our Methodology"
          description="Every project requires a clear understanding of its objectives, technical requirements and development process. Our methodology follows a structured sequence intended to support informed decisions, effective coordination and organized project progression."
          id="home-methodology"
        />
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        <p className={styles.closing}>
          A clear process helps bring structure to complex requirements and
          keeps project objectives at the centre of every stage.
        </p>
      </div>
    </section>
  );
}
