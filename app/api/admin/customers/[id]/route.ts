import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

const updateCustomerSchema = z
  .object({
    name: z.string().trim().min(1).max(160).optional(),
    company_name: z.string().trim().max(200).nullable().optional(),
    email: z.union([z.string().trim().email().max(254), z.literal("")]).nullable().optional(),
    phone: z.string().trim().max(32).nullable().optional(),
    location: z.string().trim().max(200).nullable().optional(),
    service_slug: z.string().max(120).optional(),
    customer_type: z.enum(["CORPORATE", "DEVELOPER", "HOMEOWNER", "INSTITUTION", "OTHER"]).optional(),
    status: z.enum(["ACTIVE", "FOLLOW_UP", "QUALIFIED", "ARCHIVED"]).optional(),
    assigned_employee_id: z.string().uuid().nullable().optional(),
    internal_notes: z.string().max(5000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  const { data, error } = await auth.supabase
    .from("customers")
    .select("*, primary_service:services!customers_primary_service_id_fkey(title, slug), enquiries(id, reference_code, customer_name, service_slug, status, submitted_at), communications(id, communication_type, summary, occurred_at, follow_up_at, employee:employees(name)), follow_ups(id, title, reminder_at, status), projects(id, name, status, progress, due_date), media_files(id, original_name, content_type, size_bytes, created_at)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("Could not load customer details:", error.message);
    return NextResponse.json({ error: "Customer details could not be loaded." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  return NextResponse.json({ customer: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = updateCustomerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Customer information is invalid." }, { status: 400 });
  }
  let serviceId: string | null | undefined;
  if (parsed.data.service_slug !== undefined) {
    if (parsed.data.service_slug) {
      const { data: service, error: serviceError } = await auth.supabase
        .from("services")
        .select("id")
        .eq("slug", parsed.data.service_slug)
        .maybeSingle();
      if (serviceError || !service) {
        return NextResponse.json({ error: "Selected service is not available." }, { status: 400 });
      }
      serviceId = service.id;
    } else {
      serviceId = null;
    }
  }
  const inputChanges = { ...parsed.data };
  delete inputChanges.service_slug;
  const changes = {
    ...inputChanges,
    ...(serviceId !== undefined ? { primary_service_id: serviceId } : {}),
    ...(parsed.data.email !== undefined ? { email: parsed.data.email || null } : {}),
    ...(parsed.data.status !== undefined
      ? { archived_at: parsed.data.status === "ARCHIVED" ? new Date().toISOString() : null }
      : {}),
  };
  const { data, error } = await auth.supabase
    .from("customers")
    .update(changes)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Could not update customer:", error.message);
    return NextResponse.json(
      { error: "Customer could not be updated." },
      { status: error.code === "42501" ? 403 : 500 },
    );
  }
  if (!data) return NextResponse.json({ error: "Customer not found or access denied." }, { status: 404 });
  return NextResponse.json({ customer: data });
}
