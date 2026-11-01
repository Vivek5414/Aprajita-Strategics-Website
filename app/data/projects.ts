export type Project = {
  slug: string;
  title: string;
  sector: string;
  summary: string;
  location: string;
  completionYear: string;
  client: string;
  budget: string;
  duration: string;
  keyFeatures: readonly string[];
  image: {
    src: string;
    alt: string;
    objectPosition: string;
    originalUrl: string;
  };
  originalUrl: string;
  publicationNote: string;
};

export const projects: Project[] = [
  {
    slug: "shivam-business-tower",
    title: "Shivam Business Tower",
    sector: "Commercial Design",
    summary:
      "Shivam Business Tower is a 22-story Grade-A commercial building featuring premium office spaces, retail outlets, smart security systems, and energy-efficient infrastructure. The project is designed to meet IGBC Green Building standards.",
    location: "BKC, Mumbai, Maharashtra",
    completionYear: "2024",
    client: "Shivam Infrastructure Pvt. Ltd.",
    budget: "₹320 Crore",
    duration: "24 Months",
    keyFeatures: [
      "22-Story Commercial Tower",
      "IGBC Green Building Design",
      "Smart Security & Access Control",
      "Premium Office Spaces",
      "Retail Shops & Food Court",
      "Rooftop Cafeteria",
    ],
    image: {
      src: "/images/projects/shivam-business-tower.webp",
      alt: "Shivam Business Tower",
      objectPosition: "50% 50%",
      originalUrl: "https://www.aprajitastrategics.com/image/project1.webp",
    },
    originalUrl:
      "https://www.aprajitastrategics.com/projects/shivam-business-tower",
    publicationNote:
      "Confirm client-name and budget publication permissions before production release.",
  },
  {
    slug: "green-valley-villas",
    title: "Green Valley Villas",
    sector: "Residential Planning",
    summary:
      "Green Valley Villas is a residential township consisting of 60 luxury villas with spacious interiors, private gardens, clubhouse facilities, children's play area, and eco-friendly infrastructure.",
    location: "Indore, Madhya Pradesh",
    completionYear: "2023",
    client: "Green Valley Developers",
    budget: "₹180 Crore",
    duration: "30 Months",
    keyFeatures: [
      "60 Luxury Villas",
      "Gated Community",
      "Clubhouse & Swimming Pool",
      "Landscaped Gardens",
      "24×7 Security",
      "Children's Park",
    ],
    image: {
      src: "/images/projects/green-valley-villas.webp",
      alt: "Green Valley Villas",
      objectPosition: "50% 48%",
      originalUrl: "https://www.aprajitastrategics.com/image/project2.webp",
    },
    originalUrl:
      "https://www.aprajitastrategics.com/projects/green-valley-villas",
    publicationNote:
      "Confirm client-name and budget publication permissions before production release.",
  },
  {
    slug: "bharat-it-park",
    title: "Bharat IT Park",
    sector: "Structural Engineering",
    summary:
      "Bharat IT Park consists of four modern office buildings equipped with collaborative workspaces, data centers, conference halls, incubation labs, and sustainable building systems.",
    location: "Electronic City, Bengaluru, Karnataka",
    completionYear: "2025",
    client: "Bharat Tech Developers Ltd.",
    budget: "₹250 Crore",
    duration: "20 Months",
    keyFeatures: [
      "4 Office Towers",
      "Co-working Spaces",
      "Innovation & Startup Labs",
      "High-Speed Fiber Network",
      "Conference & Training Centers",
      "Food Court & Recreation Zone",
    ],
    image: {
      src: "/images/projects/bharat-it-park.webp",
      alt: "Bharat IT Park",
      objectPosition: "50% 50%",
      originalUrl: "https://www.aprajitastrategics.com/image/project3.webp",
    },
    originalUrl: "https://www.aprajitastrategics.com/projects/bharat-it-park",
    publicationNote:
      "Confirm client-name and budget publication permissions before production release.",
  },
  {
    slug: "kerala-backwater-resort",
    title: "Kerala Backwater Resort",
    sector: "Architectural Planning",
    summary:
      "Kerala Backwater Resort features 140 luxury rooms, private cottages, Ayurvedic wellness center, restaurants, and renewable energy systems, providing a perfect blend of comfort and sustainability.",
    location: "Alappuzha, Kerala",
    completionYear: "2025",
    client: "Nature India Hospitality Pvt. Ltd.",
    budget: "₹400 Crore",
    duration: "32 Months",
    keyFeatures: [
      "140 Luxury Rooms",
      "Ayurvedic Spa",
      "Multi-Cuisine Restaurants",
      "Infinity Swimming Pool",
      "Solar Power System",
      "Organic Farming Area",
    ],
    image: {
      src: "/images/projects/kerala-backwater-resort.webp",
      alt: "Kerala Backwater Resort",
      objectPosition: "50% 58%",
      originalUrl: "https://www.aprajitastrategics.com/image/project4.webp",
    },
    originalUrl:
      "https://www.aprajitastrategics.com/projects/kerala-backwater-resort",
    publicationNote:
      "Confirm client-name and budget publication permissions before production release.",
  },
];
