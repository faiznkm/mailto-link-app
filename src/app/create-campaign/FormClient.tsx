"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Auto slug generator
function generateSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

export default function FormClient() {
  const router = useRouter();

  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  
  const [slug, setSlug] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [toEmail, setToEmail] = useState("");
  const [ccEmail, setCcEmail] = useState("");

  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setSlug(generateSlug());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/create-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_name: campaignName,
        description,
        slug,
        custom_domain: customDomain,
        thumbnail_url: thumbnailUrl,
        to_email: toEmail,
        cc_email: ccEmail,
        subject,
        body_text: bodyText,
        start_date: startDate,
        end_date: endDate,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      alert("Error: " + result.error);
      return;
    }

    alert("✅ Campaign Created Successfully!");
    router.push(`/${slug}`);
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* Section 1 */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📌 Campaign Info</h2>

        <label style={styles.label}>Campaign Name</label>
        <input
          placeholder="Eg: Student Support Campaign"
          value={campaignName}
          required
          onChange={(e) => setCampaignName(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Description</label>
        <textarea
          placeholder="This text will be shown to public users..."
          value={description}
          required
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
      </div>

      {/* Section 2 */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>🔗 Campaign Link</h2>

        <label style={styles.label}>Slug (Auto Generated)</label>
        <input
          value={slug}
          required
          onChange={(e) => setSlug(e.target.value)}
          style={styles.input}
        />

        <p style={styles.helper}>
          Public link will be:{" "}
          <b style={{ color: "#2563eb" }}>
            {customDomain
              ? `https://${customDomain}/${slug}`
              : `https://yourapp.com/${slug}`}
          </b>
        </p>

        <label style={styles.label}>Custom Domain (Optional)</label>
        <input
          placeholder="Eg: campaign.myorg.com"
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Thumbnail Image URL</label>
        <input
          placeholder="https://example.com/banner.png"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          style={styles.input}
        />

        <p style={styles.helper}>
          This image will appear when the link is shared on WhatsApp/Facebook.
        </p>
      </div>


      {/* Section 3 */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📨 Email Template</h2>

        <label style={styles.label}>To Email</label>
        <input
          type="email"
          placeholder="receiver@example.com"
          value={toEmail}
          required
          onChange={(e) => setToEmail(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>CC Email (Optional)</label>
        <input
          type="email"
          placeholder="copy@example.com"
          value={ccEmail}
          onChange={(e) => setCcEmail(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Subject</label>
        <input
          placeholder="Eg: Support Request"
          value={subject}
          required
          onChange={(e) => setSubject(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Body Template</label>
        <textarea
          placeholder="Write the message users will send..."
          value={bodyText}
          required
          rows={5}
          onChange={(e) => setBodyText(e.target.value)}
          style={styles.textareaLarge}
        />
      </div>

      {/* Section 4 */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📅 Campaign Duration</h2>

        <label style={styles.label}>Start Date</label>
        <input
          type="date"
          value={startDate}
          required
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>End Date</label>
        <input
          type="date"
          value={endDate}
          required
          onChange={(e) => setEndDate(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Submit */}
      <button style={styles.button}>🚀 Create Campaign</button>
    </form>
  );
}

/* 🎨 Styles */
const styles: any = {
  form: {
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  card: {
    background: "white",
    padding: 22,
    borderRadius: 18,
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#111827",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    display: "block",
    marginBottom: 6,
    marginTop: 10,
    color: "#374151",
  },

  helper: {
    fontSize: 13,
    marginTop: 8,
    color: "#6b7280",
  },

  input: {
    width: "100%",
    padding: 11,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: 11,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
    resize: "none",
  },

  textareaLarge: {
    width: "100%",
    padding: 11,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
    resize: "vertical",
    minHeight: 120,
  },

  button: {
    padding: "14px",
    borderRadius: 14,
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
};
