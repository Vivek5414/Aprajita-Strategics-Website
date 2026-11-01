export type Industry = {
  slug: string;
  title: string;
  description: string;
};

export const industries: Industry[] = [
  {
    slug: "industrial-facilities",
    title: "Industrial facilities",
    description:
      "Engineering and infrastructure considerations for facilities with demanding operational requirements.",
  },
  {
    slug: "commercial-built-environments",
    title: "Commercial built environments",
    description:
      "Architectural and engineering design support for functional, people-focused places.",
  },
  {
    slug: "infrastructure-projects",
    title: "Infrastructure projects",
    description:
      "Project planning and coordination for infrastructure that connects facilities, operations, and communities.",
  },
];
