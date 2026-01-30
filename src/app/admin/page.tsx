import { cookies } from "next/headers";
import Link from 'next/link';
import { supabaseAdmin } from "@/lib/supabaseAdmin";

import CampaignManagerClient from "./CampaignManagerClient";
import AdminTableClient from "./AdminTableClient";

export default async function AdminPage() {
  /* ✅ Cookie Check */
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  if (!isAdmin) {
    return (
      <main style={styles.centerPage}>
        <div style={styles.loginCard}>
          <h1 style={styles.heading}>Admin Access Required</h1>
          <p style={styles.subText}>
            Please login to access the dashboard.
          </p>

          <a href="/admin/login" style={styles.primaryBtn}>
            🔑 Go to Admin Login
          </a>
        </div>
      </main>
    );
  }

  /* -----------------------------
     ✅ Fetch Campaigns
  ------------------------------ */
  const { data: campaigns } = await supabaseAdmin
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  /* -----------------------------
     ✅ Fetch Requests
  ------------------------------ */
  const { data: requests } = await supabaseAdmin
    .from("email_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  const campaignList = campaigns || [];
  const rows = requests || [];

  /* -----------------------------
     ✅ GLOBAL STATISTICS
  ------------------------------ */
  const totalCampaigns = campaignList.length;
  const activeCampaigns = campaignList.filter((c) => c.is_active).length;

  const totalEmails = rows.length;

  const uniqueVisitors = new Set(rows.map((r) => r.visitor_id)).size;

  /* -----------------------------
     ✅ INSIGHTS
  ------------------------------ */

  // Emails per campaign
  const campaignEmailCount: any = {};
  rows.forEach((r) => {
    campaignEmailCount[r.campaign_id] =
      (campaignEmailCount[r.campaign_id] || 0) + 1;
  });

  // Most Successful Campaigns
  const mostSuccessful = [...campaignList]
    .map((c) => ({
      ...c,
      count: campaignEmailCount[c.id] || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Recent Campaigns
  const recentCampaigns = [...campaignList]
    .map((c) => ({
    ...c,
    count: campaignEmailCount[c.id] || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Country counts
  const countryCount: any = {};
  rows.forEach((r) => {
    if (r.country) {
      countryCount[r.country] =
        (countryCount[r.country] || 0) + 1;
    }
  });

  const topCountries = Object.entries(countryCount)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);

  // City counts
  const cityCount: any = {};
  rows.forEach((r) => {
    if (r.city) {
      cityCount[r.city] = (cityCount[r.city] || 0) + 1;
    }
  });

  const topCities = Object.entries(cityCount)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main style={styles.page}>
      {/* ✅ HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.brand}>Mailto Campaigns</h1>
          <p style={styles.tagline}>
            Admin Dashboard — Campaign Insights & Analytics
          </p>
        </div>
          <Link href="/create-campaign" style={styles.secondaryBtn}>Create Campaign</Link>
          {/* ✅ LOGOUT BUTTON */}
          <form action="/api/admin-logout" method="POST">
            <button style={styles.logoutBtn}>Logout</button>
          </form>

      </header>

      {/* ✅ GLOBAL STATS */}
      <section style={styles.statsGrid}>
        <StatCard title="Total Campaigns" value={totalCampaigns} />
        <StatCard title="Active Campaigns" value={activeCampaigns} />
        <StatCard title="Total Emails Sent" value={totalEmails} />
        <StatCard title="Unique Visitors" value={uniqueVisitors} />
      </section>

      {/* ✅ INSIGHTS GRID */}
      <section style={styles.insightGrid}>
        <InsightCard title="Most Successful Campaigns">
          {mostSuccessful.map((c) => (
            <p key={c.id} style={styles.insightItem}>
              <b>{c.campaign_name}</b>
              <br />
              {new Date(c.created_at).toLocaleDateString()} —{" "}
              {c.count} emails
            </p>
          ))}
        </InsightCard>

        <InsightCard title="Recent Campaigns">
          {recentCampaigns.map((c) => (
            <p key={c.id} style={styles.insightItem}>
              <b>{c.campaign_name}</b>
              <br />
              {new Date(c.created_at).toLocaleDateString()} —{" "}
              {c.count} emails
            </p>
          ))}
        </InsightCard>

        <InsightCard title="Top Countries">
          {topCountries.map(([country, count]) => (
            <p key={country} style={styles.insightItem}>
              {country} — <b>{Number(count)}</b>
            </p>
          ))}
        </InsightCard>

        <InsightCard title="Top Cities">
          {topCities.map(([city, count]) => (
            <p key={city} style={styles.insightItem}>
              {city} — <b>{Number(count)}</b>
            </p>
          ))}
        </InsightCard>
      </section>

      {/* ✅ CAMPAIGN MANAGER */}
      <section style={styles.statsGrid}>
        <CampaignManagerClient
          campaigns={campaignList}
          campaignEmailCount={campaignEmailCount}
        />
      </section>

      {/* ✅ EMAIL REQUEST TABLE */}
      <section style={styles.statsGrid}>
        <AdminTableClient rows={rows} />
      </section>

      {/* Footer */}
      <footer style={styles.footer}>© yezhara.com</footer>
    </main>
  );
}

/* -----------------------------
   ✅ Small Components
------------------------------ */

function StatCard({ title, value }: any) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statTitle}>{title}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  );
}

function InsightCard({ title, children }: any) {
  return (
    <div style={styles.sectionCard}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

/* -----------------------------
   ✅ Styles
------------------------------ */

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f3f4f6, #ffffff)",
    padding: "25px 15px",
    fontFamily: "system-ui, sans-serif",
  },

  header: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "18px 20px",
    borderRadius: 18,
    background: "#111827",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 25,
  },

  brand: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },

  tagline: {
    fontSize: 14,
    marginTop: 4,
    color: "#d1d5db",
  },

  logoutBtn: {
    background: "#111827",
    color: "white",
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },

  actionsRow: {
    maxWidth: 1100,
    margin: "0 auto 25px",
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    color: "white",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: "bold",
  },

  secondaryBtn: {
    background: "white",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: "bold",
    border: "1px solid #e5e7eb",
    color: "#111827",
  },

  statsGrid: {
    maxWidth: 1100,
    margin: "0 auto 25px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 15,
  },

  statCard: {
    background: "white",
    padding: 18,
    borderRadius: 18,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  statTitle: {
    fontSize: 16,
    color: "#104ecc",
    marginBottom: 6,
  },

  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },

  insightGrid: {
    maxWidth: 1100,
    margin: "0 auto 25px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 15,
  },

  insightItem: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 10,
  },

  sectionCard: {
    background: "white",
    padding: 20,
    borderRadius: 18,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000000",
  },

  footer: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 13,
    color: "#6b7280",
  },

  centerPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f9fafb",
    padding: 20,
  },

  loginCard: {
    background: "white",
    padding: 30,
    borderRadius: 18,
    textAlign: "center",
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },

  subText: {
    marginTop: 10,
    color: "#6b7280",
    marginBottom: 20,
  },
};
