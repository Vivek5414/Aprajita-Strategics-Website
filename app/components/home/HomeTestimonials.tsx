"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Quote,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [slideStep, setSlideStep] = useState(0);
  const [revealReady, setRevealReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    setRevealReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateLayout = () => {
      const width = window.innerWidth;
      const nextVisibleCount = width <= 640 ? 1 : width <= 1024 ? 2 : 3;
      setVisibleCount(nextVisibleCount);
      setActiveIndex((current) =>
        Math.min(current, Math.max(0, testimonials.length - nextVisibleCount)),
      );

      const track = viewport.querySelector<HTMLElement>("[data-testimonial-track]");
      const firstCard = track?.firstElementChild;
      if (track && firstCard instanceof HTMLElement) {
        const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
        setSlideStep(firstCard.getBoundingClientRect().width + gap);
      }
    };

    updateLayout();
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(viewport);
    window.addEventListener("resize", updateLayout);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [testimonials.length]);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);
  const goTo = (index: number) => {
    setActiveIndex(Math.min(maxIndex, Math.max(0, index)));
  };

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(maxIndex);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      pointerStartRef.current = event.clientX;
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (start === null) return;

    const distance = event.clientX - start;
    if (Math.abs(distance) > 40) {
      goTo(activeIndex + (distance < 0 ? 1 : -1));
    }
  }

  const sectionClasses = [
    "section",
    styles.section,
    revealReady ? styles.revealReady : "",
    isVisible ? styles.visible : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={sectionClasses}
      id="testimonials"
      aria-labelledby="home-testimonials-title"
      ref={sectionRef}
    >
      <div className="container">
        <div className={styles.header}>
          <div className={styles.heading}>
            <SectionHeading
              eyebrow="Client Feedback"
              title="What Our Clients Say"
              description="Perspectives shared by clients on their experience working with our team."
              id="home-testimonials-title"
            />
          </div>
          {testimonials.length > 0 ? (
            <div className={styles.controls}>
              <button
                className={styles.control}
                type="button"
                aria-label="Previous testimonials"
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
              >
                <ArrowLeft size={19} aria-hidden="true" />
              </button>
              <button
                className={styles.control}
                type="button"
                aria-label="Next testimonials"
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex >= maxIndex}
              >
                <ArrowRight size={19} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
        {testimonials.length > 0 ? (
          <div
            className={styles.carousel}
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              pointerStartRef.current = null;
            }}
          >
            <div
              className={styles.track}
              data-testimonial-track
              style={{ transform: `translate3d(-${activeIndex * slideStep}px, 0, 0)` }}
            >
              {testimonials.map((testimonial, index) => {
                const isInView =
                  index >= activeIndex && index < activeIndex + visibleCount;
                return (
                  <figure
                    className={styles.testimonial}
                    key={testimonial.name}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${testimonials.length}`}
                    aria-hidden={!isInView}
                  >
                    <div className={styles.cardTop}>
                      <span className={styles.quoteFrame}>
                        <Quote
                          className={styles.quoteIcon}
                          aria-hidden="true"
                          size={25}
                          strokeWidth={1.6}
                        />
                      </span>
                      <span className={styles.cardIndex} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <blockquote>{testimonial.quote}</blockquote>
                    <figcaption>
                      <span className={styles.avatar} aria-hidden="true">
                        {testimonial.profileImage ? (
                          <Image
                            src={testimonial.profileImage.src}
                            alt={testimonial.profileImage.alt}
                            fill
                            sizes="3.5rem"
                          />
                        ) : (
                          testimonial.avatarInitial
                        )}
                      </span>
                      <span className={styles.client}>
                        <strong>{testimonial.name}</strong>
                        <span>
                          {[testimonial.role, testimonial.organization]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
            <p className={styles.liveStatus} aria-live="polite" aria-atomic="true">
              Showing testimonials {activeIndex + 1} to{" "}
              {Math.min(activeIndex + visibleCount, testimonials.length)} of{" "}
              {testimonials.length}
            </p>
            {maxIndex > 0 ? (
              <div className={styles.pagination} aria-label="Choose testimonial page">
                {Array.from({ length: maxIndex + 1 }, (_, index) => (
                  <button
                    className={`${styles.pageDot} ${
                      activeIndex === index ? styles.pageDotActive : ""
                    }`}
                    key={index}
                    type="button"
                    aria-label={`Show testimonial page ${index + 1}`}
                    aria-current={activeIndex === index ? "true" : undefined}
                    onClick={() => goTo(index)}
                  />
                ))}
              </div>
            ) : null}
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
