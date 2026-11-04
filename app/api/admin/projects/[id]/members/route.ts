import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

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
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  const { data, error } = await auth.supabase
    .from("project_members")
    .select("employee_id, employee:employees(name, designation, department)")
    .eq("project_id", id);
  if (error) {
    console.error("Could not load project team:", error.message);
    return NextResponse.json({ error: "Project team could not be loaded." }, { status: 500 });
  }
  return NextResponse.json({ members: data });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = z.object({ employee_id: z.string().uuid() }).safeParse(body);
  if (!z.string().uuid().safeParse(id).success || !parsed.success) {
    return NextResponse.json({ error: "Project team assignment is invalid." }, { status: 400 });
  }
  const { data, error } = await auth.supabase
    .from("project_members")
    .insert({
      project_id: id,
      employee_id: parsed.data.employee_id,
      assigned_by: auth.user.id,
    })
    .select("project_id, employee_id")
    .single();
  if (error) {
    console.error("Could not assign project member:", error.message);
    return NextResponse.json({ error: "Project member could not be assigned." }, { status: error.code === "42501" ? 403 : 400 });
  }
  return NextResponse.json({ member: data }, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  const employeeId = new URL(request.url).searchParams.get("employee_id");
  if (!z.string().uuid().safeParse(id).success || !z.string().uuid().safeParse(employeeId).success) {
    return NextResponse.json({ error: "Project member is invalid." }, { status: 400 });
  }
  const { error } = await auth.supabase
    .from("project_members")
    .delete()
    .eq("project_id", id)
    .eq("employee_id", employeeId);
  if (error) {
    console.error("Could not remove project member:", error.message);
    return NextResponse.json({ error: "Project member could not be removed." }, { status: error.code === "42501" ? 403 : 400 });
  }
  return new NextResponse(null, { status: 204 });
}
