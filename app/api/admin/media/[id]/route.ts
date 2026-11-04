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
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const { data: file, error } = await auth.supabase
    .from("media_files")
    .select("bucket_id, object_path")
    .eq("id", id)
    .maybeSingle();
  if (error || !file) {
    return NextResponse.json({ error: "File not found or access denied." }, { status: 404 });
  }

  const { data, error: signedUrlError } = await auth.supabase.storage
    .from(file.bucket_id)
    .createSignedUrl(file.object_path, 60);
  if (signedUrlError || !data) {
    console.error("Could not create secure file URL:", signedUrlError?.message ?? "No URL returned.");
    return NextResponse.json({ error: "File could not be accessed." }, { status: 403 });
  }
  return NextResponse.json({ url: data.signedUrl });
}
