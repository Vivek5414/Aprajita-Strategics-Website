"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./CustomerProfile.module.css";

type CustomerProfile = {
  id: string;
  customer_code: string;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  status: string;
  internal_notes: string;
  primary_service: { title: string; slug: string } | null;
  enquiries: Array<{ id: string; reference_code: string; status: string; service_slug: string | null; submitted_at: string }>;
  communications: Array<{ id: string; communication_type: string; summary: string; occurred_at: string; follow_up_at: string | null; employee: { name: string } | null }>;
  follow_ups: Array<{ id: string; title: string; reminder_at: string; status: string }>;
  projects: Array<{ id: string; name: string; status: string; progress: number; due_date: string | null }>;
  media_files: Array<{ id: string; original_name: string; content_type: string; size_bytes: number; created_at: string }>;
};

const tabs = [
  "Overview",
  "Enquiries",
  "Projects",
  "Communication History",
  "Follow-ups",
  "Notes",
  "Documents",
] as const;

type Tab = (typeof tabs)[number];

export default function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCustomer = useCallback(async () => {
    const response = await fetch(`/api/admin/customers/${id}`, { cache: "no-store" }).catch(() => null);
    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setError(result.error ?? "Customer profile could not be loaded.");
      setLoading(false);
      return;
    }
    const result = (await response.json()) as { customer: CustomerProfile };
    setCustomer(result.customer);
    setError("");
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void Promise.resolve().then(loadCustomer);
  }, [loadCustomer]);

  async function saveCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer) return;
    setSaving(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        company_name: formData.get("company"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        location: formData.get("location"),
      }),
    }).catch(() => null);
    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setError(result.error ?? "Customer changes could not be saved.");
      setSaving(false);
      return;
    }
    await loadCustomer();
    setMessage("Customer details saved.");
    setSaving(false);
  }

  async function saveNotes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer) return;
    const notes = new FormData(event.currentTarget).get("internal_notes");
    const response = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internal_notes: notes }),
    }).catch(() => null);
    if (!response?.ok) {
      setError("Notes could not be saved. Check your access and try again.");
      return;
    }
    await loadCustomer();
    setMessage("Internal notes saved.");
  }

  async function uploadDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("customerId", customer.id);
    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    }).catch(() => null);
    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setError(result.error ?? "Document could not be uploaded.");
      return;
    }
    await loadCustomer();
    setMessage("Document uploaded securely.");
    form.reset();
  }

  async function openDocument(fileId: string) {
    const response = await fetch(`/api/admin/media/${fileId}`).catch(() => null);
    if (!response?.ok) {
      setError("Document could not be opened.");
      return;
    }
    const result = (await response.json()) as { url: string };
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return <main className={styles.page}><p role="status">Loading customer profile...</p></main>;
  }
  if (!customer) {
    return (
      <main className={styles.page}>
        <p role="alert">{error || "Customer not found or access denied."}</p>
        <Link href="/admin">Back to dashboard</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link href="/admin" className={styles.backLink}>← Admin dashboard</Link>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Customer profile · {customer.customer_code}</p>
          <h1>{customer.name}</h1>
          <p>{customer.company_name || "Independent customer"} · {customer.status}</p>
        </div>
      </header>
      {error ? <p className={styles.alert} role="alert">{error}</p> : null}
      {message ? <p className={styles.message} role="status">{message}</p> : null}

      <nav className={styles.tabs} aria-label="Customer profile sections">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={activeTab === tab ? styles.activeTab : ""}
            aria-current={activeTab === tab ? "page" : undefined}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className={styles.panel}>
        {activeTab === "Overview" ? (
          <>
            <h2>Customer details</h2>
            <dl className={styles.details}>
              <div><dt>Email</dt><dd>{customer.email || "—"}</dd></div>
              <div><dt>Phone</dt><dd>{customer.phone || "—"}</dd></div>
              <div><dt>Location</dt><dd>{customer.location || "—"}</dd></div>
              <div><dt>Interested service</dt><dd>{customer.primary_service?.title || "—"}</dd></div>
              <div><dt>Enquiries</dt><dd>{customer.enquiries.length}</dd></div>
              <div><dt>Projects</dt><dd>{customer.projects.length}</dd></div>
            </dl>
            <h2 className={styles.subheading}>Edit customer</h2>
            <form className={styles.form} onSubmit={saveCustomer}>
              <label>Name<input name="name" defaultValue={customer.name} required maxLength={160} /></label>
              <label>Company<input name="company" defaultValue={customer.company_name ?? ""} maxLength={200} /></label>
              <label>Email<input name="email" type="email" defaultValue={customer.email ?? ""} maxLength={254} /></label>
              <label>Phone<input name="phone" defaultValue={customer.phone ?? ""} maxLength={32} /></label>
              <label>Location<input name="location" defaultValue={customer.location ?? ""} maxLength={200} /></label>
              <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
            </form>
          </>
        ) : null}
        {activeTab === "Enquiries" ? (
          <RecordList
            title="Enquiries"
            rows={customer.enquiries.map((item) => ({
              id: item.reference_code,
              title: item.service_slug || "Project enquiry",
              detail: `${item.status} · ${new Date(item.submitted_at).toLocaleString()}`,
            }))}
          />
        ) : null}
        {activeTab === "Projects" ? (
          <RecordList
            title="Projects"
            rows={customer.projects.map((item) => ({
              id: item.id,
              title: item.name,
              detail: `${item.status} · ${item.progress}% complete · Due ${item.due_date ?? "not set"}`,
            }))}
          />
        ) : null}
        {activeTab === "Communication History" ? (
          <RecordList
            title="Communication history"
            rows={customer.communications.map((item) => ({
              id: item.id,
              title: item.communication_type.replaceAll("_", " "),
              detail: `${new Date(item.occurred_at).toLocaleString()} · ${item.employee?.name ?? "Team member"} · ${item.summary}`,
            }))}
          />
        ) : null}
        {activeTab === "Follow-ups" ? (
          <RecordList
            title="Follow-ups"
            rows={customer.follow_ups.map((item) => ({
              id: item.id,
              title: item.title,
              detail: `${item.status} · ${new Date(item.reminder_at).toLocaleString()}`,
            }))}
          />
        ) : null}
        {activeTab === "Notes" ? (
          <form className={styles.form} onSubmit={saveNotes}>
            <h2>Internal notes</h2>
            <label>Notes<textarea name="internal_notes" defaultValue={customer.internal_notes} rows={8} maxLength={5000} /></label>
            <button type="submit">Save notes</button>
          </form>
        ) : null}
        {activeTab === "Documents" ? (
          <>
            <h2>Customer documents</h2>
            <form className={styles.uploadForm} onSubmit={uploadDocument}>
              <label>Choose a PDF, JPG, PNG, or WebP file (maximum 20 MB)<input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required /></label>
              <button type="submit">Upload document</button>
            </form>
            <RecordList
              title="Stored files"
              rows={customer.media_files.map((file) => ({
                id: file.id,
                title: file.original_name,
                detail: `${file.content_type} · ${Math.ceil(file.size_bytes / 1024)} KB · ${new Date(file.created_at).toLocaleDateString()}`,
                action: () => void openDocument(file.id),
              }))}
            />
          </>
        ) : null}
      </section>
    </main>
  );
}

function RecordList({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ id: string; title: string; detail: string; action?: () => void }>;
}) {
  return (
    <>
      <h2>{title}</h2>
      {rows.length ? (
        <ul className={styles.recordList}>
          {rows.map((row) => (
            <li key={row.id}>
              <div><strong>{row.title}</strong><p>{row.detail}</p></div>
              {row.action ? <button type="button" onClick={row.action}>Open securely</button> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyState}>No records available for this customer.</p>
      )}
    </>
  );
}
