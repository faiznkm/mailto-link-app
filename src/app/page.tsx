import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cookies } from "next/headers";

export default async function HomePage() {
  // Check admin login cookie
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  // Fetch all campaigns
  const { data: campaigns } = await supabaseAdmin
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  const today = new Date().toISOString().split("T")[0];

  return (
    <main style={{ padding: 50 }}>
      <h1 style={{ fontSize: 32, fontWeight: "bold" }}>
        Mail Campaign Link Generator
      </h1>

      <p style={{ marginTop: 10 }}>
        Create campaigns and share unique links for users to send emails easily.
      </p>

      {/* Admin Create Button */}
      {isAdmin && (
        <a
          href="/create-campaign"
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "12px 18px",
            background: "black",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ➕ Create New Campaign
        </a>
      )}

      {/* Campaign List */}
      <h2 style={{ marginTop: 40, fontSize: 22 }}>
        Available Campaigns
      </h2>

      {!campaigns || campaigns.length === 0 ? (
        <p style={{ marginTop: 20 }}>No campaigns created yet.</p>
      ) : (
        <div style={{ marginTop: 20 }}>
          {campaigns.map((c) => {
            // Status logic
            let status = "Active";

            if (!c.is_active) status = "Inactive";
            else if (today < c.start_date) status = "Upcoming";
            else if (today > c.end_date) status = "Expired";

            return (
              <div
                key={c.id}
                style={{
                  padding: 15,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  marginBottom: 15,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: "bold" }}>
                  {c.campaign_name}
                </h3>

                <p style={{ marginTop: 5 }}>
                  Link:{" "}
                  <a
                    href={`/${c.slug}`}
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                  >
                    /{c.slug}
                  </a>
                </p>

                <p style={{ marginTop: 5 }}>
                  Status:{" "}
                  <b
                    style={{
                      color:
                        status === "Active"
                          ? "green"
                          : status === "Inactive"
                          ? "gray"
                          : "red",
                    }}
                  >
                    {status}
                  </b>
                </p>

                <p style={{ marginTop: 5, fontSize: 13 }}>
                  Start: {c.start_date} | End: {c.end_date}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
