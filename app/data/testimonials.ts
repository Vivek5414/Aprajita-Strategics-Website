export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  organization: string;
  avatarInitial: string;
  originalOrder: number;
  originalUrl: string;
  profileImage?: {
    src: string;
    alt: string;
  };
  publicationNote: string;
};

const originalTestimonialsUrl = "https://www.aprajitastrategics.com/";
const reviewPublicationNote =
  "Confirm quotation attribution and permission to republish before production release.";

export const testimonials: Testimonial[] = [
  {
    quote:
      '"APRAJITA STRATEGICS PRIVATE LIMITED transformed our vision into an architectural masterpiece. The structural integrity and attention to detail were second to none."',
    name: "Rajesh Kumar",
    role: "CEO",
    organization: "Mumbai Enterprises",
    avatarInitial: "R",
    originalOrder: 1,
    originalUrl: originalTestimonialsUrl,
    publicationNote: reviewPublicationNote,
  },
  {
    quote:
      '"Working with the APRAJITA STRATEGICS PRIVATE LIMITED team was seamless. Their project management kept us on budget while delivering premium results."',
    name: "Priya Sharma",
    role: "Property Developer",
    organization: "Delhi",
    avatarInitial: "P",
    originalOrder: 2,
    originalUrl: originalTestimonialsUrl,
    publicationNote: reviewPublicationNote,
  },
  {
    quote:
      '"They built our dream home. The 3D visualization helped us see everything beforehand, and the final result was even better."',
    name: "Anita Gupta",
    role: "Homeowner",
    organization: "Bangalore",
    avatarInitial: "A",
    originalOrder: 3,
    originalUrl: originalTestimonialsUrl,
    publicationNote: reviewPublicationNote,
  },
];
