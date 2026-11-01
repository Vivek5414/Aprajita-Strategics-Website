import { Quote } from "lucide-react";
import EmptyState from "@/app/components/content/EmptyState";
import SectionHeading from "@/app/components/ui/SectionHeading";
import type { Testimonial } from "@/app/data/testimonials";
import styles from "./HomeTestimonials.module.css";

type HomeTestimonialsProps = {
  testimonials: readonly Testimonial[];
};

export default function HomeTestimonials({
  testimonials,
}: HomeTestimonialsProps) {
  return (
    <section
      className={`section ${styles.section}`}
      id="testimonials"
      aria-labelledby="home-testimonials-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Client Feedback"
          title="What Our Clients Say"
          id="home-testimonials-title"
        />
        {testimonials.length > 0 ? (
          <div className={styles.grid}>
            {testimonials.map((testimonial) => (
              <figure className={styles.testimonial} key={testimonial.name}>
                <Quote
                  className={styles.quoteIcon}
                  aria-hidden="true"
                  size={28}
                />
                <blockquote>{testimonial.quote}</blockquote>
                <figcaption>
                  <strong>{testimonial.name}</strong>
                  <span>
                    {[testimonial.role, testimonial.organization]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No client feedback to display"
            description="No testimonial entries are currently available."
          />
        )}
      </div>
    </section>
  );
}
