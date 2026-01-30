"use client";

import { useState } from "react";
import Link from "next/link";

export default function CampaignSearch({
  campaigns,
}: {
  campaigns: any[];
}) {
  const [query, setQuery] = useState("");

  // ✅ Filter campaigns by name
  const filtered = campaigns.filter((c) =>
    c.campaign_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ marginTop: 25 }}>
      {/* Search Input */}
      <input
        placeholder="Search campaigns..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "12px 16px",
          borderRadius: 14,
          border: "none",
          outline: "none",
          fontSize: 15,
        }}
      />

      {/* Results */}
      {query.length > 0 && (
        <div
          style={{
            marginTop: 15,
            background: "white",
            borderRadius: 16,
            padding: 12,
            maxWidth: 420,
            marginInline: "auto",
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
          }}
        >
          {filtered.length === 0 ? (
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              No campaigns found.
            </p>
          ) : (
            filtered.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/${c.slug}`}
                style={{
                  display: "block",
                  padding: "10px 8px",
                  textDecoration: "none",
                  borderBottom: "1px solid #f3f4f6",
                  color: "#111827",
                  fontWeight: 600,
                }}
              >
                {c.campaign_name}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
