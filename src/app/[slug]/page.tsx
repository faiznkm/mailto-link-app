import CampaignFormClient from "./CampaignFormClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch campaign
  const { data: campaign, error } = await supabaseAdmin
    .from("email_campaigns")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !campaign) {
    return (
      <main style={styles.center}>
        <h1 style={styles.title}>Campaign Not Found</h1>
        <p style={styles.text}>
          This campaign link is invalid or expired.
        </p>
      </main>
    );
  }

  // ✅ IST Date Check
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  if (!campaign.is_active) {
    return closedPage("Campaign Paused", "This campaign is currently inactive.");
  }

  if (today < campaign.start_date) {
    return closedPage(
      "Campaign Not Started",
      `This campaign will start on ${campaign.start_date}.`
    );
  }

  if (today > campaign.end_date) {
    return closedPage(
      "Campaign Expired",
      `This campaign ended on ${campaign.end_date}.`
    );
  }

  return (
    <main style={styles.wrapper}>
      {/* Header Card */}
      <div style={styles.headerCard}>
        <h1 style={styles.heading}>{campaign.campaign_name}</h1>

        <p style={styles.description}>
          {campaign.description}
        </p>

        <div style={styles.dateBox}>
          Active until <b>{campaign.end_date}</b>
        </div>
      </div>

      {/* Form Card */}
      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>Send Your Email</h2>
        <p style={styles.text}>
          Fill in your details below. Your email app will open automatically.
        </p>

        <CampaignFormClient campaign={campaign} />
      </div>
    </main>
  );
}

/* Closed Page Helper */
function closedPage(title: string, message: string) {
  return (
    <main style={styles.center}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.text}>{message}</p>
    </main>
  );
}

/* Mobile-first Styling */
const styles: any = {
  wrapper: {
    minHeight: "100vh",
    padding: "30px 15px",
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
  },

  headerCard: {
    width: "100%",
    maxWidth: 500,
    background: "white",
    borderRadius: 18,
    padding: 25,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },

  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },

  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 1.5,
    color: "#374151",
  },

  dateBox: {
    marginTop: 15,
    padding: "10px 15px",
    background: "#ecfeff",
    borderRadius: 12,
    fontSize: 14,
    color: "#0f172a",
  },

  formCard: {
    width: "100%",
    maxWidth: 500,
    background: "white",
    borderRadius: 18,
    padding: 25,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },

  center: {
    minHeight: "100vh",
    padding: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    background: "#f9fafb",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },

  text: {
    marginTop: 10,
    fontSize: 15,
    color: "#374151",
  },
};
