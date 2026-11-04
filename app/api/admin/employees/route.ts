import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

const employeeInput = z.object({
  profile_id: z.string().uuid().nullable().optional(),
  employee_code: z.string().trim().max(40).nullable().optional(),
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254),
  designation: z.string().max(160).optional().default(""),
  department: z.string().max(120).optional().default(""),
  account_status: z.enum(["ACTIVE", "ON_LEAVE", "INACTIVE"]).default("ACTIVE"),
});

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { data, error } = await auth.supabase
    .from("employees")
    .select("id, profile_id, employee_code, name, email, designation, department, account_status, profile:user_profiles!employees_profile_id_fkey(display_name, role)")
    .order("name");
  if (error) {
    console.error("Could not load employees:", error.message);
    return NextResponse.json({ error: "Employees could not be loaded." }, { status: 500 });
  }
  return NextResponse.json({ employees: data });
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
  const parsed = employeeInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Employee information is invalid." }, { status: 400 });
  }
  const { data, error } = await auth.supabase
    .from("employees")
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    console.error("Could not create employee:", error.message);
    return NextResponse.json({ error: "Employee record could not be created." }, { status: error.code === "42501" ? 403 : 400 });
  }
  return NextResponse.json({ employee: data }, { status: 201 });
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
  const parsed = employeeInput.partial().extend({ id: z.string().uuid() }).safeParse(body);
  if (!parsed.success || !Object.keys(parsed.data).some((key) => key !== "id")) {
    return NextResponse.json({ error: "Employee update is invalid." }, { status: 400 });
  }
  const { id, ...changes } = parsed.data;
  const { data, error } = await auth.supabase
    .from("employees")
    .update(changes)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) {
    console.error("Could not update employee:", error.message);
    return NextResponse.json({ error: "Employee record could not be updated." }, { status: error.code === "42501" ? 403 : 400 });
  }
  if (!data) return NextResponse.json({ error: "Employee not found or access denied." }, { status: 404 });
  return NextResponse.json({ employee: data });
}
