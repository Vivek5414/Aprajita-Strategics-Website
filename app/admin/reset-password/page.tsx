import type { Metadata } from "next";
import Link from "next/link";
import {
  exchangeRecoveryCodeAction,
  requestPasswordResetAction,
  updatePasswordAction,
} from "@/app/admin/login/actions";
import styles from "../AdminPlaceholder.module.css";

export const metadata: Metadata = {
  title: "Reset admin password",
  robots: { index: false, follow: false },
};

const errors: Record<string, string> = {
  invalid: "Enter a valid email address.",
  unconfigured: "Supabase is not configured. Add the required environment variables.",
  send: "The reset email could not be sent. Please try again.",
  password: "Choose a password with at least 12 characters.",
  session: "This password reset link is invalid or has expired. Request a new link.",
  update: "The password could not be updated. Please try again.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string; code?: string; ready?: string }>;
}) {
  const { error, sent, code, ready } = await searchParams;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>Account recovery</p>
        <h1>Reset your password</h1>
        {error && <p role="alert">{errors[error] ?? "Password recovery failed."}</p>}
        {sent ? (
          <p role="status">If the account is registered, a password reset email has been sent.</p>
        ) : code && !ready ? (
          <form action={exchangeRecoveryCodeAction} className={styles.loginForm}>
            <input type="hidden" name="code" value={code} />
            <button className="button button--primary" type="submit">Continue password reset</button>
          </form>
        ) : ready ? (
          <form action={updatePasswordAction} className={styles.loginForm}>
            <label htmlFor="new-password">New password</label>
            <input id="new-password" name="password" type="password" minLength={12} autoComplete="new-password" required />
            <button className="button button--primary" type="submit">Update password</button>
          </form>
        ) : (
          <form action={requestPasswordResetAction} className={styles.loginForm}>
            <label htmlFor="reset-email">Email address</label>
            <input id="reset-email" name="email" type="email" autoComplete="email" required maxLength={254} />
            <button className="button button--primary" type="submit">Send reset link</button>
          </form>
        )}
        <Link href="/admin/login">Return to sign in</Link>
      </div>
    </section>
  );
}
