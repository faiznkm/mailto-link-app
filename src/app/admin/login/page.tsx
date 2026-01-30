"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Invalid password");
    }
  }

  return (
    <main style={{ padding: 50 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Admin Login</h1>

      <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 10,
            width: 300,
            marginBottom: 15,
            display: "block",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </main>
  );
}
