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
    .from("notifications")
    .select("id, kind, title, body, entity_type, entity_id, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("Could not load notifications:", error.message);
    return NextResponse.json({ error: "Notifications could not be loaded." }, { status: 500 });
  }
  return NextResponse.json({ notifications: data });
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
  const parsed = z.object({ id: z.string().uuid(), read: z.boolean() }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Notification update is invalid." }, { status: 400 });
  }
  const { data, error } = await auth.supabase
    .from("notifications")
    .update({ read_at: parsed.data.read ? new Date().toISOString() : null })
    .eq("id", parsed.data.id)
    .select("id, read_at")
    .maybeSingle();
  if (error) {
    console.error("Could not update notification:", error.message);
    return NextResponse.json({ error: "Notification could not be updated." }, { status: error.code === "42501" ? 403 : 400 });
  }
  if (!data) return NextResponse.json({ error: "Notification not found or access denied." }, { status: 404 });
  return NextResponse.json({ notification: data });
}
