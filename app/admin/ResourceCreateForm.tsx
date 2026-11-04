"use client";

import { useState, type FormEvent } from "react";
import styles from "./AdminDashboard.module.css";

export type ResourceFormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "datetime-local" | "textarea" | "select";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  nullable?: boolean;
  maxLength?: number;
};

export default function ResourceCreateForm({
  resource,
  title,
  fields,
  onSaved,
  onCancel,
}: {
  resource: string;
  title: string;
  fields: ResourceFormField[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string | number | null> = {};

    for (const field of fields) {
      const rawValue = String(formData.get(field.name) ?? "").trim();
      if (!rawValue) {
        if (field.nullable) payload[field.name] = null;
        continue;
      }
      if (field.type === "number") {
        const number = Number(rawValue);
        if (!Number.isFinite(number)) {
          setError(`${field.label} must be a valid number.`);
          setSaving(false);
          return;
        }
        payload[field.name] = number;
      } else if (field.type === "datetime-local") {
        const date = new Date(rawValue);
        if (Number.isNaN(date.getTime())) {
          setError(`${field.label} must be a valid date and time.`);
          setSaving(false);
          return;
        }
        payload[field.name] = date.toISOString();
      } else {
        payload[field.name] = rawValue;
      }
    }

    const response = await fetch(`/api/admin/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    if (!response?.ok) {
      const result = response
        ? ((await response.json().catch(() => ({}))) as { error?: string })
        : {};
      setError(result.error ?? `${title} could not be saved.`);
      setSaving(false);
      return;
    }
    setSaving(false);
    onSaved();
  }

  return (
    <form className={styles.customerForm} onSubmit={submit}>
      {fields.map((field) => (
        <label key={field.name}>
          {field.label}
          {field.type === "textarea" ? (
            <textarea name={field.name} required={field.required} maxLength={field.maxLength ?? 5000} />
          ) : field.type === "select" ? (
            <select name={field.name} required={field.required} defaultValue="">
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              maxLength={field.maxLength}
            />
          )}
        </label>
      ))}
      {error ? <p role="alert">{error}</p> : null}
      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton} disabled={saving}>
          {saving ? "Saving..." : `Create ${title.toLowerCase()}`}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
