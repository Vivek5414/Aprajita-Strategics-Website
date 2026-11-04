import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await params;
  let enquiryId = id;
  if (!z.string().uuid().safeParse(id).success) {
    const { data: enquiry, error: lookupError } = await auth.supabase
      .from("enquiries")
      .select("id")
      .eq("reference_code", id)
      .maybeSingle();
    if (lookupError) {
      console.error("Could not look up enquiry for conversion:", lookupError.message);
      return NextResponse.json({ error: "Enquiry could not be found." }, { status: 500 });
    }
    if (!enquiry) return NextResponse.json({ error: "Enquiry not found or access denied." }, { status: 404 });
    enquiryId = enquiry.id;
  }

  const { data: customerId, error } = await auth.supabase.rpc(
    "convert_enquiry_to_customer",
    { p_enquiry_id: enquiryId },
  );
  if (error || !customerId) {
    console.error("Could not convert enquiry:", error?.message ?? "No customer id returned.");
    return NextResponse.json({ error: "Enquiry could not be converted." }, { status: error?.code === "42501" ? 403 : 400 });
  }
  return NextResponse.json({ customerId });
}
