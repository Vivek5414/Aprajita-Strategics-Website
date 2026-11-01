export type InsightBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      heading: string;
      items: readonly string[];
    };

export type Insight = {
  slug: string;
  originalId: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  author: string;
  readingTime: string;
  content: readonly InsightBlock[];
  tags: readonly string[];
  keywords: readonly string[];
  authorBio: string;
  image: {
    src: string;
    alt: string;
    originalUrl: string;
  };
  originalUrl: string;
};

const author = "APRAJITA STRATEGICS PRIVATE LIMITED Team";
const authorBio =
  "APRAJITA STRATEGICS PRIVATE LIMITED Team is a team of construction and architecture experts dedicated to sharing industry insights and best practices.";

export const insights: Insight[] = [
  {
    slug: "top-10-construction-trends-for-2026",
    originalId: "1",
    title: "Top 10 Construction Trends for 2026",
    summary:
      "Discover the latest innovations and trends shaping the construction industry this year. From sustainable materials to smart building technologies, learn what's transforming modern construction.",
    category: "Construction",
    publishedAt: "2026-01-15",
    author,
    readingTime: "5 min read",
    content: [
      {
        type: "paragraph",
        text: "The construction industry is rapidly evolving with new technologies and sustainable practices. In 2026, we're seeing a major shift towards green building materials, advanced project management software, and AI-powered safety solutions. These innovations are not only improving efficiency but also making construction safer and more sustainable than ever before.",
      },
      {
        type: "list",
        heading: "Key trends include:",
        items: [
          "Green Building Materials: More companies are adopting sustainable materials like recycled steel, bamboo, and eco-friendly concrete.",
          "AI-Powered Safety: Artificial intelligence is being used to predict and prevent construction accidents before they happen.",
          "Smart Buildings: IoT sensors and smart systems are being integrated into buildings for better energy management.",
          "Prefabrication: Off-site construction methods are reducing on-site work and improving quality control.",
        ],
      },
    ],
    tags: ["#construction", "#trends", "#2026"],
    keywords: [
      "construction trends 2024",
      "green building materials",
      "AI safety",
      "smart buildings",
      "construction technology",
    ],
    authorBio,
    image: {
      src: "/images/blog/construction-project-2026.webp",
      alt: "Modern building construction and architectural development.",
      originalUrl:
        "https://commons.wikimedia.org/wiki/File:Moscow,_Kvartal_Serebryany_Bor_construction,_June_2026_01.jpg",
    },
    originalUrl: "https://www.aprajitastrategics.com/blog/1",
  },
  {
    slug: "sustainable-architecture-building-for-the-future",
    originalId: "2",
    title: "Sustainable Architecture: Building for the Future",
    summary:
      "Learn how sustainable design principles can reduce environmental impact while creating beautiful and functional spaces. Explore eco-friendly materials and energy-efficient designs.",
    category: "Sustainability",
    publishedAt: "2026-02-10",
    author,
    readingTime: "6 min read",
    content: [
      {
        type: "paragraph",
        text: "Sustainable architecture is no longer a luxury but a necessity. By incorporating renewable energy sources, recycled materials, and energy-efficient systems, we can create buildings that are both environmentally responsible and cost-effective.",
      },
      {
        type: "list",
        heading: "Key sustainable practices:",
        items: [
          "Renewable Energy Integration: Solar panels, wind turbines, and geothermal systems reduce energy consumption.",
          "Water Management: Rainwater harvesting and recycling systems minimize water waste.",
          "Green Spaces: Rooftop gardens and vertical forests improve air quality and aesthetics.",
          "Energy Efficiency: High-performance insulation and smart HVAC systems reduce heating and cooling costs.",
        ],
      },
    ],
    tags: ["#sustainability", "#architecture", "#eco-friendly"],
    keywords: [
      "sustainable architecture",
      "green buildings",
      "eco-friendly design",
      "renewable energy",
      "energy efficiency",
    ],
    authorBio,
    image: {
      src: "/images/services/green-building-solutions.webp",
      alt: "Sustainable Architecture: Building for the Future",
      originalUrl:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    },
    originalUrl: "https://www.aprajitastrategics.com/blog/2",
  },
  {
    slug: "project-management-best-practices-in-construction",
    originalId: "3",
    title: "Project Management Best Practices in Construction",
    summary:
      "Master the art of construction project management with proven strategies and tools. From planning to execution, learn how to keep projects on schedule and within budget.",
    category: "Management",
    publishedAt: "2026-03-05",
    author,
    readingTime: "7 min read",
    content: [
      {
        type: "paragraph",
        text: "Effective project management is crucial for construction success. Utilizing modern project management tools, clear communication protocols, and risk assessment frameworks can significantly improve project outcomes.",
      },
      {
        type: "list",
        heading: "Best practices include:",
        items: [
          "Clear Planning: Define project scope, timeline, and budget before starting work.",
          "Regular Communication: Keep all stakeholders informed with weekly progress updates.",
          "Risk Management: Identify potential issues early and develop contingency plans.",
          "Quality Control: Implement regular inspections and testing throughout the project.",
          "Team Coordination: Ensure all teams work together seamlessly towards common goals.",
        ],
      },
    ],
    tags: ["#management", "#project", "#best-practices"],
    keywords: [
      "project management",
      "construction planning",
      "budget control",
      "risk management",
      "team coordination",
    ],
    authorBio,
    image: {
      src: "/images/blogs/construction-project-management.jpg",
      alt: "Project Management Best Practices in Construction",
      originalUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    originalUrl: "https://www.aprajitastrategics.com/blog/3",
  },
  {
    slug: "role-of-technology-in-modern-construction",
    originalId: "4",
    title: "The Role of Technology in Modern Construction",
    summary:
      "Explore how cutting-edge technology is revolutionizing the construction industry. From BIM to IoT, discover tools that enhance efficiency and safety on job sites.",
    category: "Technology",
    publishedAt: "2026-03-20",
    author,
    readingTime: "8 min read",
    content: [
      {
        type: "paragraph",
        text: "Technology is transforming construction practices worldwide. Building Information Modeling (BIM), Internet of Things (IoT) sensors, and artificial intelligence are enabling better decision-making, improved safety, and increased productivity.",
      },
      {
        type: "list",
        heading: "Key technologies:",
        items: [
          "BIM: Building Information Modeling allows teams to visualize and plan projects in 3D before construction begins.",
          "IoT Sensors: Real-time monitoring of equipment, materials, and workers improves efficiency and safety.",
          "Drones: Aerial surveys and inspections reduce time and improve accuracy.",
          "AI Analytics: Machine learning algorithms optimize scheduling, resource allocation, and cost estimation.",
          "Mobile Apps: On-site teams can access plans, communicate, and report issues in real-time.",
        ],
      },
    ],
    tags: ["#technology", "#bim", "#innovation"],
    keywords: [
      "construction technology",
      "BIM",
      "IoT sensors",
      "AI in construction",
      "drones",
      "digital transformation",
    ],
    authorBio,
    image: {
      src: "/images/blogs/construction-technology.jpg",
      alt: "The Role of Technology in Modern Construction",
      originalUrl:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    },
    originalUrl: "https://www.aprajitastrategics.com/blog/4",
  },
];
