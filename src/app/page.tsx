import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import CampaignSearch from "@/components/CampaignSearch";

export default async function HomePage() {
  // ✅ Fetch Latest Active Campaigns
  const { data: latestCampaigns } = await supabaseAdmin
    .from("email_campaigns")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  // ✅ Fetch Best Performing Campaigns (Top 3 by email_requests count)
  const { data: topCampaigns } = await supabaseAdmin.rpc(
    "top_campaigns_by_requests"
  );

  const { data: allCampaigns } = await supabaseAdmin
  .from("email_campaigns")
  .select("id, campaign_name, slug")
  .eq("is_active", true);


  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
        padding: "40px 16px",
      }}
    >
      {/* HERO */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 34, fontWeight: "bold" }}>
          Mailto Campaigns
        </h1>

        <h2
          style={{
            fontSize: 22,
            marginTop: 12,
            fontWeight: 600,
          }}
        >
          Let your voice be heard ✊
        </h2>

        <p
          style={{
            marginTop: 12,
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.95,
          }}
        >
          Join active campaigns and send emails instantly to support causes that
          matter. Every message counts.
        </p>

        {/* SEARCH */}
        <CampaignSearch campaigns={allCampaigns || []} />
      </div>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: 900,
          margin: "40px auto 0",
          display: "grid",
          gap: 30,
        }}
      >
        {/* Latest Campaigns */}
        <section>
          <h3
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
              marginBottom: 15,
            }}
          >
            Latest Active Campaigns
          </h3>

          <div style={gridStyle}>
            {latestCampaigns?.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </section>

        {/* Top Campaigns */}
        <section>
          <h3
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
              marginBottom: 15,
            }}
          >
            Most Successful Campaigns
          </h3>

          <div style={gridStyle}>
            {topCampaigns?.slice(0, 3).map((c: any) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          marginTop: 60,
          color: "white",
          opacity: 0.8,
          fontSize: 13,
        }}
      >
        © {new Date().getFullYear()} yezhara.com
      </footer>
    </main>
  );
}

/* ✅ Card Component */
function CampaignCard({ campaign }: { campaign: any }) {
  return (
    <Link
      href={`/${campaign.slug}`}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
          transition: "0.2s",
        }}
      >
        <h4
          style={{
            fontSize: 17,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#111827",
          }}
        >
          {campaign.campaign_name}
        </h4>

        <p style={{ fontSize: 13, color: "#374151" }}>
          <strong>To:</strong> {campaign.to_email}
        </p>

        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
          Created:{" "}
          {new Date(campaign.created_at).toLocaleDateString("en-IN")}
        </p>
      </div>
    </Link>
  );
}

/* ✅ Grid Style */
const gridStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};
