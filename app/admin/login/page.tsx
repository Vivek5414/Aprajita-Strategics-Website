import type { Metadata } from "next";
import Link from "next/link";
import { signInAction } from "./actions";
import styles from "../AdminPlaceholder.module.css";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

const messages: Record<string, string> = {
  invalid: "Enter a valid email address and password.",
  credentials: "The email or password was not accepted.",
  unconfigured: "Supabase is not configured. Add the required environment variables.",
  profile: "Your team profile could not be verified. Contact an administrator.",
  inactive: "This account is inactive or is not linked to an active employee. Contact an administrator.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>APRAJITA STRATEGICS</p>
        <h1>Admin sign in</h1>
        <p>Sign in with your authorized team account.</p>
        {error && (
          <p role="alert">
            {messages[error] ?? "Sign in could not be completed. Please try again."}
          </p>
        )}
        <form action={signInAction} className={styles.loginForm}>
          <input type="hidden" name="next" value={next ?? ""} />
          <label htmlFor="admin-email">Email address</label>
          <input id="admin-email" name="email" type="email" autoComplete="email" required maxLength={254} />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
          <button className="button button--primary" type="submit">Sign in</button>
        </form>
        <Link href="/admin/reset-password">Forgot your password?</Link>
      </div>
    </section>
  );
}
