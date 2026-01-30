import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminTableClient from "./AdminTableClient";
import CampaignManagerClient from "./CampaignManagerClient";

export default async function AdminPage() {
  // ✅ Cookie Check
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  // ❌ If not logged in → show login link
  if (!isAdmin) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Not Logged In</h1>
        <p>
          Please login at{" "}
          <a href="/admin/login">/admin/login</a>
        </p>
      </main>
    );
  }

  const { data: campaigns } = await supabaseAdmin
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  // ✅ Fetch records
  const { data, error } = await supabaseAdmin
    .from("email_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Error Loading Data</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  const rows = data || [];

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>
        Admin Dashboard
      </h1>

      {/* Logout Button */}
      <form action="/api/admin-logout" method="POST">
        <button
          style={{
            marginTop: 15,
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </form>

      <CampaignManagerClient campaigns={campaigns || []} />

      {/* CSV Export */}
      <a
        href="/api/export-csv"
        style={{
          display: "inline-block",
          marginTop: 15,
          padding: "10px 15px",
          border: "1px solid black",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        ⬇ Download CSV Export
      </a>

      {/* Table Client */}
      <AdminTableClient rows={rows} />
    </main>
  );
}
