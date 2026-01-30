"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CampaignFormClient({
  campaign,
}: {
  campaign: any;
}) {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Visitor UUID (generated once)
  const [visitorId, setVisitorId] = useState("");

  // ✅ Metadata States
  const [platform, setPlatform] = useState("unknown");
  const [deviceType, setDeviceType] = useState("unknown");
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const [screenHeight, setScreenHeight] = useState<number | null>(null);
  const [language, setLanguage] = useState("unknown");
  const [referrer, setReferrer] = useState("direct");

  // ✅ Email error state
  const [emailError, setEmailError] = useState("");

  // ✅ One Source of Truth Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ✅ Collect browser metadata once
  useEffect(() => {
    setVisitorId(uuidv4());

    setPlatform(navigator.platform || "unknown");
    setLanguage(navigator.language || "unknown");

    setScreenWidth(window.screen.width);
    setScreenHeight(window.screen.height);

    setReferrer(document.referrer || "direct");

    // ✅ userAgentData (Chrome only)
    const uaData = (navigator as any).userAgentData;
    if (uaData) {
      setDeviceType(uaData.mobile ? "Mobile" : "Desktop");
    } else {
      // fallback using userAgent string
      setDeviceType(/mobile/i.test(navigator.userAgent) ? "Mobile" : "Desktop");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ✅ Block submission if invalid email
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email like name@gmail.com");
      return;
    }

    // ✅ Log request into Supabase with metadata
    const res = await fetch("/api/log-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaign_id: campaign.id,
        name,
        place,
        email,

        // ✅ Extra Metadata
        visitor_id: visitorId,
        platform,
        device_type: deviceType,
        screen_width: screenWidth,
        screen_height: screenHeight,
        language,
        referrer,
      }),
    });

    if (!res.ok) {
      alert("Logging failed. Please try again.");
      return;
    }

    // ✅ Email Subject
    const subject = encodeURIComponent(`${campaign.subject} - From ${name}`);

    // ✅ Email Body Template
    const bodyText = encodeURIComponent(
      `${campaign.body}\n\n\n` +
        `Name: ${name}\n` +
        `Place: ${place}\n` +
        `Email: ${email}\n`
    );

    // ✅ Open Mail App
    window.location.href =
      `mailto:${campaign.to_email}` +
      `?subject=${subject}` +
      `&body=${bodyText}`;
    
    // ✅ Redirect to Thank You Page after short delay
    setTimeout(() => {
      window.location.href =
        `/${campaign.slug}/thanks?` +
        `name=${encodeURIComponent(name)}` +
        `&campaign=${encodeURIComponent(campaign.campaign_name)}` +
        `&to=${encodeURIComponent(campaign.to_email)}` +
        `&subject=${encodeURIComponent(campaign.subject)}` +
        `&body=${encodeURIComponent(
          `${campaign.body}\n\nName: ${name}\nPlace: ${place}\nEmail: ${email}`
        )}`;
    }, 1200);
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
      {emailError && <p style={styles.error}>{emailError}</p>}

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
