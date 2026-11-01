export type HomepageExpertise = {
  title:
    | "Architectural Planning"
    | "Structural Engineering"
    | "Project Management"
    | "Sustainability"
    | "BIM Technology"
    | "Quality Assurance";
  description: string;
};

export const homepageExpertise: HomepageExpertise[] = [
  {
    title: "Architectural Planning",
    description: "Innovative designs that blend aesthetics with functionality.",
  },
  {
    title: "Structural Engineering",
    description:
      "Advanced structural analysis and design for residential and commercial projects.",
  },
  {
    title: "Project Management",
    description:
      "Seamless coordination from conception to completion.",
  },
  {
    title: "Sustainability",
    description:
      "Eco-friendly solutions for modern construction challenges.",
  },
  {
    title: "BIM Technology",
    description:
      "Building Information Modeling for precision and efficiency.",
  },
  {
    title: "Quality Assurance",
    description:
      "Rigorous quality control at every stage of development.",
  },
];

export const homepageMission = {
  title: "Our Mission",
  paragraphs: [
    "To deliver exceptional architectural and engineering solutions that combine innovation, sustainability, and excellence, while maintaining the highest standards of professional integrity and client satisfaction.",
  ],
};

export const homepageVision = {
  title: "Our Vision",
  paragraphs: [
    "To be recognized as the leading consultancy in transforming architectural visions into reality, setting industry benchmarks for quality, innovation, and sustainable development across all project scales.",
  ],
};

export const homepageValues = [
  {
    title: "Innovation",
    description: "Cutting-edge solutions that push architectural boundaries.",
  },
  {
    title: "Quality",
    description: "Uncompromising standards in every project delivered.",
  },
  {
    title: "Collaboration",
    description:
      "Partnering with clients to realize their vision.",
  },
  {
    title: "Excellence",
    description:
      "A commitment to high professional standards across disciplines.",
  },
] as const;

export const originalHomepageClaimsForReview = {
  status: "unverified" as const,
  claims: [
    "Award-winning consultancy",
    "Award-winning expertise across all disciplines",
    "15+ years experience",
    "250+ projects completed",
    "50+ expert engineers",
    "On-time and within-budget delivery",
    "Industry awards and recognitions",
    "Premium Architectural Design",
    "Sustainable Engineering",
    "End-to-End Project Management",
    "Stringent Quality Control",
    "Decades of combined team experience",
  ],
};
