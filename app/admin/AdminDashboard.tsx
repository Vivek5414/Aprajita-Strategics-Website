"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Building2,
  MessageSquareText,
  Search,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { signOutAction } from "@/app/admin/login/actions";
import { services as websiteServices } from "@/app/data/services";
import ResourceCreateForm from "./ResourceCreateForm";
import styles from "./AdminDashboard.module.css";

type CustomerStatus = "Active" | "Follow-up" | "Qualified" | "Archived";
type CustomerType = "Corporate" | "Developer" | "Homeowner" | "Institution";
type EnquiryStatus =
  | "New"
  | "Unassigned"
  | "Assigned"
  | "Contacted"
  | "Follow-up Required"
  | "Under Discussion"
  | "Proposal Sent"
  | "Converted"
  | "Not Interested"
  | "Closed";
type EnquiryPriority = "High" | "Medium" | "Low";
type LeadStage =
  | "New Lead"
  | "Contacted"
  | "Qualified"
  | "Discussion"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost";
type WorkflowStage = "Discovery" | "Design" | "Execution" | "Review" | "Delivered";

type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  type: CustomerType;
  assignedEmployee: string;
  status: CustomerStatus;
  createdAt: string;
  lastInteraction: string;
  notes: string;
};

type Enquiry = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  requirements: string;
  date: string;
  source: string;
  assignedEmployee: string;
  priority: EnquiryPriority;
  status: EnquiryStatus;
};

type Lead = {
  id: string;
  name: string;
  company: string;
  service: string;
  assignedEmployee: string;
  opportunity: number | null;
  lastInteraction: string;
  nextFollowUp: string;
  stage: LeadStage;
};

type Communication = {
  date: string;
  type: string;
  employee: string;
  summary: string;
  nextAction: string;
  followUpDate: string;
};

type FollowUp = {
  id: string;
  customer: string;
  issue: string;
  owner: string;
  reminder: string;
  status: "Upcoming" | "Due Today" | "Overdue" | "Completed" | "Cancelled";
  notes: string;
};

type Employee = {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  role: "Super Admin" | "Administrator" | "Manager" | "Employee";
  status: "Active" | "On leave" | "Inactive";
  workload: number;
};

type Workflow = {
  id: string;
  name: string;
  description: string;
  customer: string;
  employee: string;
  startDate: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  stage: WorkflowStage;
  progress: number;
  tasks: number;
};

type TaskItem = {
  id: string;
  title: string;
  description: string;
  employee: string;
  customer: string;
  enquiry: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  startDate: string;
  dueDate: string;
  status: "To Do" | "In Progress" | "Under Review" | "Completed" | "Blocked";
};

type ProjectSummary = {
  id: string;
  name: string;
  customer: string;
  status: string;
  progress: number;
  dueDate: string;
};

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

const customers: Customer[] = [
  {
    id: "CUST-1042",
    name: "Amit Mehta",
    company: "Shivam Infrastructure Pvt. Ltd.",
    email: "amit.mehta@shivaminfra.in",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    service: "Commercial Design",
    type: "Corporate",
    assignedEmployee: "Riya Kapoor",
    status: "Active",
    createdAt: "2024-01-15",
    lastInteraction: "2026-10-28",
    notes: "Interested in multi-tenant commercial tower updates and sustainability reporting.",
  },
  {
    id: "CUST-1187",
    name: "Priya Nair",
    company: "Green Valley Developers",
    email: "priya@greenvalley.in",
    phone: "+91 99887 00121",
    location: "Indore, Madhya Pradesh",
    service: "Residential Planning",
    type: "Developer",
    assignedEmployee: "Neel Shah",
    status: "Qualified",
    createdAt: "2023-11-02",
    lastInteraction: "2026-10-18",
    notes: "Approved concept package and awaiting municipal permit review.",
  },
  {
    id: "CUST-1216",
    name: "Sanjay Verma",
    company: "Bharat Tech Developers Ltd.",
    email: "sanjay@bharattech.co.in",
    phone: "+91 98111 90910",
    location: "Bengaluru, Karnataka",
    service: "Structural Engineering",
    type: "Corporate",
    assignedEmployee: "Vikram Das",
    status: "Follow-up",
    createdAt: "2025-02-14",
    lastInteraction: "2026-10-24",
    notes: "Requested revised steel load calculations for the second tower phase.",
  },
  {
    id: "CUST-1294",
    name: "Anita Gupta",
    company: "Independent Homeowner",
    email: "anita.gupta@gmail.com",
    phone: "+91 99000 11223",
    location: "Bangalore, Karnataka",
    service: "Interior Designing & Execution",
    type: "Homeowner",
    assignedEmployee: "Samaira Joshi",
    status: "Active",
    createdAt: "2025-06-30",
    lastInteraction: "2026-10-29",
    notes: "Design sign-off in progress with final material selection pending.",
  },
  {
    id: "CUST-1310",
    name: "Karan Singh",
    company: "Nature India Hospitality Pvt. Ltd.",
    email: "karan@natureindiahospitality.com",
    phone: "+91 97654 22181",
    location: "Alappuzha, Kerala",
    service: "Architectural Planning",
    type: "Institution",
    assignedEmployee: "Riya Kapoor",
    status: "Archived",
    createdAt: "2024-08-28",
    lastInteraction: "2026-09-03",
    notes: "Project closed after delivery; retained for future property expansion work.",
  },
];

const enquiries: Enquiry[] = [
  {
    id: "ENQ-2201",
    customerName: "Rahul Ahuja",
    email: "rahul@meridianlogistics.in",
    phone: "+91 98250 87876",
    company: "Meridian Logistics",
    service: "Project Management (EPCM/EPC)",
    requirements: "Need an end-to-end PMO for a new warehousing campus and timeline schedule review.",
    date: "2026-10-29",
    source: "Website Contact Form",
    assignedEmployee: "Neel Shah",
    priority: "High",
    status: "Follow-up Required",
  },
  {
    id: "ENQ-2204",
    customerName: "Divya Menon",
    email: "divya@crescentedu.org",
    phone: "+91 97444 55221",
    company: "Crescent Education Group",
    service: "Green Building Solutions",
    requirements: "Looking for a sustainable campus expansion with energy benchmarking and rooftop solar studies.",
    date: "2026-10-27",
    source: "Facebook Lead Ad",
    assignedEmployee: "Unassigned",
    priority: "Medium",
    status: "Unassigned",
  },
  {
    id: "ENQ-2210",
    customerName: "Mohit Rao",
    email: "mohit@stonegates.co",
    phone: "+91 98100 77330",
    company: "Stonegate Realty",
    service: "3D Visualization & Engineering Design",
    requirements: "Request for concept design walkthrough and 3D presentation for a mixed-use development.",
    date: "2026-10-20",
    source: "LinkedIn Outreach",
    assignedEmployee: "Samaira Joshi",
    priority: "High",
    status: "Proposal Sent",
  },
  {
    id: "ENQ-2215",
    customerName: "Vinita Sharma",
    email: "vinita@homefocusdesign.com",
    phone: "+91 98988 22441",
    company: "HomeFocus Design Studio",
    service: "Interior Designing & Execution",
    requirements: "Residential concept package for a premium villa interior and full execution support.",
    date: "2026-10-05",
    source: "Website Contact Form",
    assignedEmployee: "Riya Kapoor",
    priority: "Low",
    status: "Converted",
  },
  {
    id: "ENQ-2222",
    customerName: "Nikhil Sethi",
    email: "nikhil@urbanmotive.in",
    phone: "+91 99801 44511",
    company: "UrbanMotive",
    service: "Water Treatment & Wastewater Treatment",
    requirements: "Industrial water recycling design and compliance consultation for a new production facility.",
    date: "2026-09-18",
    source: "Referral",
    assignedEmployee: "Vikram Das",
    priority: "High",
    status: "Under Discussion",
  },
];

const leadStages: LeadStage[] = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Discussion",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const leads: Lead[] = [
  {
    id: "L-901",
    name: "Suhas Shah",
    company: "Indore City Plaza",
    service: "Commercial Design",
    assignedEmployee: "Riya Kapoor",
    opportunity: 3600000,
    lastInteraction: "2026-10-29",
    nextFollowUp: "2026-11-05",
    stage: "Qualified",
  },
  {
    id: "L-904",
    name: "Madhuri Kulkarni",
    company: "Veda Residency",
    service: "Residential Planning",
    assignedEmployee: "Samaira Joshi",
    opportunity: 1850000,
    lastInteraction: "2026-10-22",
    nextFollowUp: "2026-11-02",
    stage: "Proposal Sent",
  },
  {
    id: "L-912",
    name: "Naveen Chadha",
    company: "Silverline Logistics",
    service: "Industrial Flooring",
    assignedEmployee: "Neel Shah",
    opportunity: 900000,
    lastInteraction: "2026-10-17",
    nextFollowUp: "2026-11-08",
    stage: "Negotiation",
  },
  {
    id: "L-920",
    name: "Kavita Bansal",
    company: "Riverside Retreat",
    service: "Architectural Planning",
    assignedEmployee: "Vikram Das",
    opportunity: null,
    lastInteraction: "2026-10-12",
    nextFollowUp: "2026-11-07",
    stage: "Contacted",
  },
  {
    id: "L-922",
    name: "Arjun Iyer",
    company: "Breeze Tower",
    service: "Structural Designing",
    assignedEmployee: "Riya Kapoor",
    opportunity: 2400000,
    lastInteraction: "2026-10-30",
    nextFollowUp: "2026-11-03",
    stage: "Won",
  },
  {
    id: "L-926",
    name: "Tanya Rao",
    company: "EcoNest Villas",
    service: "Green Building Solutions",
    assignedEmployee: "Samaira Joshi",
    opportunity: null,
    lastInteraction: "2026-10-13",
    nextFollowUp: "2026-10-31",
    stage: "Lost",
  },
];

const communicationLog: Communication[] = [
  {
    date: "2026-10-29 10:15",
    type: "Phone call",
    employee: "Riya Kapoor",
    summary: "Customer confirmed design revisions for the commercial tower and requested updated budget notes.",
    nextAction: "Share revised milestone comparison with final cost inputs.",
    followUpDate: "2026-11-05",
  },
  {
    date: "2026-10-28 17:30",
    type: "Email",
    employee: "Neel Shah",
    summary: "Submitted the permit review checklist and schedule overview to the project stakeholder group.",
    nextAction: "Track municipal comments and confirm approval sequence.",
    followUpDate: "2026-11-01",
  },
  {
    date: "2026-10-26 15:00",
    type: "Meeting",
    employee: "Vikram Das",
    summary: "Reviewed structural load assumptions and next-phase engineering sequence with the client team.",
    nextAction: "Prepare a revised engineering brief for stakeholder sign-off.",
    followUpDate: "2026-11-03",
  },
  {
    date: "2026-10-24 13:10",
    type: "WhatsApp",
    employee: "Samaira Joshi",
    summary: "Sent approved mood board and material samples to the homeowner for final review.",
    nextAction: "Confirm final finishes before procurement planning starts.",
    followUpDate: "2026-10-31",
  },
];

const followUps: FollowUp[] = [
  {
    id: "FU-118",
    customer: "Amit Mehta",
    issue: "Commercial tower budget review",
    owner: "Riya Kapoor",
    reminder: "2026-11-03 14:30",
    status: "Due Today",
    notes: "Need revised cost summary and approval note before working group meeting.",
  },
  {
    id: "FU-120",
    customer: "Rahul Ahuja",
    issue: "Warehouse campus PMO workshop",
    owner: "Neel Shah",
    reminder: "2026-10-28 09:00",
    status: "Overdue",
    notes: "Follow-up required to finalize the onboarding timeline and staffing model.",
  },
  {
    id: "FU-121",
    customer: "Priya Nair",
    issue: "Permit review tracker",
    owner: "Samaira Joshi",
    reminder: "2026-11-05 12:00",
    status: "Upcoming",
    notes: "Track remaining approval items and confirm next consultant review.",
  },
  {
    id: "FU-122",
    customer: "Anita Gupta",
    issue: "Material selection sign-off",
    owner: "Samaira Joshi",
    reminder: "2026-10-24 16:00",
    status: "Completed",
    notes: "Selected finishing palette and signed final interior package.",
  },
];

const employees: Employee[] = [
  {
    id: "EMP-01",
    name: "Riya Kapoor",
    email: "riya.kapoor@aprajitastrategics.com",
    designation: "Senior Project Manager",
    department: "Client Delivery",
    role: "Manager",
    status: "Active",
    workload: 9,
  },
  {
    id: "EMP-02",
    name: "Neel Shah",
    email: "neel.shah@aprajitastrategics.com",
    designation: "Business Development Manager",
    department: "Sales",
    role: "Administrator",
    status: "Active",
    workload: 7,
  },
  {
    id: "EMP-03",
    name: "Samaira Joshi",
    email: "samaira.joshi@aprajitastrategics.com",
    designation: "Design Lead",
    department: "Design",
    role: "Employee",
    status: "On leave",
    workload: 5,
  },
  {
    id: "EMP-04",
    name: "Vikram Das",
    email: "vikram.das@aprajitastrategics.com",
    designation: "Structural Consultant",
    department: "Engineering",
    role: "Employee",
    status: "Active",
    workload: 8,
  },
  {
    id: "EMP-05",
    name: "Aditi Menon",
    email: "aditi.menon@aprajitastrategics.com",
    designation: "Operations Head",
    department: "Operations",
    role: "Super Admin",
    status: "Active",
    workload: 6,
  },
];

const workflows: Workflow[] = [
  {
    id: "WF-301",
    name: "Commercial Tower Mobilization",
    description: "Project coordination and governance setup for high-rise commercial expansion.",
    customer: "Shivam Infrastructure Pvt. Ltd.",
    employee: "Riya Kapoor",
    startDate: "2026-09-01",
    dueDate: "2026-11-18",
    priority: "High",
    stage: "Execution",
    progress: 72,
    tasks: 11,
  },
  {
    id: "WF-304",
    name: "Residential Villas Design Sign-off",
    description: "Concept finalization and client approval before engineering detail release.",
    customer: "Green Valley Developers",
    employee: "Samaira Joshi",
    startDate: "2026-10-02",
    dueDate: "2026-11-09",
    priority: "Medium",
    stage: "Design",
    progress: 63,
    tasks: 8,
  },
  {
    id: "WF-309",
    name: "ERP and Compliance Planning",
    description: "Operations readiness and compliance planning for new industrial facilities.",
    customer: "Bharat Tech Developers Ltd.",
    employee: "Neel Shah",
    startDate: "2026-08-17",
    dueDate: "2026-11-12",
    priority: "High",
    stage: "Review",
    progress: 81,
    tasks: 14,
  },
];

const tasks: TaskItem[] = [
  {
    id: "TASK-145",
    title: "Finalize slope analysis for tower core",
    description: "Prepare revised structural brief and check assumptions against revised occupancy brief.",
    employee: "Vikram Das",
    customer: "Shivam Infrastructure Pvt. Ltd.",
    enquiry: "ENQ-2201",
    project: "Shivam Business Tower",
    priority: "High",
    startDate: "2026-10-27",
    dueDate: "2026-11-03",
    status: "In Progress",
  },
  {
    id: "TASK-148",
    title: "Client approval pack for villa design",
    description: "Prepare issue tracker and cost comparison summary for the residential design package.",
    employee: "Samaira Joshi",
    customer: "Green Valley Developers",
    enquiry: "ENQ-2207",
    project: "Green Valley Villas",
    priority: "Medium",
    startDate: "2026-10-17",
    dueDate: "2026-11-02",
    status: "Under Review",
  },
  {
    id: "TASK-152",
    title: "Sales follow-up with warehousing lead",
    description: "Confirm project requirements, scheduling requirements, and proposal statement of work.",
    employee: "Neel Shah",
    customer: "Meridian Logistics",
    enquiry: "ENQ-2201",
    project: "-",
    priority: "High",
    startDate: "2026-10-29",
    dueDate: "2026-11-04",
    status: "To Do",
  },
  {
    id: "TASK-156",
    title: "Deliver final interior finishes pack",
    description: "Send final mood board, material sets, and procurement schedule to homeowner for sign-off.",
    employee: "Samaira Joshi",
    customer: "Anita Gupta",
    enquiry: "ENQ-2215",
    project: "Residential Interior",
    priority: "Low",
    startDate: "2026-10-16",
    dueDate: "2026-10-31",
    status: "Completed",
  },
];

const customerStatusClasses: Record<CustomerStatus, string> = {
  Active: styles.badgeGreen,
  "Follow-up": styles.badgeYellow,
  Qualified: styles.badgeBlue,
  Archived: styles.badgeSlate,
};

const enquiryPriorityClasses: Record<EnquiryPriority, string> = {
  High: styles.badgeOrange,
  Medium: styles.badgeYellow,
  Low: styles.badgeSlate,
};

const enquiryStatusClasses: Record<EnquiryStatus, string> = {
  New: styles.badgeBlue,
  Unassigned: styles.badgeOrange,
  Assigned: styles.badgeGreen,
  Contacted: styles.badgeBlue,
  "Follow-up Required": styles.badgeYellow,
  "Under Discussion": styles.badgePurple,
  "Proposal Sent": styles.badgeOrange,
  Converted: styles.badgeGreen,
  "Not Interested": styles.badgeSlate,
  Closed: styles.badgeSlate,
};

const workflowPriorityClasses: Record<"High" | "Medium" | "Low", string> = {
  High: styles.badgeOrange,
  Medium: styles.badgeYellow,
  Low: styles.badgeSlate,
};

const taskStatusClasses: Record<TaskItem["status"], string> = {
  "To Do": styles.badgeSlate,
  "In Progress": styles.badgeBlue,
  "Under Review": styles.badgeYellow,
  Completed: styles.badgeGreen,
  Blocked: styles.badgeOrange,
};

const employeeStatusClasses: Record<Employee["status"], string> = {
  Active: styles.badgeGreen,
  "On leave": styles.badgeYellow,
  Inactive: styles.badgeSlate,
};

function getRelatedRecord(
  record: Record<string, unknown>,
  relationName: string,
): Record<string, unknown> | null {
  const relation = record[relationName];
  if (!relation || typeof relation !== "object" || Array.isArray(relation)) return null;
  return relation as Record<string, unknown>;
}

function getRelatedLabel(
  record: Record<string, unknown>,
  relationName: string,
  fieldName: string,
): string | null {
  const value = getRelatedRecord(record, relationName)?.[fieldName];
  return typeof value === "string" && value ? value : null;
}

export default function AdminDashboard() {
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerStatusFilter, setCustomerStatusFilter] = useState("All");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [customerRows, setCustomerRows] = useState<Customer[]>([]);
  const [enquiryRows, setEnquiryRows] = useState<Enquiry[]>([]);
  const [leadRows, setLeadRows] = useState<Lead[]>([]);
  const [communicationRows, setCommunicationRows] = useState<Communication[]>([]);
  const [followUpRows, setFollowUpRows] = useState<FollowUp[]>([]);
  const [employeeRows, setEmployeeRows] = useState<Employee[]>([]);
  const [workflowRows, setWorkflowRows] = useState<Workflow[]>([]);
  const [taskRows, setTaskRows] = useState<TaskItem[]>([]);
  const [projectRows, setProjectRows] = useState<ProjectSummary[]>([]);
  const [notificationRows, setNotificationRows] = useState<NotificationItem[]>([]);
  const [backendMode, setBackendMode] = useState<"loading" | "demo" | "live" | "error">("loading");
  const [backendMessage, setBackendMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [openForms, setOpenForms] = useState<Record<string, boolean>>({});
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerFormError, setCustomerFormError] = useState("");
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [serviceChoices, setServiceChoices] = useState<Array<{ slug: string; title: string }>>([]);

  useEffect(() => {
    let active = true;

    async function loadCrmRecords() {
      const responses = await Promise.all([
        fetch("/api/admin/customers", { cache: "no-store" }),
        fetch("/api/admin/enquiries", { cache: "no-store" }),
        fetch("/api/admin/services", { cache: "no-store" }),
        fetch("/api/admin/leads", { cache: "no-store" }),
        fetch("/api/admin/communications", { cache: "no-store" }),
        fetch("/api/admin/follow_ups", { cache: "no-store" }),
        fetch("/api/admin/employees", { cache: "no-store" }),
        fetch("/api/admin/workflows", { cache: "no-store" }),
        fetch("/api/admin/tasks", { cache: "no-store" }),
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/notifications", { cache: "no-store" }),
      ]).catch(() => null);

      if (!active) return;
      if (!responses) {
        setBackendMode("error");
        setBackendMessage("Dashboard records could not be loaded. Please reload or contact an administrator.");
        return;
      }

      if (responses.every((response) => response.status === 503)) {
        setCustomerRows(customers);
        setEnquiryRows(enquiries);
        setLeadRows(leads);
        setCommunicationRows(communicationLog);
        setFollowUpRows(followUps);
        setEmployeeRows(employees);
        setWorkflowRows(workflows);
        setTaskRows(tasks);
        setProjectRows([]);
        setNotificationRows([]);
        setServiceChoices(websiteServices.map(({ slug, title }) => ({ slug, title })));
        setBackendMode("demo");
        return;
      }
      if (responses.some((response) => !response.ok)) {
        const failedResponse = responses.find((response) => !response.ok);
        const result = failedResponse
          ? ((await failedResponse.json().catch(() => ({}))) as { error?: string })
          : {};
        setBackendMode("error");
        setBackendMessage(result.error ?? "Dashboard records could not be loaded.");
        return;
      }

      const [
        customerResult,
        enquiryResult,
        serviceResult,
        leadResult,
        communicationResult,
        followUpResult,
        employeeResult,
        workflowResult,
        taskResult,
        projectResult,
        notificationResult,
      ] = (await Promise.all(
        responses.map((response) => response.json()),
      )) as [
        { customers: Array<Record<string, unknown>> },
        { enquiries: Array<Record<string, unknown>> },
        { services: Array<{ slug: string; title: string }> },
        { records: Array<Record<string, unknown>> },
        { records: Array<Record<string, unknown>> },
        { records: Array<Record<string, unknown>> },
        { employees: Array<Record<string, unknown>> },
        { records: Array<Record<string, unknown>> },
        { records: Array<Record<string, unknown>> },
        { records: Array<Record<string, unknown>> },
        { notifications: Array<Record<string, unknown>> },
      ];

      if (!active) return;
      setServiceChoices(serviceResult.services);
      setCustomerRows(
        customerResult.customers.map((record) => ({
          id: String(record.id),
          name: String(record.name),
          company: String(record.company_name ?? "Independent customer"),
          email: String(record.email ?? ""),
          phone: String(record.phone ?? ""),
          location: String(record.location ?? ""),
          service:
            typeof record.primary_service === "object" && record.primary_service
              ? String((record.primary_service as { title?: unknown }).title ?? "—")
              : "—",
          type: ({
            CORPORATE: "Corporate",
            DEVELOPER: "Developer",
            HOMEOWNER: "Homeowner",
            INSTITUTION: "Institution",
            OTHER: "Corporate",
          }[String(record.customer_type)] ?? "Corporate") as Customer["type"],
          assignedEmployee:
            typeof record.assigned_employee === "object" && record.assigned_employee
              ? String((record.assigned_employee as { name?: unknown }).name ?? "Unassigned")
              : "Unassigned",
          status: ({
            ACTIVE: "Active",
            FOLLOW_UP: "Follow-up",
            QUALIFIED: "Qualified",
            ARCHIVED: "Archived",
          }[String(record.status)] ?? "Active") as CustomerStatus,
          createdAt: String(record.created_at),
          lastInteraction: String(record.updated_at),
          notes: String(record.internal_notes ?? ""),
        })),
      );
      setEnquiryRows(
        enquiryResult.enquiries.map((record) => ({
          id: String(record.reference_code),
          customerName: String(record.customer_name),
          email: String(record.email ?? ""),
          phone: String(record.phone ?? ""),
          company: String(record.company_name ?? ""),
          service:
            websiteServices.find((service) => service.slug === String(record.service_slug))
              ?.title ?? String(record.service_slug ?? "Not specified"),
          requirements: String(record.project_requirements ?? ""),
          date: String(record.submitted_at),
          source: String(record.source),
          assignedEmployee:
            typeof record.assigned_employee === "object" && record.assigned_employee
              ? String((record.assigned_employee as { name?: unknown }).name ?? "Unassigned")
              : "Unassigned",
          priority: ({
            LOW: "Low",
            MEDIUM: "Medium",
            HIGH: "High",
            URGENT: "High",
          }[String(record.priority)] ?? "Medium") as EnquiryPriority,
          status: ({
            NEW: "New",
            UNASSIGNED: "Unassigned",
            ASSIGNED: "Assigned",
            CONTACTED: "Contacted",
            FOLLOW_UP_REQUIRED: "Follow-up Required",
            UNDER_DISCUSSION: "Under Discussion",
            PROPOSAL_SENT: "Proposal Sent",
            CONVERTED: "Converted",
            NOT_INTERESTED: "Not Interested",
            CLOSED: "Closed",
          }[String(record.status)] ?? "New") as EnquiryStatus,
        })),
      );
      setLeadRows(
        leadResult.records.map((record) => ({
          id: String(record.id),
          name: String(record.name),
          company: String(record.company_name ?? "Independent lead"),
          service:
            getRelatedLabel(record, "service", "title") ??
            websiteServices.find((service) => service.slug === String(record.service_slug))?.title ??
            "Not specified",
          assignedEmployee: getRelatedLabel(record, "assigned_employee", "name") ?? "Unassigned",
          opportunity:
            typeof record.opportunity_value === "number" ? record.opportunity_value : null,
          lastInteraction: String(record.last_interaction_at ?? "—"),
          nextFollowUp: String(record.next_follow_up_at ?? "—"),
          stage: ({
            NEW_LEAD: "New Lead",
            CONTACTED: "Contacted",
            QUALIFIED: "Qualified",
            DISCUSSION: "Discussion",
            PROPOSAL_SENT: "Proposal Sent",
            NEGOTIATION: "Negotiation",
            WON: "Won",
            LOST: "Lost",
          }[String(record.stage)] ?? "New Lead") as LeadStage,
        })),
      );
      setCommunicationRows(
        communicationResult.records.map((record) => ({
          date: String(record.occurred_at),
          type: String(record.communication_type).replaceAll("_", " "),
          employee: getRelatedLabel(record, "employee", "name") ?? "Team member",
          summary: String(record.summary),
          nextAction: String(record.next_action ?? "—"),
          followUpDate: String(record.follow_up_at ?? "—"),
        })),
      );
      setFollowUpRows(
        followUpResult.records.map((record) => {
          const reminder = new Date(String(record.reminder_at));
          const currentDay = new Date();
          const status =
            record.status === "COMPLETED"
              ? "Completed"
              : record.status === "CANCELLED"
                ? "Cancelled"
                : reminder < currentDay && reminder.toDateString() !== currentDay.toDateString()
                  ? "Overdue"
                  : reminder.toDateString() === currentDay.toDateString()
                    ? "Due Today"
                    : "Upcoming";
          return {
            id: String(record.id),
            customer: getRelatedLabel(record, "customer", "name") ??
              getRelatedLabel(record, "enquiry", "customer_name") ??
              "Customer enquiry",
            issue: String(record.title),
            owner: getRelatedLabel(record, "assigned_employee", "name") ?? "Unassigned",
            reminder: String(record.reminder_at),
            status: status as FollowUp["status"],
            notes: String(record.notes ?? ""),
          };
        }),
      );
      setEmployeeRows(
        employeeResult.employees.map((record) => {
          const profile = getRelatedRecord(record, "profile");
          const role = String(profile?.role ?? "EMPLOYEE");
          return {
            id: String(record.id),
            name: String(record.name),
            email: String(record.email),
            designation: String(record.designation ?? ""),
            department: String(record.department ?? ""),
            role: ({
              SUPER_ADMIN: "Super Admin",
              ADMIN: "Administrator",
              MANAGER: "Manager",
              EMPLOYEE: "Employee",
            }[role] ?? "Employee") as Employee["role"],
            status: ({
              ACTIVE: "Active",
              ON_LEAVE: "On leave",
              INACTIVE: "Inactive",
            }[String(record.account_status)] ?? "Inactive") as Employee["status"],
            workload: taskResult.records.filter(
              (task) => task.assigned_employee_id === record.id,
            ).length,
          };
        }),
      );
      setWorkflowRows(
        workflowResult.records.map((record) => ({
          id: String(record.id),
          name: String(record.name),
          description: String(record.description ?? ""),
          customer:
            getRelatedLabel(record, "customer", "company_name") ??
            getRelatedLabel(record, "customer", "name") ??
            getRelatedLabel(record, "project", "name") ??
            "Internal workflow",
          employee: getRelatedLabel(record, "assigned_employee", "name") ?? "Unassigned",
          startDate: String(record.start_date ?? "—"),
          dueDate: String(record.due_date ?? "—"),
          priority: ({
            HIGH: "High",
            URGENT: "High",
            LOW: "Low",
            MEDIUM: "Medium",
          }[String(record.priority)] ?? "Medium") as Workflow["priority"],
          stage: String(record.stage) as WorkflowStage,
          progress: Number(record.progress ?? 0),
          tasks: Array.isArray(record.workflow_tasks) ? record.workflow_tasks.length : 0,
        })),
      );
      setTaskRows(
        taskResult.records.map((record) => ({
          id: String(record.id),
          title: String(record.title),
          description: String(record.description ?? ""),
          employee: getRelatedLabel(record, "assigned_employee", "name") ?? "Unassigned",
          customer:
            getRelatedLabel(record, "customer", "company_name") ??
            getRelatedLabel(record, "customer", "name") ??
            getRelatedLabel(record, "enquiry", "reference_code") ??
            "—",
          enquiry: getRelatedLabel(record, "enquiry", "reference_code") ?? "—",
          project: getRelatedLabel(record, "project", "name") ??
            getRelatedLabel(record, "workflow", "name") ??
            "—",
          priority: ({
            HIGH: "High",
            URGENT: "High",
            LOW: "Low",
            MEDIUM: "Medium",
          }[String(record.priority)] ?? "Medium") as TaskItem["priority"],
          startDate: String(record.start_date ?? "—"),
          dueDate: String(record.due_date ?? "—"),
          status: ({
            TO_DO: "To Do",
            IN_PROGRESS: "In Progress",
            UNDER_REVIEW: "Under Review",
            COMPLETED: "Completed",
            BLOCKED: "Blocked",
          }[String(record.status)] ?? "To Do") as TaskItem["status"],
        })),
      );
      setProjectRows(
        projectResult.records.map((record) => ({
          id: String(record.id),
          name: String(record.name),
          customer:
            getRelatedLabel(record, "customer", "company_name") ??
            getRelatedLabel(record, "customer", "name") ??
            "Unlinked customer",
          status: String(record.status).replaceAll("_", " "),
          progress: Number(record.progress ?? 0),
          dueDate: String(record.due_date ?? "—"),
        })),
      );
      setNotificationRows(
        notificationResult.notifications.map((record) => ({
          id: String(record.id),
          title: String(record.title),
          body: String(record.body ?? ""),
          readAt: record.read_at ? String(record.read_at) : null,
          createdAt: String(record.created_at),
        })),
      );
      setBackendMode("live");
      setBackendMessage("Connected to Supabase. Lists are scoped by your account role and assignments.");
    }

    void loadCrmRecords();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  function toggleForm(name: string) {
    setOpenForms((current) => ({ ...current, [name]: !current[name] }));
  }

  function reloadAfterCreate() {
    setOpenForms({});
    setRefreshKey((current) => current + 1);
    setBackendMessage("Record saved.");
  }

  const filteredCustomers = useMemo(() => {
    return customerRows.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(customerQuery.toLowerCase()) ||
        customer.company.toLowerCase().includes(customerQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerQuery.toLowerCase());
      const matchesStatus =
        customerStatusFilter === "All" || customer.status === customerStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customerRows, customerQuery, customerStatusFilter]);

  const filteredEnquiries = useMemo(() => {
    return enquiryRows.filter((enquiry) => {
      const matchesStatus =
        enquiryStatusFilter === "All" || enquiry.status === enquiryStatusFilter;
      const matchesService = serviceFilter === "All" || enquiry.service === serviceFilter;

      return matchesStatus && matchesService;
    });
  }, [enquiryRows, enquiryStatusFilter, serviceFilter]);

  const demoKpis = [
    { label: `Customers${backendMode === "live" ? "" : " · demo"}`, value: String(customerRows.length), icon: Users },
    { label: `Enquiries${backendMode === "live" ? "" : " · demo"}`, value: String(enquiryRows.length), icon: MessageSquareText },
    { label: `Qualified leads${backendMode === "live" ? "" : " · demo"}`, value: String(leadRows.filter((lead) => lead.stage === "Qualified").length), icon: TrendingUp },
    { label: `Active workflows${backendMode === "live" ? "" : " · demo"}`, value: String(workflowRows.filter((workflow) => workflow.stage !== "Delivered").length), icon: Workflow },
  ];

  const topServices = Array.from(new Set(enquiryRows.map((enquiry) => enquiry.service)));
  const wonLeadShare = leadRows.length
    ? Math.round((leadRows.filter((lead) => lead.stage === "Won").length / leadRows.length) * 100)
    : 0;
  const overdueFollowUpCount = followUpRows.filter((item) => item.status === "Overdue").length;
  const unassignedEnquiryCount = enquiryRows.filter(
    (item) => item.assignedEmployee === "Unassigned" || item.status === "Unassigned",
  ).length;
  const customerOptions = customerRows.map((customer) => ({
    value: customer.id,
    label: customer.company ? `${customer.name} · ${customer.company}` : customer.name,
  }));
  const employeeOptions = employeeRows
    .filter((employee) => employee.status !== "Inactive")
    .map((employee) => ({ value: employee.id, label: employee.name }));
  const workflowOptions = workflowRows.map((workflow) => ({
    value: workflow.id,
    label: workflow.name,
  }));

  async function createCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCustomer(true);
    setCustomerFormError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        company_name: formData.get("company"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        location: formData.get("location"),
        customer_type: formData.get("type"),
        service_slug: formData.get("service"),
      }),
    }).catch(() => null);

    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setCustomerFormError(result.error ?? "Customer could not be saved.");
      setSavingCustomer(false);
      return;
    }

    const result = (await response.json()) as {
      customer: Record<string, unknown>;
    };
    const record = result.customer;
    setCustomerRows((current) => [
      {
        id: String(record.id),
        name: String(record.name),
        company: String(record.company_name ?? "Independent customer"),
        email: String(record.email ?? ""),
        phone: String(record.phone ?? ""),
        location: String(record.location ?? ""),
        service:
          websiteServices.find((service) => service.slug === String(formData.get("service")))
            ?.title ?? "—",
        type: ({
          CORPORATE: "Corporate",
          DEVELOPER: "Developer",
          HOMEOWNER: "Homeowner",
          INSTITUTION: "Institution",
          OTHER: "Corporate",
        }[String(formData.get("type"))] ?? "Corporate") as Customer["type"],
        assignedEmployee: "Unassigned",
        status: "Active",
        createdAt: String(record.created_at),
        lastInteraction: String(record.updated_at),
        notes: String(record.internal_notes ?? ""),
      },
      ...current,
    ]);
    setShowCustomerForm(false);
    setSavingCustomer(false);
  }

  async function archiveCustomer(customer: Customer) {
    const response = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ARCHIVED" }),
    }).catch(() => null);
    if (!response?.ok) {
      setBackendMessage("Customer could not be archived. Check your access and try again.");
      setBackendMode("error");
      return;
    }
    setCustomerRows((current) =>
      current.map((item) =>
        item.id === customer.id ? { ...item, status: "Archived" } : item,
      ),
    );
  }

  async function updateEnquiryStatus(enquiry: Enquiry, status: EnquiryStatus) {
    const response = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: enquiry.id,
        status: status
          .replaceAll(" ", "_")
          .replaceAll("-", "_")
          .toUpperCase(),
      }),
    }).catch(() => null);
    if (!response?.ok) {
      setBackendMessage("Enquiry could not be updated. Check your access and try again.");
      setBackendMode("error");
      return;
    }
    setEnquiryRows((current) =>
      current.map((item) => (item.id === enquiry.id ? { ...item, status } : item)),
    );
  }

  async function convertEnquiry(enquiry: Enquiry) {
    const response = await fetch(`/api/admin/enquiries/${encodeURIComponent(enquiry.id)}/convert`, {
      method: "POST",
    }).catch(() => null);
    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setBackendMessage(result.error ?? "Enquiry could not be converted.");
      setBackendMode("error");
      return;
    }
    setEnquiryRows((current) =>
      current.map((item) =>
        item.id === enquiry.id ? { ...item, status: "Converted" } : item,
      ),
    );
    setBackendMessage(`Enquiry ${enquiry.id} was converted to a customer record.`);
  }

  async function updateResource(
    resource: string,
    id: string,
    changes: Record<string, string | number | null>,
  ) {
    const response = await fetch(`/api/admin/${resource}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...changes }),
    }).catch(() => null);
    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setBackendMessage(result.error ?? "The change could not be saved.");
      setBackendMode("error");
      return;
    }
    setRefreshKey((current) => current + 1);
    setBackendMessage("Changes saved.");
  }

  async function assignEnquiry(enquiry: Enquiry, employeeId: string) {
    const response = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: enquiry.id,
        assigned_employee_id: employeeId || null,
        status: employeeId ? "ASSIGNED" : "UNASSIGNED",
      }),
    }).catch(() => null);
    if (!response?.ok) {
      setBackendMessage("Enquiry assignment could not be saved. Check your permissions.");
      setBackendMode("error");
      return;
    }
    setRefreshKey((current) => current + 1);
    setBackendMessage(`Assignment updated for ${enquiry.id}.`);
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>APRAJITA STRATEGICS</p>
          <h1>CRM & workflow management dashboard</h1>
        </div>
        <div className={styles.heroActions}>
          <span className={styles.demoBadge}>
            {backendMode === "live"
              ? "CRM connected · other modules demo"
              : backendMode === "error"
                ? "Backend connection needs attention"
                : "Demo data only"}
          </span>
          {backendMode !== "demo" && backendMode !== "loading" ? (
            <form action={signOutAction}>
              <button type="submit" className={styles.secondaryButton}>Sign out</button>
            </form>
          ) : null}
        </div>
      </header>
      {backendMessage ? (
        <p className={styles.backendNotice} role={backendMode === "error" ? "alert" : "status"}>
          {backendMessage}
        </p>
      ) : null}

      <nav className={styles.quickNav} aria-label="Dashboard sections">
        <a href="#crm">Customer CRM</a>
        <a href="#queries">Queries</a>
        <a href="#pipeline">Sales Pipeline</a>
        <a href="#communication">Communication</a>
        <a href="#followups">Follow-ups</a>
        <a href="#employees">Team</a>
        <a href="#workflows">Workflows</a>
        <a href="#tasks">Tasks</a>
        <a href="#projects">Projects</a>
      </nav>

      <section className={styles.summaryGrid} aria-label="Key metrics">
        {demoKpis.map(({ label, value, icon: Icon }) => (
          <article key={label} className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Icon size={18} aria-hidden="true" />
            </div>
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section id="crm" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>01</p>
            <h2>Customer CRM</h2>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setShowCustomerForm((open) => !open)}
          >
            {showCustomerForm ? "Close" : "Add customer"}
          </button>
        </div>

        {showCustomerForm ? (
          <form className={styles.customerForm} onSubmit={createCustomer}>
            <label>
              Customer name
              <input name="name" required maxLength={160} />
            </label>
            <label>
              Company
              <input name="company" maxLength={200} />
            </label>
            <label>
              Email
              <input name="email" type="email" maxLength={254} />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" maxLength={32} />
            </label>
            <label>
              Location
              <input name="location" maxLength={200} />
            </label>
            <label>
              Interested service
              <select name="service" defaultValue="">
                <option value="">Select a service</option>
                {(serviceChoices.length > 0
                  ? serviceChoices
                  : websiteServices.map(({ slug, title }) => ({ slug, title }))
                ).map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Customer type
              <select name="type" defaultValue="OTHER">
                <option value="CORPORATE">Corporate</option>
                <option value="DEVELOPER">Developer</option>
                <option value="HOMEOWNER">Homeowner</option>
                <option value="INSTITUTION">Institution</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
            {customerFormError ? <p role="alert">{customerFormError}</p> : null}
            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton} disabled={savingCustomer}>
                {savingCustomer ? "Saving..." : "Save customer"}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setShowCustomerForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search customer, company or email"
              value={customerQuery}
              onChange={(event) => setCustomerQuery(event.target.value)}
            />
          </label>

          <select
            value={customerStatusFilter}
            onChange={(event) => setCustomerStatusFilter(event.target.value)}
            aria-label="Filter customers by status"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Qualified">Qualified</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Customer</th>
                <th className={styles.tableHeader}>Service</th>
                <th className={styles.tableHeader}>Assigned</th>
                <th className={styles.tableHeader}>Status</th>
                <th className={styles.tableHeader}>Last interaction</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className={styles.tableCell}>
                    <div className={styles.customerCell}>
                      <div className={styles.avatar}>{customer.name.charAt(0)}</div>
                      <div>
                        {backendMode === "live" ? (
                          <Link href={`/admin/customers/${customer.id}`}>
                            <strong>{customer.name}</strong>
                          </Link>
                        ) : (
                          <strong>{customer.name}</strong>
                        )}
                        <span>{customer.company}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableCell}>{customer.service}</td>
                  <td className={styles.tableCell}>{customer.assignedEmployee}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.badge} ${customerStatusClasses[customer.status]}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{customer.lastInteraction}</td>
                  <td className={styles.tableCell}>
                    {backendMode === "live" && customer.status !== "Archived" ? (
                      <button
                        type="button"
                        className={styles.tableAction}
                        onClick={() => void archiveCustomer(customer)}
                      >
                        Archive
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="queries" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>02</p>
            <h2>Customer Query Management</h2>
          </div>
          <div className={styles.inlineActions}>
            <span className={styles.noticeBox}>Overdue follow-ups: {overdueFollowUpCount}</span>
            <span className={styles.noticeBox}>Unassigned: {unassignedEnquiryCount}</span>
          </div>
        </div>

        <div className={styles.toolbar}>
          <select
            value={enquiryStatusFilter}
            onChange={(event) => setEnquiryStatusFilter(event.target.value)}
            aria-label="Filter enquiries by status"
          >
            <option value="All">All statuses</option>
            {Object.keys(enquiryStatusClasses).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(event) => setServiceFilter(event.target.value)}
            aria-label="Filter enquiries by service"
          >
            <option value="All">All services</option>
            {topServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Enquiry</th>
                <th className={styles.tableHeader}>Service</th>
                <th className={styles.tableHeader}>Priority</th>
                <th className={styles.tableHeader}>Status</th>
                <th className={styles.tableHeader}>Assigned</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td className={styles.tableCell}>
                    <strong>{enquiry.id}</strong>
                    <div className={styles.metaLine}>{enquiry.customerName}</div>
                  </td>
                  <td className={styles.tableCell}>{enquiry.service}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.badge} ${enquiryPriorityClasses[enquiry.priority]}`}>
                      {enquiry.priority}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {backendMode === "live" ? (
                      <select
                        aria-label={`Update status for ${enquiry.id}`}
                        value={enquiry.status}
                        onChange={(event) =>
                          void updateEnquiryStatus(enquiry, event.target.value as EnquiryStatus)
                        }
                      >
                        {Object.keys(enquiryStatusClasses).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`${styles.badge} ${enquiryStatusClasses[enquiry.status]}`}>
                        {enquiry.status}
                      </span>
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    {backendMode === "live" ? (
                      <select
                        aria-label={`Assign ${enquiry.id}`}
                        value={employeeRows.find((employee) => employee.name === enquiry.assignedEmployee)?.id ?? ""}
                        onChange={(event) => void assignEnquiry(enquiry, event.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {employeeOptions.map((employee) => (
                          <option key={employee.value} value={employee.value}>{employee.label}</option>
                        ))}
                      </select>
                    ) : enquiry.assignedEmployee}
                  </td>
                  <td className={styles.tableCell}>
                    {backendMode === "live" && enquiry.status !== "Converted" ? (
                      <button
                        type="button"
                        className={styles.tableAction}
                        onClick={() => void convertEnquiry(enquiry)}
                      >
                        Convert
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="pipeline" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>03</p>
            <h2>Lead management & sales pipeline</h2>
          </div>
          <div className={styles.inlineActions}>
            <span className={styles.noticeBox}>
              {backendMode === "live" ? `Won share of loaded leads: ${wonLeadShare}%` : "Conversion metrics: demo data"}
            </span>
          </div>
        </div>

        <div className={styles.pipelineBoard}>
          {leadStages.map((stage) => {
            const stageLeads = leadRows.filter((lead) => lead.stage === stage);

            return (
              <div key={stage} className={styles.pipelineColumn}>
                <header>
                  <h3>{stage}</h3>
                  <span>{stageLeads.length}</span>
                </header>
                <div className={styles.pipelineCards}>
                  {stageLeads.length > 0 ? (
                    stageLeads.map((lead) => (
                      <article key={lead.id} className={styles.pipelineCard}>
                        <div className={styles.pipelineCardTop}>
                          <strong>{lead.name}</strong>
                          <span>{lead.company}</span>
                        </div>
                        <p>{lead.service}</p>
                        <ul>
                          <li>Owner: {lead.assignedEmployee}</li>
                          {lead.opportunity && <li>Value: ₹{lead.opportunity.toLocaleString("en-IN")}</li>}
                          <li>Last touch: {lead.lastInteraction}</li>
                          <li>Next follow-up: {lead.nextFollowUp}</li>
                        </ul>
                        {backendMode === "live" ? (
                          <select
                            aria-label={`Move ${lead.name} to a pipeline stage`}
                            value={lead.stage}
                            onChange={(event) =>
                              void updateResource("leads", lead.id, {
                                stage: event.target.value.replaceAll(" ", "_").toUpperCase(),
                              })
                            }
                          >
                            {leadStages.map((leadStage) => (
                              <option key={leadStage} value={leadStage}>{leadStage}</option>
                            ))}
                          </select>
                        ) : null}
                      </article>
                    ))
                  ) : (
                    <div className={styles.emptyState}>No leads in this stage.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="communication" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>04</p>
            <h2>Customer communication management</h2>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => toggleForm("communications")}
          >
            {openForms.communications ? "Close" : "Log communication"}
          </button>
        </div>

        {openForms.communications ? (
          <ResourceCreateForm
            resource="communications"
            title="communication"
            fields={[
              { name: "customer_id", label: "Customer", type: "select", nullable: true, options: customerOptions },
              { name: "communication_type", label: "Type", type: "select", required: true, options: [
                { value: "CALL", label: "Phone call" }, { value: "EMAIL", label: "Email" },
                { value: "MEETING", label: "Meeting" }, { value: "WHATSAPP", label: "WhatsApp log" },
                { value: "GENERAL", label: "General interaction" }, { value: "INTERNAL_NOTE", label: "Internal note" },
              ] },
              { name: "summary", label: "Summary", type: "textarea", required: true },
              { name: "next_action", label: "Next action", nullable: true, maxLength: 2000 },
              { name: "occurred_at", label: "Date and time", type: "datetime-local" },
              { name: "follow_up_at", label: "Follow-up date and time", type: "datetime-local", nullable: true },
            ]}
            onSaved={reloadAfterCreate}
            onCancel={() => toggleForm("communications")}
          />
        ) : null}

        <div className={styles.timeline}>
          {communicationRows.map((entry) => (
            <article key={`${entry.date}-${entry.type}`} className={styles.timelineItem}>
              <span className={styles.timelinePin} aria-hidden="true" />
              <div>
                <div className={styles.timelineTopLine}>
                  <strong>{entry.type}</strong>
                  <span>{entry.date}</span>
                </div>
                <p>{entry.summary}</p>
                <div className={styles.timelineMeta}>
                  <span>Employee: {entry.employee}</span>
                  <span>Next action: {entry.nextAction}</span>
                  <span>Follow-up: {entry.followUpDate}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="followups" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>05</p>
            <h2>Follow-up and reminder management</h2>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => toggleForm("follow_ups")}
          >
            {openForms.follow_ups ? "Close" : "Schedule follow-up"}
          </button>
        </div>

        {openForms.follow_ups ? (
          <ResourceCreateForm
            resource="follow_ups"
            title="follow-up"
            fields={[
              { name: "customer_id", label: "Customer", type: "select", nullable: true, options: customerOptions },
              { name: "enquiry_id", label: "Enquiry", type: "select", nullable: true, options: enquiryRows.map((enquiry) => ({ value: enquiry.id, label: enquiry.id })) },
              { name: "title", label: "Follow-up", required: true, maxLength: 200 },
              { name: "assigned_employee_id", label: "Assigned employee", type: "select", nullable: true, options: employeeOptions },
              { name: "reminder_at", label: "Reminder date and time", type: "datetime-local", required: true },
              { name: "notes", label: "Notes", type: "textarea" },
            ]}
            onSaved={reloadAfterCreate}
            onCancel={() => toggleForm("follow_ups")}
          />
        ) : null}

        <div className={styles.listGrid}>
          {followUpRows.map((item) => (
            <article key={item.id} className={styles.listCard}>
              <div className={styles.listCardHeader}>
                <strong>{item.customer}</strong>
                <span className={`${styles.badge} ${item.status === "Overdue" ? styles.badgeOrange : item.status === "Completed" ? styles.badgeGreen : styles.badgeYellow}`}>
                  {item.status}
                </span>
              </div>
              <p>{item.issue}</p>
              <ul>
                <li>Owner: {item.owner}</li>
                <li>Reminder: {item.reminder}</li>
                <li>Notes: {item.notes}</li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="employees" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>06</p>
            <h2>Employee and team management</h2>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => toggleForm("employees")}
          >
            {openForms.employees ? "Close" : "Add employee"}
          </button>
        </div>

        {openForms.employees ? (
          <ResourceCreateForm
            resource="employees"
            title="employee"
            fields={[
              { name: "name", label: "Full name", required: true, maxLength: 160 },
              { name: "email", label: "Email", type: "email", required: true, maxLength: 254 },
              { name: "designation", label: "Designation", maxLength: 160 },
              { name: "department", label: "Department", maxLength: 120 },
              { name: "employee_code", label: "Employee ID", nullable: true, maxLength: 40 },
              { name: "account_status", label: "Account status", type: "select", required: true, options: [
                { value: "ACTIVE", label: "Active" }, { value: "ON_LEAVE", label: "On leave" },
                { value: "INACTIVE", label: "Inactive" },
              ] },
            ]}
            onSaved={reloadAfterCreate}
            onCancel={() => toggleForm("employees")}
          />
        ) : null}

        <div className={styles.teamGrid}>
          {employeeRows.map((employee) => (
            <article key={employee.id} className={styles.teamCard}>
              <div className={styles.listCardHeader}>
                <div>
                  <strong>{employee.name}</strong>
                  <span>{employee.designation}</span>
                </div>
                <span className={`${styles.badge} ${employeeStatusClasses[employee.status]}`}>
                  {employee.status}
                </span>
              </div>
              <ul>
                <li>{employee.department}</li>
                <li>{employee.role}</li>
                <li>Assigned tasks: {employee.workload}</li>
                <li>{employee.email}</li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="workflows" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>07</p>
            <h2>Workflow management</h2>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => toggleForm("workflows")}
          >
            {openForms.workflows ? "Close" : "New workflow"}
          </button>
        </div>

        {openForms.workflows ? (
          <ResourceCreateForm
            resource="workflows"
            title="workflow"
            fields={[
              { name: "name", label: "Workflow name", required: true, maxLength: 200 },
              { name: "description", label: "Description", type: "textarea" },
              { name: "customer_id", label: "Related customer", type: "select", nullable: true, options: customerOptions },
              { name: "assigned_employee_id", label: "Assigned employee", type: "select", nullable: true, options: employeeOptions },
              { name: "stage", label: "Current stage", maxLength: 100 },
              { name: "priority", label: "Priority", type: "select", options: [
                { value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" },
                { value: "HIGH", label: "High" }, { value: "URGENT", label: "Urgent" },
              ] },
              { name: "start_date", label: "Start date", type: "date", nullable: true },
              { name: "due_date", label: "Due date", type: "date", nullable: true },
            ]}
            onSaved={reloadAfterCreate}
            onCancel={() => toggleForm("workflows")}
          />
        ) : null}

        <div className={styles.workflowGrid}>
          {workflowRows.map((workflow) => (
            <article key={workflow.id} className={styles.workflowCard}>
              <div className={styles.listCardHeader}>
                <div>
                  <strong>{workflow.name}</strong>
                  <span>{workflow.customer}</span>
                </div>
                <span className={`${styles.badge} ${workflowPriorityClasses[workflow.priority]}`}>
                  {workflow.priority}
                </span>
              </div>
              <p>{workflow.description}</p>
              <div className={styles.progressRow}>
                {backendMode === "live" ? (
                  <select
                    aria-label={`Update workflow stage: ${workflow.name}`}
                    value={workflow.stage}
                    onChange={(event) =>
                      void updateResource("workflows", workflow.id, { stage: event.target.value })
                    }
                  >
                    {["Discovery", "Design", "Execution", "Review", "Delivered"].map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                ) : (
                  <span>{workflow.stage}</span>
                )}
                <span>{workflow.progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div style={{ width: `${workflow.progress}%` }} />
              </div>
              <ul>
                <li>Owner: {workflow.employee}</li>
                <li>Start: {workflow.startDate}</li>
                <li>Due: {workflow.dueDate}</li>
                <li>Tasks: {workflow.tasks}</li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="tasks" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>08</p>
            <h2>Task management</h2>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => toggleForm("tasks")}
          >
            {openForms.tasks ? "Close" : "Create task"}
          </button>
        </div>

        {openForms.tasks ? (
          <ResourceCreateForm
            resource="tasks"
            title="task"
            fields={[
              { name: "title", label: "Task title", required: true, maxLength: 240 },
              { name: "description", label: "Description", type: "textarea" },
              { name: "workflow_id", label: "Workflow", type: "select", nullable: true, options: workflowOptions },
              { name: "customer_id", label: "Customer", type: "select", nullable: true, options: customerOptions },
              { name: "assigned_employee_id", label: "Assigned employee", type: "select", nullable: true, options: employeeOptions },
              { name: "priority", label: "Priority", type: "select", options: [
                { value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" },
                { value: "HIGH", label: "High" }, { value: "URGENT", label: "Urgent" },
              ] },
              { name: "start_date", label: "Start date", type: "date", nullable: true },
              { name: "due_date", label: "Due date", type: "date", nullable: true },
            ]}
            onSaved={reloadAfterCreate}
            onCancel={() => toggleForm("tasks")}
          />
        ) : null}

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Task</th>
                <th className={styles.tableHeader}>Assignee</th>
                <th className={styles.tableHeader}>Priority</th>
                <th className={styles.tableHeader}>Status</th>
                <th className={styles.tableHeader}>Due date</th>
              </tr>
            </thead>
            <tbody>
              {taskRows.map((task) => (
                <tr key={task.id}>
                  <td className={styles.tableCell}>
                    <strong>{task.title}</strong>
                    <div className={styles.metaLine}>{task.customer}</div>
                  </td>
                  <td className={styles.tableCell}>{task.employee}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.badge} ${task.priority === "High" ? styles.badgeOrange : task.priority === "Medium" ? styles.badgeYellow : styles.badgeSlate}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {backendMode === "live" ? (
                      <select
                        aria-label={`Update task status: ${task.title}`}
                        value={task.status}
                        onChange={(event) =>
                          void updateResource("tasks", task.id, {
                            status: event.target.value.replaceAll(" ", "_").toUpperCase(),
                          })
                        }
                      >
                        {Object.keys(taskStatusClasses).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`${styles.badge} ${taskStatusClasses[task.status]}`}>
                        {task.status}
                      </span>
                    )}
                  </td>
                  <td className={styles.tableCell}>{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="projects" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>09</p>
            <h2>Project management</h2>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => toggleForm("projects")}
          >
            {openForms.projects ? "Close" : "New project"}
          </button>
        </div>
        {openForms.projects ? (
          <ResourceCreateForm
            resource="projects"
            title="project"
            fields={[
              { name: "name", label: "Project name", required: true, maxLength: 200 },
              { name: "description", label: "Description", type: "textarea" },
              { name: "customer_id", label: "Customer", type: "select", nullable: true, options: customerOptions },
              { name: "status", label: "Status", type: "select", options: [
                { value: "PLANNING", label: "Planning" }, { value: "ACTIVE", label: "Active" },
                { value: "ON_HOLD", label: "On hold" }, { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
              ] },
              { name: "progress", label: "Progress (%)", type: "number" },
              { name: "start_date", label: "Start date", type: "date", nullable: true },
              { name: "due_date", label: "Due date", type: "date", nullable: true },
            ]}
            onSaved={reloadAfterCreate}
            onCancel={() => toggleForm("projects")}
          />
        ) : null}
        {projectRows.length ? (
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Project</th>
                  <th className={styles.tableHeader}>Customer</th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Progress</th>
                  <th className={styles.tableHeader}>Due date</th>
                </tr>
              </thead>
              <tbody>
                {projectRows.map((project) => (
                  <tr key={project.id}>
                    <td className={styles.tableCell}>{project.name}</td>
                    <td className={styles.tableCell}>{project.customer}</td>
                    <td className={styles.tableCell}>
                      {backendMode === "live" ? (
                        <select
                          aria-label={`Update project status: ${project.name}`}
                          value={project.status.replaceAll(" ", "_")}
                          onChange={(event) =>
                            void updateResource("projects", project.id, { status: event.target.value })
                          }
                        >
                          {["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"].map((status) => (
                            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                          ))}
                        </select>
                      ) : project.status}
                    </td>
                    <td className={styles.tableCell}>{project.progress}%</td>
                    <td className={styles.tableCell}>{project.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.emptyState}>No project records are available in this database yet.</p>
        )}
      </section>

      <section id="notifications" className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>10</p>
            <h2>Notifications</h2>
          </div>
        </div>

        {notificationRows.length ? (
          <div className={styles.workflowGrid}>
            {notificationRows.slice(0, 6).map((notification) => (
              <article key={notification.id} className={styles.workflowCard}>
                <div className={styles.listCardHeader}>
                  <div>
                    <strong>{notification.title}</strong>
                    <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`${styles.badge} ${notification.readAt ? styles.badgeSlate : styles.badgeBlue}`}>
                    {notification.readAt ? "Read" : "Unread"}
                  </span>
                </div>
                <p>{notification.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>No in-app notifications have been created yet.</p>
        )}
      </section>

      <footer className={styles.footerNote}>
        <Building2 size={16} aria-hidden="true" />
        <span>
          {backendMode === "live"
            ? "CRM, sales, communication, follow-up, team, workflow, task, and project records are loaded from Supabase. Notifications are in-app only; no email, SMS, or WhatsApp messages are sent."
            : "Demo records are clearly identified and are not business performance data. Configure Supabase to persist real customer, enquiry, workflow, task, and project records."}
        </span>
      </footer>
    </div>
  );
}
