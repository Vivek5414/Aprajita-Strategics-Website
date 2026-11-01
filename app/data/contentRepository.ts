import { industries, type Industry } from "./industries";
import { insights, type Insight } from "./insights";
import { projects, type Project } from "./projects";
import {
  serviceCategories,
  services,
  type Service,
  type ServiceCategory,
} from "./services";
import { testimonials, type Testimonial } from "./testimonials";

export interface ContentRepository {
  getServiceCategories(): Promise<readonly ServiceCategory[]>;
  getServices(): Promise<readonly Service[]>;
  getService(slug: string): Promise<Service | undefined>;
  getIndustries(): Promise<readonly Industry[]>;
  getProjects(): Promise<readonly Project[]>;
  getTestimonials(): Promise<readonly Testimonial[]>;
  getInsights(): Promise<readonly Insight[]>;
}

export const contentRepository: ContentRepository = {
  async getServiceCategories() {
    return serviceCategories;
  },
  async getServices() {
    return services;
  },
  async getService(slug) {
    return services.find((service) => service.slug === slug);
  },
  async getIndustries() {
    return industries;
  },
  async getProjects() {
    return projects;
  },
  async getTestimonials() {
    return testimonials;
  },
  async getInsights() {
    return insights;
  },
};
