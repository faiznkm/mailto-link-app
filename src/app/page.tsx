"use client";

import { useState } from "react";

export default function HomePage() {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    // ✅ Trigger browser built-in validation popup
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // ✅ Strict Email Validation (must include dot after domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email (example: name@gmail.com)");
      return;
    }

    // ✅ Log request into Supabase
    const res = await fetch("/api/log-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, place, email }),
    });

    if (!res.ok) {
      alert("Logging failed. Please try again.");
      return;
    }

    // ✅ Open Mail App with Dynamic Content
    const subject = encodeURIComponent("Mail Request from " + name);

    const bodyText = encodeURIComponent(
      `Hello,\n\nMy name is ${name} from ${place}.\n\nMy email is: ${email}\n\nThank you.`
    );

    window.location.href =
      `mailto:test@example.com?subject=${subject}&body=${bodyText}`;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>
        Dynamic Mailto Logger App
      </h1>

      <p style={{ marginTop: 10 }}>
        Fill in your details and click Send. Your request will be logged into
        Supabase before opening your mail app.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
        {/* Name */}
        <input
          placeholder="Enter your name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: 10,
            width: 320,
            display: "block",
            marginBottom: 15,
          }}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email (required)"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 10,
            width: 320,
            display: "block",
            marginBottom: 15,
          }}
        />

        {/* Place */}
        <input
          placeholder="Enter your place"
          value={place}
          required
          onChange={(e) => setPlace(e.target.value)}
          style={{
            padding: 10,
            width: 320,
            display: "block",
            marginBottom: 20,
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send Email
        </button>
      </form>
    </main>
  );
}
