import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/* -------------------------------
   Admin Dashboard Page
-------------------------------- */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const resolvedSearch = await searchParams;
  const password = resolvedSearch.password;

  // ✅ Simple Password Protection
  if (password !== process.env.ADMIN_PASSWORD) {
    return (
      <main style={styles.center}>
        <h1>Admin Access Denied</h1>
        <p>Add ?password=YOUR_PASSWORD in the URL.</p>
      </main>
    );
  }

  /* -------------------------------
     Fetch Global Statistics
  -------------------------------- */

  // Total Campaigns
  const { count: totalCampaigns } = await supabaseAdmin
    .from("email_campaigns")
    .select("*", { count: "exact", head: true });

  // Active Campaigns
  const { count: activeCampaigns } = await supabaseAdmin
    .from("email_campaigns")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Total Emails Sent
  const { count: totalEmails } = await supabaseAdmin
    .from("email_requests")
    .select("*", { count: "exact", head: true });

  // Unique Visitors
  const { data: uniqueVisitorsData } = await supabaseAdmin.rpc(
    "unique_visitors_count"
  );

  const uniqueVisitors =
    uniqueVisitorsData?.[0]?.unique_count || 0;

  /* -------------------------------
     Insight Queries
  -------------------------------- */

  // Most Successful Campaigns
  const { data: topCampaigns } = await supabaseAdmin.rpc(
    "top_campaigns_with_counts"
  );

  // Recent Campaigns
  const { data: recentCampaigns } = await supabaseAdmin.rpc(
    "recent_campaigns_with_counts"
  );

  // Top Countries
  const { data: topCountries } = await supabaseAdmin.rpc(
    "top_countries"
  );

  // Top Cities
  const { data: topCities } = await supabaseAdmin.rpc(
    "top_cities"
  );

  // Campaign Table Full Data
  const { data: campaigns } = await supabaseAdmin.rpc(
    "campaigns_table_with_counts"
  );

  return (
    <main style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.brand}>Mailto Campaigns Admin</h1>

        <div style={styles.headerButtons}>
          <Link href="/create-campaign" style={styles.primaryBtn}>
            ➕ Create Campaign
          </Link>

          <Link href="/" style={styles.logoutBtn}>
            Logout
          </Link>
        </div>
      </header>

      {/* GLOBAL STAT CARDS */}
      <section style={styles.statsGrid}>
        <StatCard title="Total Campaigns" value={totalCampaigns || 0} />
        <StatCard title="Active Campaigns" value={activeCampaigns || 0} />
        <StatCard title="Total Emails Sent" value={totalEmails || 0} />
        <StatCard title="Unique Visitors" value={uniqueVisitors} />
      </section>

      {/* INSIGHT GRID */}
      <section style={styles.insightGrid}>
        <InsightCard
          title="Most Successful Campaigns"
          items={topCampaigns || []}
        />

        <InsightCard
          title="Recent Campaigns"
          items={recentCampaigns || []}
        />

        <SimpleCountCard title="Top Countries" items={topCountries || []} />

        <SimpleCountCard title="Top Cities" items={topCities || []} />
      </section>

      {/* CAMPAIGN TABLE */}
      <section style={styles.tableSection}>
        <h2 style={styles.sectionTitle}>All Campaigns</h2>

        {/* Search + Export */}
        <div style={styles.tableTools}>
          <input
            placeholder="Search campaigns..."
            style={styles.searchInput}
          />

          <button style={styles.exportBtn}>
            ⬇ Export CSV
          </button>
        </div>

        {/* Table */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Title</th>
                <th>Total Emails</th>
                <th>Created</th>
                <th>End Date</th>
                <th>Slug</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {campaigns?.map((c: any, index: number) => (
                <tr key={c.id}>
                  <td>{index + 1}</td>

                  {/* Title → Analysis Page */}
                  <td>
                    <Link
                      href={`/admin/campaign/${c.id}?password=${password}`}
                      style={styles.link}
                    >
                      {c.campaign_name}
                    </Link>
                  </td>

                  <td>{c.total_emails}</td>

                  <td>
                    {new Date(c.created_at).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    {c.end_date
                      ? new Date(c.end_date).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  {/* Slug Link */}
                  <td>
                    <a
                      href={`/${c.slug}`}
                      target="_blank"
                      style={styles.slugLink}
                    >
                      {c.slug}
                    </a>
                  </td>

                  {/* Status */}
                  <td>
                    {c.is_active ? (
                      <span style={styles.activeBadge}>Active</span>
                    ) : (
                      <span style={styles.closedBadge}>Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>© yezhara.com</footer>
    </main>
  );
}

/* -------------------------------
   Components
-------------------------------- */

function StatCard({ title, value }: any) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statTitle}>{title}</p>
      <h3 style={styles.statValue}>{value}</h3>
    </div>
  );
}

function InsightCard({ title, items }: any) {
  return (
    <div style={styles.insightCard}>
      <h3 style={styles.cardTitle}>{title}</h3>

      {items.slice(0, 5).map((x: any) => (
        <p key={x.id} style={styles.itemRow}>
          <strong>{x.campaign_name}</strong>
          <br />
          {new Date(x.created_at).toLocaleDateString("en-IN")} —{" "}
          {x.total_emails} emails
        </p>
      ))}
    </div>
  );
}

function SimpleCountCard({ title, items }: any) {
  return (
    <div style={styles.insightCard}>
      <h3 style={styles.cardTitle}>{title}</h3>

      {items.slice(0, 5).map((x: any, i: number) => (
        <p key={i} style={styles.itemRow}>
          {x.name} — {x.count}
        </p>
      ))}
    </div>
  );
}

/* -------------------------------
   Styling
-------------------------------- */

const styles: any = {
  page: {
    minHeight: "100vh",
    padding: 20,
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 25,
  },

  brand: {
    fontSize: 24,
    fontWeight: "bold",
  },

  headerButtons: {
    display: "flex",
    gap: 10,
  },

  primaryBtn: {
    background: "white",
    color: "#111827",
    padding: "10px 14px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: "bold",
  },

  logoutBtn: {
    background: "#111827",
    color: "white",
    padding: "10px 14px",
    borderRadius: 10,
    textDecoration: "none",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 15,
    marginBottom: 25,
  },

  statCard: {
    background: "white",
    color: "#111827",
    padding: 16,
    borderRadius: 16,
  },

  statTitle: {
    fontSize: 13,
    color: "#6b7280",
  },

  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
  },

  insightGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 15,
    marginBottom: 30,
  },

  insightCard: {
    background: "white",
    color: "#111827",
    padding: 16,
    borderRadius: 16,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },

  itemRow: {
    fontSize: 13,
    marginBottom: 10,
    color: "#374151",
  },

  tableSection: {
    background: "white",
    borderRadius: 18,
    padding: 18,
    color: "#111827",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  tableTools: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  searchInput: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    flex: 1,
    minWidth: 180,
  },

  exportBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#4f46e5",
    color: "white",
    fontWeight: "bold",
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },

  link: {
    color: "#2563eb",
    fontWeight: "bold",
    textDecoration: "none",
  },

  slugLink: {
    color: "#111827",
    textDecoration: "underline",
  },

  activeBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },

  closedBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 40,
    textAlign: "center",
    opacity: 0.85,
    fontSize: 13,
  },

  center: {
    padding: 50,
    textAlign: "center",
  },
};
