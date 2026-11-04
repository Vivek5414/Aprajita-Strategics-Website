import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isPublicAuthPage =
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname === "/admin/reset-password";

  if (!url || !anonKey || !isAdminRoute || isPublicAuthPage) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("employee_id")
    .eq("id", data.user.id)
    .maybeSingle();
  if (profileError || !profile) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "profile");
    return NextResponse.redirect(loginUrl);
  }
  if (profile.employee_id) {
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("account_status")
      .eq("id", profile.employee_id)
      .maybeSingle();
    if (employeeError || !employee || employee.account_status === "INACTIVE") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "inactive");
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
