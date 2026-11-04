import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";
import { z } from "zod";

const allowedTypes = new Map([
  ["application/pdf", "pdf"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maximumSize = 20 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const customerId = formData?.get("customerId");
  const projectId = formData?.get("projectId");
  if (!(file instanceof File) || (typeof customerId !== "string" && typeof projectId !== "string")) {
    return NextResponse.json({ error: "A file and related customer or project are required." }, { status: 400 });
  }
  if (
    (typeof customerId === "string" && typeof projectId === "string") ||
    (typeof customerId === "string" && !z.string().uuid().safeParse(customerId).success) ||
    (typeof projectId === "string" && !z.string().uuid().safeParse(projectId).success)
  ) {
    return NextResponse.json({ error: "The related record is invalid." }, { status: 400 });
  }
  const extension = allowedTypes.get(file.type);
  if (!extension || file.size < 1 || file.size > maximumSize) {
    return NextResponse.json(
      { error: "Upload a PDF or JPG, PNG, or WebP file no larger than 20 MB." },
      { status: 400 },
    );
  }
  const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const signatures: Record<string, (bytes: Uint8Array) => boolean> = {
    "application/pdf": (bytes) =>
      bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46,
    "image/jpeg": (bytes) =>
      bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
    "image/png": (bytes) =>
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47,
    "image/webp": (bytes) =>
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50,
  };
  if (!signatures[file.type]?.(signature)) {
    return NextResponse.json({ error: "File content does not match the selected file type." }, { status: 400 });
  }

  if (typeof customerId === "string") {
    const { data, error } = await auth.supabase
      .from("customers")
      .select("id")
      .eq("id", customerId)
      .maybeSingle();
    if (error || !data) {
      return NextResponse.json({ error: "Customer not found or access denied." }, { status: 404 });
    }
  } else if (typeof projectId === "string") {
    const { data, error } = await auth.supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .maybeSingle();
    if (error || !data) {
      return NextResponse.json({ error: "Project not found or access denied." }, { status: 404 });
    }
  }

  const recordId = typeof customerId === "string" ? customerId : String(projectId);
  const objectPath = `${typeof customerId === "string" ? "customers" : "projects"}/${recordId}/${randomUUID()}.${extension}`;
  const { error: uploadError } = await auth.supabase.storage
    .from("customer-documents")
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
    });
  if (uploadError) {
    console.error("Could not upload customer/project document:", uploadError.message);
    return NextResponse.json({ error: "The file could not be uploaded." }, { status: 400 });
  }

  const { data, error: metadataError } = await auth.supabase
    .from("media_files")
    .insert({
      bucket_id: "customer-documents",
      object_path: objectPath,
      original_name: file.name.slice(0, 255),
      content_type: file.type,
      size_bytes: file.size,
      uploaded_by: auth.user.id,
      customer_id: typeof customerId === "string" ? customerId : null,
      project_id: typeof projectId === "string" ? projectId : null,
      is_public: false,
    })
    .select("id, original_name, content_type, size_bytes, created_at")
    .single();

  if (metadataError) {
    const { error: cleanupError } = await auth.supabase.storage
      .from("customer-documents")
      .remove([objectPath]);
    if (cleanupError) {
      console.error("Uploaded file cleanup failed:", cleanupError.message);
    }
    console.error("Could not save uploaded-file metadata:", metadataError.message);
    return NextResponse.json({ error: "The file was uploaded but could not be registered." }, { status: 500 });
  }
  return NextResponse.json({ file: data }, { status: 201 });
}
