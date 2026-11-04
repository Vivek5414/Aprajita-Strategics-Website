import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { services } from "@/app/data/services";
import { createSupabaseAdminClient } from "@/app/lib/supabase/server";

const enquirySchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
    phone: z.union([z.string().trim().max(32), z.literal("")]).optional(),
    company: z.string().trim().max(200).optional().default(""),
    service: z.string().max(120).optional().default(""),
    projectLocation: z.string().trim().max(200).optional().default(""),
    requirements: z.string().trim().max(5000).optional().default(""),
    source: z.enum(["WEBSITE_CONTACT", "WEBSITE_QUICK"]).default("WEBSITE_CONTACT"),
    website: z.string().max(0).optional(),
  })
  .refine((value) => Boolean(value.email || value.phone), {
    message: "An email or phone number is required.",
  })
  .refine(
    (value) => value.source === "WEBSITE_QUICK" || value.requirements.length > 0,
    { message: "Project requirements are required." },
  );

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the enquiry details and try again." }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ error: "Enquiry could not be accepted." }, { status: 400 });
  }
  if (
    parsed.data.service &&
    !services.some((service) => service.slug === parsed.data.service)
  ) {
    return NextResponse.json({ error: "Selected service is not available." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Enquiry service is not configured. Please contact us by phone or email." },
      { status: 503 },
    );
  }

  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get("x-real-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const fingerprint = createHash("sha256")
    .update(
      `${clientIp}:${process.env.ENQUIRY_RATE_LIMIT_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
    )
    .digest("hex");
  const { data: accepted, error: rateLimitError } = await supabase.rpc(
    "register_public_submission",
    { p_fingerprint: fingerprint },
  );
  if (rateLimitError) {
    console.error("Could not check enquiry rate limit:", rateLimitError.message);
    return NextResponse.json({ error: "Enquiry could not be submitted. Please try again later." }, { status: 503 });
  }
  if (!accepted) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  const { data, error } = await supabase
    .rpc("submit_public_enquiry", {
      p_name: parsed.data.name,
      p_email: parsed.data.email ?? "",
      p_phone: parsed.data.phone ?? "",
      p_company: parsed.data.company,
      p_service_slug: parsed.data.service,
      p_project_location: parsed.data.projectLocation,
      p_requirements:
        parsed.data.requirements ||
        `Quick enquiry for ${services.find((service) => service.slug === parsed.data.service)?.title ?? "a consultation"}.`,
      p_source: parsed.data.source,
    })
    .single();

  const submission = data as
    | { reference_code: string; was_duplicate: boolean }
    | null;
  if (error || !submission) {
    console.error("Could not save public enquiry:", error?.message ?? "No response from Supabase.");
    return NextResponse.json({ error: "Enquiry could not be saved. Please try again later." }, { status: 503 });
  }

  return NextResponse.json(
    {
      referenceCode: submission.reference_code,
      duplicate: submission.was_duplicate,
    },
    { status: 201 },
  );
}
