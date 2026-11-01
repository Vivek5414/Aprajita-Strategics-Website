# Original Content Migration Inventory

Source: [APRAJITA STRATEGICS PRIVATE LIMITED](https://www.aprajitastrategics.com/)

## Migration checklist

| Area | Source entries found | Migrated | Local images | Detail pages |
|---|---:|---:|---:|---:|
| Portfolio | 4 | 4 | 4 shared project photographs | Homepage section |
| Projects | 4 | 4 | 4 | 4 |
| Client feedback | 3 | 3 | 0; source displayed no profile photographs | Homepage section |
| Blog articles | 4 | 4 | 3 unique cover images | 4 |

The source site had no pagination for the inspected project or blog listings. The homepage portfolio and `/projects` catalogue contain the same four projects, but the Projects page additionally has category filters and detail links; both surfaces are preserved rather than treated as separate project datasets.

## Portfolio and projects

Source portfolio: [Homepage](https://www.aprajitastrategics.com/) — “Our Portfolio” / “Featured Projects”. The homepage displays the same four projects as [Projects](https://www.aprajitastrategics.com/projects). The Projects page filters are All Projects, Commercial Design, Residential Planning, Structural Engineering, and Architectural Planning.

The descriptions, category, location, year, client, budget, project features, ordering and source-image URLs are represented in [`app/data/projects.ts`](./app/data/projects.ts). Source image files have been downloaded into `public/images/projects/`; the homepage portfolio reuses those same files rather than duplicating the photographs.

### 1. Shivam Business Tower

- **Category:** Commercial Design
- **Location:** BKC, Mumbai, Maharashtra
- **Year:** 2024
- **Client:** Shivam Infrastructure Pvt. Ltd.
- **Budget:** ₹320 Crore
- **Duration:** 24 Months
- **Description:** Shivam Business Tower is a 22-story Grade-A commercial building featuring premium office spaces, retail outlets, smart security systems, and energy-efficient infrastructure. The project is designed to meet IGBC Green Building standards.
- **Key features:** 22-Story Commercial Tower; IGBC Green Building Design; Smart Security & Access Control; Premium Office Spaces; Retail Shops & Food Court; Rooftop Cafeteria.
- **Original project page:** [/projects/shivam-business-tower](https://www.aprajitastrategics.com/projects/shivam-business-tower)
- **Original image:** `https://www.aprajitastrategics.com/image/project1.webp`
- **Migrated image:** [`public/images/projects/shivam-business-tower.webp`](./public/images/projects/shivam-business-tower.webp)

### 2. Green Valley Villas

- **Category:** Residential Planning
- **Location:** Indore, Madhya Pradesh
- **Year:** 2023
- **Client:** Green Valley Developers
- **Budget:** ₹180 Crore
- **Duration:** 30 Months
- **Description:** Green Valley Villas is a residential township consisting of 60 luxury villas with spacious interiors, private gardens, clubhouse facilities, children's play area, and eco-friendly infrastructure.
- **Key features:** 60 Luxury Villas; Gated Community; Clubhouse & Swimming Pool; Landscaped Gardens; 24×7 Security; Children's Park.
- **Original project page:** [/projects/green-valley-villas](https://www.aprajitastrategics.com/projects/green-valley-villas)
- **Original image:** `https://www.aprajitastrategics.com/image/project2.webp`
- **Migrated image:** [`public/images/projects/green-valley-villas.webp`](./public/images/projects/green-valley-villas.webp)

### 3. Bharat IT Park

- **Category:** Structural Engineering
- **Location:** Electronic City, Bengaluru, Karnataka
- **Year:** 2025
- **Client:** Bharat Tech Developers Ltd.
- **Budget:** ₹250 Crore
- **Duration:** 20 Months
- **Description:** Bharat IT Park consists of four modern office buildings equipped with collaborative workspaces, data centers, conference halls, incubation labs, and sustainable building systems.
- **Key features:** 4 Office Towers; Co-working Spaces; Innovation & Startup Labs; High-Speed Fiber Network; Conference & Training Centers; Food Court & Recreation Zone.
- **Original project page:** [/projects/bharat-it-park](https://www.aprajitastrategics.com/projects/bharat-it-park)
- **Original image:** `https://www.aprajitastrategics.com/image/project3.webp`
- **Migrated image:** [`public/images/projects/bharat-it-park.webp`](./public/images/projects/bharat-it-park.webp)

### 4. Kerala Backwater Resort

- **Category:** Architectural Planning
- **Location:** Alappuzha, Kerala
- **Year:** 2025
- **Client:** Nature India Hospitality Pvt. Ltd.
- **Budget:** ₹400 Crore
- **Duration:** 32 Months
- **Description:** Kerala Backwater Resort features 140 luxury rooms, private cottages, Ayurvedic wellness center, restaurants, and renewable energy systems, providing a perfect blend of comfort and sustainability.
- **Key features:** 140 Luxury Rooms; Ayurvedic Spa; Multi-Cuisine Restaurants; Infinity Swimming Pool; Solar Power System; Organic Farming Area.
- **Original project page:** [/projects/kerala-backwater-resort](https://www.aprajitastrategics.com/projects/kerala-backwater-resort)
- **Original image:** `https://www.aprajitastrategics.com/image/project4.webp`
- **Migrated image:** [`public/images/projects/kerala-backwater-resort.webp`](./public/images/projects/kerala-backwater-resort.webp)

Each source project detail page displayed its description, six key features, year, client, budget and duration, and one hero photograph. No additional project gallery, scope, challenge, or approach content was present in the inspected detail pages.

## Client feedback

Source: homepage **Client Feedback** section, in displayed order. The source did not display profile photographs or a designation/organization beyond the role and location shown below. The exact quotations and attribution are in [`app/data/testimonials.ts`](./app/data/testimonials.ts).

1. **Rajesh Kumar — CEO, Mumbai Enterprises:** “APRAJITA STRATEGICS PRIVATE LIMITED transformed our vision into an architectural masterpiece. The structural integrity and attention to detail were second to none.”
2. **Priya Sharma — Property Developer, Delhi:** “Working with the APRAJITA STRATEGICS PRIVATE LIMITED team was seamless. Their project management kept us on budget while delivering premium results.”
3. **Anita Gupta — Homeowner, Bangalore:** “They built our dream home. The 3D visualization helped us see everything beforehand, and the final result was even better.”

No separate testimonial detail route or source carousel was found; all three are represented as static cards on the homepage.

## Blogs and latest insights

Source listing: [Blog](https://www.aprajitastrategics.com/blog), headed “All Blog Posts” with the introduction “Explore our latest articles on construction, architecture, and industry insights”. Original article routes `/blog/1`–`/blog/4` redirect to the migrated articles at `/insights/{slug}`. Article data is in [`app/data/insights.ts`](./app/data/insights.ts), including the complete source paragraphs, lists, metadata, tags, keywords, author bio, image provenance and source URL.

### 1. Top 10 Construction Trends for 2026

- **Category:** Construction
- **Date / author / reading time:** January 15, 2026 / APRAJITA STRATEGICS PRIVATE LIMITED Team / 5 min read
- **Original article:** [/blog/1](https://www.aprajitastrategics.com/blog/1)
- **Cover:** `https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80` → [`public/images/blogs/construction-trends-and-sustainable-architecture.jpg`](./public/images/blogs/construction-trends-and-sustainable-architecture.jpg)
- **Summary:** Discover the latest innovations and trends shaping the construction industry this year. From sustainable materials to smart building technologies, learn what's transforming modern construction.
- **Full body:** The construction industry is rapidly evolving with new technologies and sustainable practices. In 2026, we're seeing a major shift towards green building materials, advanced project management software, and AI-powered safety solutions. These innovations are not only improving efficiency but also making construction safer and more sustainable than ever before.
- **Key trends include:** Green Building Materials: More companies are adopting sustainable materials like recycled steel, bamboo, and eco-friendly concrete. AI-Powered Safety: Artificial intelligence is being used to predict and prevent construction accidents before they happen. Smart Buildings: IoT sensors and smart systems are being integrated into buildings for better energy management. Prefabrication: Off-site construction methods are reducing on-site work and improving quality control.
- **Tags:** #construction, #trends, #2026
- **Keywords:** construction trends 2024, green building materials, AI safety, smart buildings, construction technology

### 2. Sustainable Architecture: Building for the Future

- **Category:** Sustainability
- **Date / author / reading time:** February 10, 2026 / APRAJITA STRATEGICS PRIVATE LIMITED Team / 6 min read
- **Original article:** [/blog/2](https://www.aprajitastrategics.com/blog/2)
- **Cover:** `https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80` → [`public/images/blogs/construction-trends-and-sustainable-architecture.jpg`](./public/images/blogs/construction-trends-and-sustainable-architecture.jpg)
- **Summary:** Learn how sustainable design principles can reduce environmental impact while creating beautiful and functional spaces. Explore eco-friendly materials and energy-efficient designs.
- **Full body:** Sustainable architecture is no longer a luxury but a necessity. By incorporating renewable energy sources, recycled materials, and energy-efficient systems, we can create buildings that are both environmentally responsible and cost-effective.
- **Key sustainable practices:** Renewable Energy Integration: Solar panels, wind turbines, and geothermal systems reduce energy consumption. Water Management: Rainwater harvesting and recycling systems minimize water waste. Green Spaces: Rooftop gardens and vertical forests improve air quality and aesthetics. Energy Efficiency: High-performance insulation and smart HVAC systems reduce heating and cooling costs.
- **Tags:** #sustainability, #architecture, #eco-friendly
- **Keywords:** sustainable architecture, green buildings, eco-friendly design, renewable energy, energy efficiency

### 3. Project Management Best Practices in Construction

- **Category:** Management
- **Date / author / reading time:** March 5, 2026 / APRAJITA STRATEGICS PRIVATE LIMITED Team / 7 min read
- **Original article:** [/blog/3](https://www.aprajitastrategics.com/blog/3)
- **Cover:** `https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80` → [`public/images/blogs/construction-project-management.jpg`](./public/images/blogs/construction-project-management.jpg)
- **Summary:** Master the art of construction project management with proven strategies and tools. From planning to execution, learn how to keep projects on schedule and within budget.
- **Full body:** Effective project management is crucial for construction success. Utilizing modern project management tools, clear communication protocols, and risk assessment frameworks can significantly improve project outcomes.
- **Best practices include:** Clear Planning: Define project scope, timeline, and budget before starting work. Regular Communication: Keep all stakeholders informed with weekly progress updates. Risk Management: Identify potential issues early and develop contingency plans. Quality Control: Implement regular inspections and testing throughout the project. Team Coordination: Ensure all teams work together seamlessly towards common goals.
- **Tags:** #management, #project, #best-practices
- **Keywords:** project management, construction planning, budget control, risk management, team coordination

### 4. The Role of Technology in Modern Construction

- **Category:** Technology
- **Date / author / reading time:** March 20, 2026 / APRAJITA STRATEGICS PRIVATE LIMITED Team / 8 min read
- **Original article:** [/blog/4](https://www.aprajitastrategics.com/blog/4)
- **Cover:** `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80` → [`public/images/blogs/construction-technology.jpg`](./public/images/blogs/construction-technology.jpg)
- **Summary:** Explore how cutting-edge technology is revolutionizing the construction industry. From BIM to IoT, discover tools that enhance efficiency and safety on job sites.
- **Full body:** Technology is transforming construction practices worldwide. Building Information Modeling (BIM), Internet of Things (IoT) sensors, and artificial intelligence are enabling better decision-making, improved safety, and increased productivity.
- **Key technologies:** BIM: Building Information Modeling allows teams to visualize and plan projects in 3D before construction begins. IoT Sensors: Real-time monitoring of equipment, materials, and workers improves efficiency and safety. Drones: Aerial surveys and inspections reduce time and improve accuracy. AI Analytics: Machine learning algorithms optimize scheduling, resource allocation, and cost estimation. Mobile Apps: On-site teams can access plans, communicate, and report issues in real-time.
- **Tags:** #technology, #bim, #innovation
- **Keywords:** construction technology, BIM, IoT sensors, AI in construction, drones, digital transformation

Each inspected source article had one cover image, its article body, tags, keywords, an About Author section, a share control, and the CTA “Have a question about construction projects?” with “Contact Us Today”. No additional in-body article photographs were present. Articles 1 and 2 reused the same cover image. The source `/#contact` CTA target maps to the new `/contact` route; the original homepage `#projects`, `#testimonials`, and `#contact` anchors are supported.

## Completeness, permission and image notes

- **Missing accessible source pages:** None identified among the four listed projects and their detail routes, three homepage testimonials, or four listed articles and their detail routes.
- **Missing project images:** 0 of 4. Each source project had one hero image; no separate gallery images were displayed.
- **Missing blog images:** 0 of 3 unique cover images. No separate in-body images were displayed.
- **Missing testimonial photographs:** The original testimonials did not display client photographs; none have been fabricated or substituted.
- **Permission review before publication:** Confirm permission to republish project/client names, project budgets, testimonial quotations and attributions. Confirm rights/licensing for all original site content and the three Unsplash cover images. Public display on the source site is not proof of republication rights.
- **Source URL access:** The project listing, all four project detail pages, homepage testimonials, blog listing, and all four blog article pages were inspected. The original article URLs are retained as redirects; source pages remain the attribution references in the data.
- **Known source-data anomaly preserved:** Article 1's original keyword is “construction trends 2024” although the article title is for 2026. It is not silently corrected.
