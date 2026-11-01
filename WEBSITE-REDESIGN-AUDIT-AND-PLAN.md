# APRAJITA STRATEGICS Website Redesign Audit and Plan

## Audit scope and evidence

Inspected the App Router page files, homepage composition, shared layout and UI components, CSS Modules, content data, image assets, project filters, FAQ interaction, mobile navigation, enquiry form, metadata, and the existing content migration inventory. The project is Next.js 16.4.3, React 19.3.1, TypeScript 6.0.3, and CSS Modules; it uses Manrope and Inter through `next/font`, `next/image`, and Lucide React. No Tailwind CSS or animation dependency is installed.

The existing site has a clear navy, cyan, and white token system and responsive CSS variables. Its visual language is consistent but largely conventional: light sections alternate with muted backgrounds, section introductions share a pattern, and several page grids rely on repeated rectangular cards. Existing interactions include responsive navigation, enquiry modal and WhatsApp handoff, project category filters, homepage FAQ accordion, responsive links, and a Google Maps location preview on Contact.

## Routes and functional boundaries

| Route | Existing content and behavior |
|---|---|
| `/` | Hero, statistics, About introduction, expertise, mission/vision, values, Why Choose Us, services, portfolio, methodology, testimonials, insights, FAQs, consultation CTA |
| `/about` | Company introduction, expertise, mission/vision, values, approach, consultation CTA |
| `/services` | Service catalogue |
| `/services/[slug]` | Service detail, scope, capabilities, applications, related services, enquiry CTA; legacy slugs redirect |
| `/industries` | Industry/environment catalogue |
| `/projects` | Project catalogue with working category filters |
| `/projects/[slug]` | Project detail and metadata |
| `/insights` | Article catalogue |
| `/insights/[slug]` | Article detail, share interaction, previous/next navigation |
| `/contact` | Contact details, phone/WhatsApp actions, enquiry form, location map, consultation CTA |
| `/admin` | Informational placeholder; no authentication or admin service |
| `/blog` and `/blog/[id]` | Legacy routes redirect to Insights |

No separate portfolio route, privacy/terms pages, or `app/api` endpoints were found. Do not invent these routes, services, claims, or functionality as part of a visual-only redesign.

## Content inventory and source of truth

Content is kept primarily in typed files under `app/data/`, and is rendered through page and section components rather than duplicated at each surface.

| Content | Existing inventory | Source |
|---|---:|---|
| Services | 17, ordered catalogue | `app/data/services.ts` |
| Service categories | 4 | `app/data/services.ts` |
| Projects | 4, with project detail data | `app/data/projects.ts` |
| Testimonials | 3 | `app/data/testimonials.ts` |
| Insights/articles | 4, including article body and metadata | `app/data/insights.ts` |
| Industries | 3 | `app/data/industries.ts` |
| Homepage expertise areas | 6 | `app/data/homepage.ts` |
| Homepage core values | 4 | `app/data/homepage.ts` |
| Homepage FAQs | 4 | `app/data/faqs.ts` |
| Methodology steps | 6 | `app/components/home/HomeMethodology.tsx` |
| Statistics | 3 | `app/components/home/StatisticsSection.tsx` |
| Contact and navigation | Typed records | `app/data/contact.ts`, `app/data/site.ts` |

`CONTENT-MIGRATION-INVENTORY.md` contains the existing source inventory for projects, testimonials, and blogs. Preserve text and ordering by continuing to render the existing data; do not copy-edit data during the redesign. Its notes about verifying project claims and testimonial publication permissions remain relevant.

## Shared components and design dependencies

- `app/layout.tsx` owns global fonts, metadata defaults, the header, footer, enquiry provider, and floating contact actions.
- Shared layout/UI components are in `app/components/layout/`, `app/components/content/`, and `app/components/ui/`.
- Homepage sections are separate components and CSS Modules in `app/components/home/`; services and project cards also have dedicated components and modules.
- Route-level CSS Modules exist for Services, Service Detail, Projects, Project Detail, Insights, Article Detail, Contact, and Admin.
- `app/globals.css` supplies colors, type scale, spacing, containers, radii, shadows, buttons, focus styles, and responsive breakpoints. A global token change will affect every route and must be checked across the site.
- Existing visual assets include the official logo, hero photograph, homepage building infographic, four project photographs, service illustrations/photographs, and blog cover images under `public/images/`.

## Risks and verification gaps

- Shared token, header, or footer changes can shift every page; keep page-specific compositions in route CSS Modules and regression-check the route set.
- The site has a small Node test suite (`tests/design-system.test.mjs`) but no dedicated browser visual regression suite.
- Contact and enquiry forms hand off through WhatsApp; there is no form backend. `/admin` is not a functional admin interface.
- The supplied project and testimonial data includes publication notes; visual work must not imply independent verification or add unapproved claims.
- Existing `next/font` configuration already uses Manrope and Inter. Reuse it rather than adding font dependencies.

## Proposed visual system

Use the requested design direction as a measured, tokenized evolution rather than a blanket recolor:

- Graphite Black `#111820` for selected dark editorial sections and footer.
- Warm Ivory `#F4F1EA` and Pure White for alternating page surfaces.
- Architectural Sand `#D8D0C2` and Soft Grey `#A8B0B8` for restrained borders and supporting surfaces.
- Signal Amber `#F5A623` for selective emphasis and interaction states.
- Preserve the official logo, Manrope headings, Inter body text, existing WhatsApp brand green, and the existing phone/contact behavior.

Use existing token and CSS Module patterns; avoid a new animation package. Motion should be restrained, preferably CSS-only or section-local IntersectionObserver, and honor `prefers-reduced-motion`.

## Staged implementation plan

1. **Design tokens and shared shell** — add named tokens for the proposed palette and editorial typography; redesign the header, mobile navigation, footer, and shared content primitives without altering labels, routes, or interaction logic.
2. **Homepage** — restyle existing sections in their current order with distinct editorial compositions; preserve every existing section, statistic, expertise item, service/project entry, FAQ, and CTA.
3. **Catalogue pages** — redesign Services, Industries, Projects, and Insights listings, retaining service order, project filters, original assets, and article links.
4. **Detail and contact pages** — redesign service/project/article detail layouts and Contact while preserving all source data, metadata, navigation, map, forms, and sharing behavior.
5. **About and Admin routes** — give About a distinct editorial layout; style `/admin` as the existing unavailable-access placeholder without introducing authentication or admin functionality.
6. **Responsive and quality review** — check all existing routes at desktop, tablet, and mobile widths; verify content/order and interactions; run tests, lint, typecheck, and production build. Do not create privacy/terms pages or other missing product functionality without approved content and scope.

## Current implementation status

This audit and proposal make no application code or design changes. The implementation is pending confirmation of the design direction and staged plan.
