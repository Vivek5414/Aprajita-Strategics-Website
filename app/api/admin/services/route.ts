import { NextResponse } from "next/server";
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
    .from("services")
    .select("id, slug, title")
    .eq("is_published", true)
    .order("title");
  if (error) {
    console.error("Could not load services:", error.message);
    return NextResponse.json({ error: "Services could not be loaded." }, { status: 500 });
  }
  return NextResponse.json({ services: data });
}
