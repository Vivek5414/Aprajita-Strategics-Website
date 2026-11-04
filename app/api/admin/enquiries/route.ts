import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

const enquiryStatus = z.enum([
  "NEW",
  "UNASSIGNED",
  "ASSIGNED",
  "CONTACTED",
  "FOLLOW_UP_REQUIRED",
  "UNDER_DISCUSSION",
  "PROPOSAL_SENT",
  "CONVERTED",
  "NOT_INTERESTED",
  "CLOSED",
]);

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const service = searchParams.get("service");
  let query = auth.supabase
    .from("enquiries")
    .select("id, reference_code, customer_id, customer_name, email, phone, company_name, service_slug, project_location, project_requirements, source, status, priority, assigned_employee_id, assigned_employee:employees!enquiries_assigned_employee_id_fkey(name), submitted_at, created_at")
    .order("submitted_at", { ascending: false });
  if (status && status !== "ALL") query = query.eq("status", status);
  if (service && service !== "ALL") query = query.eq("service_slug", service);

  const { data, error } = await query;
  if (error) {
    console.error("Could not load enquiries:", error.message);
    return NextResponse.json({ error: "Enquiries could not be loaded." }, { status: 500 });
  }
  return NextResponse.json({ enquiries: data });
}

export async function PATCH(request: Request) {
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

  const parsed = z
    .object({
      id: z.string().min(1).max(64),
      status: enquiryStatus.optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
      assigned_employee_id: z.string().uuid().nullable().optional(),
      customer_id: z.string().uuid().nullable().optional(),
    })
    .refine(({ status, priority, assigned_employee_id, customer_id }) =>
      [status, priority, assigned_employee_id, customer_id].some((value) => value !== undefined),
    )
    .safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enquiry update is invalid." }, { status: 400 });
  }

  const { id, ...changes } = parsed.data;
  const isUuid = z.string().uuid().safeParse(id).success;
  const { data, error } = await auth.supabase
  .from("enquiries")
  .update(changes)
  .eq(isUuid ? "id" : "reference_code", id)
    .select()
    .maybeSingle();
  if (error) {
    console.error("Could not update enquiry:", error.message);
    return NextResponse.json({ error: "Enquiry could not be updated." }, { status: error.code === "42501" ? 403 : 500 });
  }
  if (!data) return NextResponse.json({ error: "Enquiry not found or access denied." }, { status: 404 });
  return NextResponse.json({ enquiry: data });
}
