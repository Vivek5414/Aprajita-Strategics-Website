"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
  next: z.string().optional(),
});

export async function signInAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) redirect("/admin/login?error=invalid");

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/admin/login?error=unconfigured");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) redirect("/admin/login?error=credentials");

  const nextPath = parsed.data.next;
  redirect(nextPath?.startsWith("/admin") && nextPath !== "/admin/login" ? nextPath : "/admin");
}

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = z.string().email().max(254).safeParse(formData.get("email"));
  if (!parsed.success) redirect("/admin/reset-password?error=invalid");

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/admin/reset-password?error=unconfigured");
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/admin/reset-password`,
  });
  if (error) redirect("/admin/reset-password?error=send");
  redirect("/admin/reset-password?sent=1");
}

export async function exchangeRecoveryCodeAction(formData: FormData) {
  const code = z.string().min(1).max(2048).safeParse(formData.get("code"));
  if (!code.success) redirect("/admin/reset-password?error=session");

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/admin/reset-password?error=unconfigured");
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code.data);
  if (error) redirect("/admin/reset-password?error=session");
  redirect("/admin/reset-password?ready=1");
}

export async function updatePasswordAction(formData: FormData) {
  const password = z.string().min(12).max(128).safeParse(formData.get("password"));
  if (!password.success) redirect("/admin/reset-password?error=password");

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/admin/reset-password?error=unconfigured");
  }

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) redirect("/admin/reset-password?error=session");

  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) redirect("/admin/reset-password?error=update");
  redirect("/admin");
}

export async function signOutAction() {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/admin/login?error=unconfigured");
  }
  const { error } = await supabase.auth.signOut();
  if (error) redirect("/admin?error=signout");
  redirect("/admin/login");
}
