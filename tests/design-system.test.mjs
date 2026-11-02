import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const globalStyles = readFileSync("app/globals.css", "utf8");
const homeContent = readFileSync(
  "app/components/home/HomeContent.tsx",
  "utf8",
);
const enquiryForm = readFileSync(
  "app/components/enquiry/EnquiryForm.tsx",
  "utf8",
);
const contentRepository = readFileSync(
  "app/data/contentRepository.ts",
  "utf8",
);
const projectData = readFileSync("app/data/projects.ts", "utf8");
const serviceData = readFileSync("app/data/services.ts", "utf8");
const testimonialData = readFileSync("app/data/testimonials.ts", "utf8");
const insightData = readFileSync("app/data/insights.ts", "utf8");
const legacyBlogRoute = readFileSync("app/blog/[id]/page.tsx", "utf8");

test("brand colors and typography are centralized", () => {
  for (const token of [
    "--color-graphite: #252525",
    "--color-ivory: #FDF0EA",
    "--color-sand: #F9D7C6",
    "--color-brand-orange: #FF6000",
    "--color-brand-orange-hover: #E65300",
    "--color-signal: var(--color-brand-orange)",
    "--color-soft-grey: #a8b0b8",
    "--color-primary: var(--color-graphite)",
    "--color-accent: var(--color-signal)",
    "--color-background: var(--color-ivory)",
    "--color-whatsapp: #25d366",
    "--color-whatsapp-hover: #1da851",
    "--font-heading:",
    "--font-body:",
  ]) {
    assert.ok(globalStyles.includes(token), `Missing design token: ${token}`);
  }

  assert.ok(!globalStyles.includes("#e98724"), "Old orange token remains.");
});

test("responsive type, spacing, and container scales are available", () => {
  for (const token of [
    "--font-size-hero:",
    "--font-size-page-title:",
    "--space-section:",
    "--container-gutter:",
    "--container-content:",
    "--container-wide:",
  ]) {
    assert.ok(globalStyles.includes(token), `Missing design token: ${token}`);
  }

  assert.match(globalStyles, /@media \(min-width: 48\.0625rem\)/);
  assert.match(globalStyles, /@media \(min-width: 64rem\)/);
});

test("accessibility focus and reduced-motion styles are present", () => {
  assert.match(globalStyles, /:focus-visible/);
  assert.match(globalStyles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("homepage sections follow the requested content order", () => {
  const sections = [
    "<Hero />",
    "<AboutIntroduction />",
    "<HomeExpertise />",
    "<HomeMissionVision />",
    "<HomeCoreValues />",
    '<section className={`section ${styles.approach}`} aria-labelledby="home-approach">',
    "<HomeServices services={services} />",
    "<HomePortfolio projects={projects} />",
    "<HomeMethodology />",
    "<HomeTestimonials testimonials={testimonials} />",
    "<HomeInsights insights={insights} />",
    "<HomeFAQs />",
    "Ready to Build Your Vision?",
  ];
  const positions = sections.map((section) => homeContent.indexOf(section));

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("original portfolio, testimonial, and article entries are available", () => {
  assert.equal((projectData.match(/slug: "/g) ?? []).length, 4);
  assert.equal((testimonialData.match(/originalOrder: [1-3]/g) ?? []).length, 3);
  assert.equal((insightData.match(/originalId: "[1-4]"/g) ?? []).length, 4);
  assert.match(contentRepository, /return projects/);
  assert.match(contentRepository, /return testimonials/);
  assert.match(contentRepository, /return insights/);
  assert.match(legacyBlogRoute, /permanentRedirect\(`\/insights\/\$\{insight\.slug\}`\)/);
});

test("service catalogue preserves all 17 approved services in order", () => {
  const serviceRecords = serviceData.slice(
    serviceData.indexOf("export const services: Service[] = ["),
    serviceData.indexOf("export const legacyServiceRedirects"),
  );
  const serviceTitles = Array.from(
    serviceRecords.matchAll(/^    title: "([^"]+)",$/gm),
    (match) => match[1],
  );

  assert.deepEqual(serviceTitles, [
    "Project Management (EPCM/EPC)",
    "Auditing, Estimation & Costing",
    "Architectural Designing",
    "3D Visualization & Engineering Design",
    "Interior Designing & Execution",
    "Facade Designing & Execution",
    "Structural Designing",
    "MEP Designing & Execution",
    "HVAC Designing & Execution",
    "Solar Plant Designing & Execution",
    "Furnace Designing & Execution",
    "Clean Room Partition",
    "Industrial Flooring",
    "Water Treatment & Wastewater Treatment",
    "Pollution Air Control Systems",
    "Green Building Solutions",
    "Waterproofing Solutions",
  ]);
});

test("project cards retain a responsive two-column 4:3 image layout", () => {
  const projectCardStyles = readFileSync(
    "app/components/projects/ProjectCard.module.css",
    "utf8",
  );
  const projectCatalogueStyles = readFileSync(
    "app/projects/ProjectCatalogue.module.css",
    "utf8",
  );

  assert.match(projectCardStyles, /aspect-ratio: 4 \/ 3/);
  assert.match(projectCatalogueStyles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(projectCatalogueStyles, /@media \(max-width: 36rem\)/);
});

test("service legacy links avoid category anchors that are not rendered", () => {
  assert.doesNotMatch(serviceData, /\/services#[a-z-]+/);
});

test("WhatsApp handoff uses the requested send-message label", () => {
  assert.match(enquiryForm, /getWhatsAppHref/);
  assert.match(enquiryForm, /WhatsApp has not sent it/);
  assert.match(enquiryForm, /Send Message/);
  assert.doesNotMatch(enquiryForm, /Continue to WhatsApp/);
  assert.doesNotMatch(enquiryForm, /Your details will be shared with WhatsApp/);
});

test("enquiry forms hand off to WhatsApp without fake success messaging", () => {
  assert.match(enquiryForm, /getWhatsAppHref/);
  assert.match(enquiryForm, /WhatsApp has not sent it/);
  assert.doesNotMatch(enquiryForm, /demo-success|Thank you for your enquiry/);
});

test("quick enquiry popup does not include a message field", () => {
  const quickEnquiryForm = enquiryForm.slice(
    enquiryForm.indexOf("function QuickEnquiryForm"),
    enquiryForm.indexOf("function ContactForm"),
  );

  assert.doesNotMatch(quickEnquiryForm, /enquiry-modal-message|Project details:/);
});
