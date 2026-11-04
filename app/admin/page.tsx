import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "CRM & Workflow Dashboard",
  description:
    "Demo CRM, customer enquiry management, workflow tracking, and team operations dashboard for APRAJITA STRATEGICS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
