import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { data, error } = await auth.supabase
    .from("user_profiles")
    .select("id, display_name, role, employee_id, avatar_path, created_at")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (error || !data) {
    console.error("Could not load user profile:", error?.message ?? "No profile row.");
    return NextResponse.json({ error: "User profile could not be loaded." }, { status: 404 });
  }
  return NextResponse.json({ profile: data });
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
  const parsed = z.object({ display_name: z.string().trim().max(160) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Profile information is invalid." }, { status: 400 });
  }
  const { data, error } = await auth.supabase
    .from("user_profiles")
    .update(parsed.data)
    .eq("id", auth.user.id)
    .select("id, display_name, role, employee_id, avatar_path")
    .single();
  if (error) {
    console.error("Could not update user profile:", error.message);
    return NextResponse.json({ error: "User profile could not be updated." }, { status: error.code === "42501" ? 403 : 400 });
  }
  return NextResponse.json({ profile: data });
}
