"use client";

import { useState } from "react";

export default function CampaignFormClient({
  campaign,
}: {
  campaign: any;
}) {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Email error state
  const [emailError, setEmailError] = useState("");

  // ✅ One Source of Truth Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Block submission if invalid email
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email like name@gmail.com");
      return;
    }

    // Log request into Supabase
    const res = await fetch("/api/log-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        place,
        email,
        campaign_id: campaign.id,
      }),
    });

    if (!res.ok) {
      alert("Logging failed. Please try again.");
      return;
    }

    // ✅ Beautified Email Subject
    const subject = encodeURIComponent(
        `${campaign.subject} - From ${name}`
      );

      // ✅ Beautified Email Body Template
    const bodyText = encodeURIComponent(
      `${campaign.body}\n\n\n` +
        `Name: ${name}\n` +
        `Place: ${place}\n` +
        `Email: ${email}\n`
    );


    // Open mail app
    window.location.href =
      `mailto:${campaign.to_email}` +
      `?subject=${subject}` +
      `&body=${bodyText}`;
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* Name */}
      <input
        placeholder="Your Name"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      {/* Place */}
      <input
        placeholder="Your Place"
        value={place}
        required
        onChange={(e) => setPlace(e.target.value)}
        style={styles.input}
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        required
        onChange={(e) => {
          const val = e.target.value;
          setEmail(val);

          if (!emailRegex.test(val)) {
            setEmailError("Enter a valid email like name@gmail.com");
          } else {
            setEmailError("");
          }
        }}
        style={styles.input}
      />

      {/* Live Email Error */}
      {emailError && (
        <p style={styles.error}>{emailError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!!emailError}
        style={{
          ...styles.button,
          opacity: emailError ? 0.6 : 1,
          cursor: emailError ? "not-allowed" : "pointer",
        }}
      >
        📩 Send Email
      </button>
    </form>
  );
}

/* ✅ Styling */
const styles: any = {
  form: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
    width: "100%",
  },

  error: {
    color: "red",
    fontSize: 13,
    marginTop: -10,
  },

  button: {
    padding: "14px",
    borderRadius: 12,
    border: "none",
    fontWeight: "bold",
    fontSize: 15,
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    color: "white",
  },
};
