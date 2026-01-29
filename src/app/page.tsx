"use client";

import { useState } from "react";

export default function HomePage() {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. Log into Supabase
    await fetch("/api/log-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, place }),
    });

    // 2. Open Mail App
    const subject = encodeURIComponent("Mail Request from " + name);

    const body = encodeURIComponent(
      `Hello,\n\nMy name is ${name} from ${place}.\n\nThank you.`
    );

    window.location.href = `mailto:test@example.com?subject=${subject}&body=${body}`;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Dynamic Mailto Link Generator</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          placeholder="Enter your name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Enter your place"
          value={place}
          required
          onChange={(e) => setPlace(e.target.value)}
        />

        <br /><br />

        <button type="submit">Send Email</button>
      </form>
    </main>
  );
}
