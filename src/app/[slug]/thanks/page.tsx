export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ name?: string; campaign?: string }>;
}) {
  const resolvedSearch = await searchParams;

  const name = resolvedSearch.name || "Friend";
  const campaign = resolvedSearch.campaign || "our campaign";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 30,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        {/* 🎉 Icon */}
        <div style={{ fontSize: 60 }}>🎉</div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: "bold",
            marginTop: 10,
            color: "#111827",
          }}
        >
          Thank You, {name}!
        </h1>

        <p style={{ marginTop: 12, fontSize: 16, color: "#374151" }}>
          Your participation in{" "}
          <strong>{campaign}</strong> means a lot.
        </p>

        <p style={{ marginTop: 15, fontSize: 15, color: "#4b5563" }}>
          Your email application will open shortly.
          <br />
          Just click the <strong>Send</strong> button to complete your message.
        </p>

        {/* Inspirational Message */}
        <div
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 14,
            background: "#f3f4f6",
            fontSize: 15,
            color: "#111827",
          }}
        >
          ✊ Let our voice be heard.  
          Together, we can create change.
        </div>

        {/* Button */}
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 25,
            padding: "12px 20px",
            borderRadius: 12,
            background: "#111827",
            color: "white",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
