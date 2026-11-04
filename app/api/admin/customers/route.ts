import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

const createCustomerSchema = z.object({
  name: z.string().trim().min(1).max(160),
  company_name: z.string().trim().max(200).nullable().optional(),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).nullable().optional(),
  phone: z.string().trim().max(32).nullable().optional(),
  location: z.string().trim().max(200).nullable().optional(),
  service_slug: z.string().max(120).optional().default(""),
  customer_type: z.enum(["CORPORATE", "DEVELOPER", "HOMEOWNER", "INSTITUTION", "OTHER"]).default("OTHER"),
  status: z.enum(["ACTIVE", "FOLLOW_UP", "QUALIFIED", "ARCHIVED"]).default("ACTIVE"),
  assigned_employee_id: z.string().uuid().nullable().optional(),
  internal_notes: z.string().max(5000).optional().default(""),
});

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.replace(/[%,()]/g, " ").trim().slice(0, 100);
  const status = searchParams.get("status");
  let requestQuery = auth.supabase
    .from("customers")
    .select("id, customer_code, name, company_name, email, phone, location, primary_service_id, primary_service:services!customers_primary_service_id_fkey(title, slug), assigned_employee_id, assigned_employee:employees!customers_assigned_employee_id_fkey(name), customer_type, status, internal_notes, created_at, updated_at, archived_at")
    .order("created_at", { ascending: false });

  if (query) {
    requestQuery = requestQuery.or(
      `name.ilike.%${query}%,company_name.ilike.%${query}%,email.ilike.%${query}%`,
    );
  }
  if (status && status !== "ALL") requestQuery = requestQuery.eq("status", status);

  const { data, error } = await requestQuery;
  if (error) {
    console.error("Could not load customers:", error.message);
    return NextResponse.json({ error: "Customers could not be loaded." }, { status: 500 });
  }
  return NextResponse.json({ customers: data });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = createCustomerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Customer information is invalid." }, { status: 400 });
  }

  let serviceId: string | null = null;
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
  }

  const customerInput = createCustomerSchema
    .omit({ service_slug: true })
    .parse(parsed.data);
  const { data, error } = await auth.supabase
    .from("customers")
    .insert({
      ...customerInput,
      email: customerInput.email || null,
      primary_service_id: serviceId,
      created_by: auth.user.id,
      archived_at: parsed.data.status === "ARCHIVED" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    console.error("Could not create customer:", error.message);
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: "Customer could not be created." }, { status });
  }
  return NextResponse.json({ customer: data }, { status: 201 });
}
