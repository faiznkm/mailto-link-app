"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/* ================= Helpers ================= */

function generateSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const parseEmails = (value: string) =>
  value.split(",").map((e) => e.trim()).filter(Boolean);

const validateEmails = (emails: string[]) =>
  emails.filter((email) => !EMAIL_REGEX.test(email));

/* ================= Component ================= */

export default function FormClient() {
  const router = useRouter();

  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [toEmail, setToEmail] = useState("");
  const [ccEmail, setCcEmail] = useState("");

  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noEndDate, setNoEndDate] = useState(false);

  useEffect(() => {
    setSlug(generateSlug());
  }, []);

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Image must be under 1MB");
      return;
    }

    setUploading(true);

    const fileName = `campaign-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("thumbnails")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("campaign-thumbnails")
      .getPublicUrl(fileName);

    setThumbnailUrl(data.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const toEmails = parseEmails(toEmail);
    const ccEmails = parseEmails(ccEmail);

    const invalidTo = validateEmails(toEmails);
    const invalidCc = validateEmails(ccEmails);

    if (invalidTo.length) {
      alert("Invalid TO emails:\n" + invalidTo.join(", "));
      return;
    }

    if (invalidCc.length) {
      alert("Invalid CC emails:\n" + invalidCc.join(", "));
      return;
    }

    const res = await fetch("/api/create-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_name: campaignName,
        description,
        slug,
        custom_domain: customDomain,
        thumbnail_url: thumbnailUrl,
        to_email: toEmails,
        cc_email: ccEmails,
        subject,
        body_text: bodyText,
        start_date: startDate,
        end_date: noEndDate ? null : endDate,
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

  /* ================= JSX ================= */

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📌 Campaign Info</h2>

        <input
          placeholder="Campaign Name"
          value={campaignName}
          required
          onChange={(e) => setCampaignName(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={description}
          required
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>🖼 Thumbnail</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleImageUpload(e.target.files[0])
          }
        />

        {uploading && <p>Uploading...</p>}

        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            style={{ marginTop: 10, width: "100%", borderRadius: 12 }}
          />
        )}
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📨 Email</h2>

        <input
          placeholder="To emails (comma separated)"
          value={toEmail}
          required
          onChange={(e) => setToEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="CC emails (comma separated)"
          value={ccEmail}
          onChange={(e) => setCcEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Subject"
          value={subject}
          required
          onChange={(e) => setSubject(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Body"
          value={bodyText}
          required
          rows={5}
          onChange={(e) => setBodyText(e.target.value)}
          style={styles.textareaLarge}
        />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📅 Duration</h2>

        <input
          type="date"
          value={startDate}
          required
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
        />

        {!noEndDate && (
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
        )}

        <label style={{ marginTop: 10, display: "block" }}>
          <input
            type="checkbox"
            checked={noEndDate}
            onChange={(e) => setNoEndDate(e.target.checked)}
          />{" "}
          No end date
        </label>
      </div>

      <button style={styles.button}>🚀 Create Campaign</button>
    </form>
  );
}

/* ================= Styles ================= */

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
  },
  input: {
    width: "100%",
    padding: 11,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    marginBottom: 10,
  },
  textarea: {
    width: "100%",
    padding: 11,
    borderRadius: 10,
    border: "1px solid #d1d5db",
  },
  textareaLarge: {
    width: "100%",
    padding: 11,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    minHeight: 120,
  },
  button: {
    padding: 14,
    borderRadius: 14,
    fontWeight: "bold",
    fontSize: 16,
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
