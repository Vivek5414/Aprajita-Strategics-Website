import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

const priority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const uuidOrNull = z.string().uuid().nullable().optional();

const definitions = {
  leads: {
    table: "leads",
    create: z.object({
      name: z.string().trim().min(1).max(160),
      company_name: z.string().max(200).nullable().optional(),
      enquiry_id: uuidOrNull,
      customer_id: uuidOrNull,
      service_id: uuidOrNull,
      stage: z.enum(["NEW_LEAD", "CONTACTED", "QUALIFIED", "DISCUSSION", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"]).default("NEW_LEAD"),
      assigned_employee_id: uuidOrNull,
      opportunity_value: z.number().nonnegative().nullable().optional(),
      currency: z.string().length(3).default("INR"),
      last_interaction_at: z.string().datetime().nullable().optional(),
      next_follow_up_at: z.string().datetime().nullable().optional(),
    }),
  },
  communications: {
    table: "communications",
    create: z.object({
      customer_id: uuidOrNull,
      enquiry_id: uuidOrNull,
      project_id: uuidOrNull,
      communication_type: z.enum(["CALL", "EMAIL", "MEETING", "WHATSAPP", "GENERAL", "INTERNAL_NOTE"]),
      summary: z.string().trim().min(1).max(5000),
      next_action: z.string().max(2000).nullable().optional(),
      occurred_at: z.string().datetime().optional(),
      follow_up_at: z.string().datetime().nullable().optional(),
    }),
  },
  follow_ups: {
    table: "follow_ups",
    create: z.object({
      customer_id: uuidOrNull,
      enquiry_id: uuidOrNull,
      assigned_employee_id: uuidOrNull,
      title: z.string().trim().min(1).max(200),
      notes: z.string().max(5000).optional().default(""),
      reminder_at: z.string().datetime(),
      status: z.enum(["UPCOMING", "DUE_TODAY", "OVERDUE", "COMPLETED", "CANCELLED"]).default("UPCOMING"),
      completed_at: z.string().datetime().nullable().optional(),
    }),
  },
  projects: {
    table: "projects",
    create: z.object({
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).nullable().optional(),
      name: z.string().trim().min(1).max(200),
      description: z.string().max(10000).optional().default(""),
      customer_id: uuidOrNull,
      status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).default("PLANNING"),
      priority: priority.default("MEDIUM"),
      start_date: z.string().date().nullable().optional(),
      due_date: z.string().date().nullable().optional(),
      progress: z.number().int().min(0).max(100).default(0),
      budget: z.number().nonnegative().nullable().optional(),
      currency: z.string().length(3).default("INR"),
      is_published: z.boolean().default(false),
    }),
  },
  project_milestones: {
    table: "project_milestones",
    create: z.object({
      project_id: z.string().uuid(),
      title: z.string().trim().min(1).max(200),
      description: z.string().max(5000).optional().default(""),
      due_date: z.string().date().nullable().optional(),
      completed_at: z.string().datetime().nullable().optional(),
      sort_order: z.number().int().default(0),
    }),
  },
  workflows: {
    table: "workflows",
    create: z.object({
      name: z.string().trim().min(1).max(200),
      description: z.string().max(10000).optional().default(""),
      customer_id: uuidOrNull,
      project_id: uuidOrNull,
      assigned_employee_id: uuidOrNull,
      status: z.enum(["DRAFT", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).default("DRAFT"),
      stage: z.string().max(100).default("Discovery"),
      priority: priority.default("MEDIUM"),
      start_date: z.string().date().nullable().optional(),
      due_date: z.string().date().nullable().optional(),
      progress: z.number().int().min(0).max(100).default(0),
      internal_notes: z.string().max(10000).optional().default(""),
    }),
  },
  tasks: {
    table: "workflow_tasks",
    create: z.object({
      workflow_id: uuidOrNull,
      project_id: uuidOrNull,
      customer_id: uuidOrNull,
      enquiry_id: uuidOrNull,
      title: z.string().trim().min(1).max(240),
      description: z.string().max(10000).optional().default(""),
      assigned_employee_id: uuidOrNull,
      status: z.enum(["TO_DO", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED", "BLOCKED"]).default("TO_DO"),
      priority: priority.default("MEDIUM"),
      start_date: z.string().date().nullable().optional(),
      due_date: z.string().date().nullable().optional(),
      completed_at: z.string().datetime().nullable().optional(),
    }),
  },
  task_comments: {
    table: "task_comments",
    create: z.object({
      task_id: z.string().uuid(),
      body: z.string().trim().min(1).max(5000),
    }),
  },
} as const;

type Resource = keyof typeof definitions;

const selectionByResource: Record<Resource, string> = {
  leads: "*, service:services(title, slug), assigned_employee:employees(name)",
  communications: "*, employee:employees(name)",
  follow_ups: "*, assigned_employee:employees(name), customer:customers(name), enquiry:enquiries(customer_name, reference_code)",
  projects: "*, customer:customers(name, company_name)",
  project_milestones: "*, project:projects(name)",
  workflows: "*, customer:customers(name), project:projects(name), assigned_employee:employees(name), workflow_tasks(id)",
  tasks: "*, workflow:workflows(name), customer:customers(name, company_name), enquiry:enquiries(reference_code), project:projects(name), assigned_employee:employees(name)",
  task_comments: "*, author:user_profiles(display_name)",
};

function partialSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.partial().extend({ id: z.string().uuid() });
}

function getUpdateSchema(resource: Resource) {
  switch (resource) {
    case "leads":
      return partialSchema(definitions.leads.create);
    case "communications":
      return partialSchema(definitions.communications.create);
    case "follow_ups":
      return partialSchema(definitions.follow_ups.create);
    case "projects":
      return partialSchema(definitions.projects.create);
    case "project_milestones":
      return partialSchema(definitions.project_milestones.create);
    case "workflows":
      return partialSchema(definitions.workflows.create);
    case "tasks":
      return partialSchema(definitions.tasks.create);
    case "task_comments":
      return partialSchema(definitions.task_comments.create);
  }
}

function hasRequiredRelation(resource: Resource, value: Record<string, unknown>) {
  switch (resource) {
    case "communications":
      return Boolean(value.customer_id || value.enquiry_id || value.project_id);
    case "follow_ups":
      return Boolean(value.customer_id || value.enquiry_id);
    case "workflows":
      return Boolean(value.customer_id || value.project_id);
    case "tasks":
      return Boolean(value.workflow_id || value.project_id || value.customer_id || value.enquiry_id);
    default:
      return true;
  }
}

function isResource(value: string): value is Resource {
  return Object.hasOwn(definitions, value);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource)) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  const { data, error } = await auth.supabase
    .from(definitions[resource].table)
    .select(selectionByResource[resource])
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    console.error(`Could not load ${resource}:`, error.message);
    return NextResponse.json({ error: `${resource} could not be loaded.` }, { status: 500 });
  }
  return NextResponse.json({ records: data });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource)) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const definition = definitions[resource];
  const parsed = definition.create.safeParse(body);
  if (!parsed.success || !hasRequiredRelation(resource, parsed.data as Record<string, unknown>)) {
    return NextResponse.json({ error: `${resource} data is invalid.` }, { status: 400 });
  }
  const userField = resource === "task_comments"
    ? { author_id: auth.user.id }
    : { created_by: auth.user.id };
  const input = parsed.data as Record<string, unknown>;
  const normalizedInput = {
    ...input,
    ...(["tasks", "follow_ups"].includes(resource)
      ? {
          completed_at:
            input.status === "COMPLETED"
              ? input.completed_at ?? new Date().toISOString()
              : null,
        }
      : {}),
  };
  const { data, error } = await auth.supabase
    .from(definition.table)
    .insert({ ...normalizedInput, ...userField })
    .select()
    .single();
  if (error) {
    console.error(`Could not create ${resource}:`, error.message);
    return NextResponse.json({ error: `${resource} could not be created.` }, { status: error.code === "42501" ? 403 : 400 });
  }
  return NextResponse.json({ record: data }, { status: 201 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource)) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const definition = definitions[resource];
  const parsed = getUpdateSchema(resource).safeParse(body);
  if (!parsed.success || !Object.keys(parsed.data).some((key) => key !== "id")) {
    return NextResponse.json({ error: `${resource} update is invalid.` }, { status: 400 });
  }
  const { id, ...changes } = parsed.data;
  const normalizedChanges = {
    ...changes,
    ...(resource === "tasks" && "status" in changes
      ? {
          completed_at:
            changes.status === "COMPLETED"
              ? new Date().toISOString()
              : null,
        }
      : {}),
    ...(resource === "follow_ups" && "status" in changes
      ? {
          completed_at:
            changes.status === "COMPLETED"
              ? new Date().toISOString()
              : null,
        }
      : {}),
  };
  const { data, error } = await auth.supabase
    .from(definition.table)
    .update(normalizedChanges)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) {
    console.error(`Could not update ${resource}:`, error.message);
    return NextResponse.json({ error: `${resource} could not be updated.` }, { status: error.code === "42501" ? 403 : 400 });
  }
  if (!data) return NextResponse.json({ error: `${resource} not found or access denied.` }, { status: 404 });
  return NextResponse.json({ record: data });
}
