export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    name?: string;
    campaign?: string;
    to?: string;
    subject?: string;
    body?: string;
  }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const slug = resolvedParams.slug;

  const name = resolvedSearch.name || "Friend";
  const campaign = resolvedSearch.campaign || "our campaign";

  // ✅ Mailto fallback link
  const to = resolvedSearch.to || "";
  const subject = resolvedSearch.subject || "";
  const body = resolvedSearch.body || "";

  const mailtoLink =
    `mailto:${to}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px 16px",
        background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
      }}
    >
      {/* Card */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "25px 20px",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        {/* 🎉 Icon */}
        <div style={{ fontSize: 52, marginBottom: 8 }}>🎉</div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 10,
          }}
        >
          Thank You, {name}!
        </h1>

        <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.5 }}>
          Your participation in <strong>{campaign}</strong> means a lot.
        </p>

        <p
          style={{
            marginTop: 14,
            fontSize: 14,
            color: "#4b5563",
            lineHeight: 1.5,
          }}
        >
          Your email application should open shortly.
          <br />
          Just click the <strong>Send</strong> button to complete your message.
        </p>

        {/* Motivation Box */}
        <div
          style={{
            marginTop: 18,
            padding: 14,
            borderRadius: 14,
            background: "#f9fafb",
            fontSize: 14,
            color: "#111827",
            lineHeight: 1.4,
          }}
        >
          ✊ Let our voice be heard. <br />
          Together, we can create change.
        </div>

        {/* Buttons Row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 22,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Home Button */}
          <a
            href={`/${slug}`}
            style={{
              flex: 1,
              minWidth: 140,
              padding: "12px 16px",
              borderRadius: 12,
              background: "#111827",
              color: "white",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            🏠 Home
          </a>

          {/* Open Mail Button */}
          <a
            href={mailtoLink}
            style={{
              flex: 1,
              minWidth: 140,
              padding: "12px 16px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
              color: "white",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            📩 Open Mail App
          </a>
        </div>
      </div>
    </main>
  );
}
