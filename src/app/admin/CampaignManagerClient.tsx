"use client";

import { useState } from "react";

export default function CampaignManagerClient({
  campaigns,
}: {
  campaigns: any[];
}) {
  const [items, setItems] = useState(campaigns);

  async function toggleCampaign(id: number, current: boolean) {
    const newValue = !current;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_active: newValue } : c
      )
    );

    // Call API
    const res = await fetch("/api/toggle-campaign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        is_active: newValue,
      }),
    });

    if (!res.ok) {
      alert("Failed to update campaign status");
    }
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h2 style={{ fontSize: 20, fontWeight: "bold" }}>
        Campaign Manager
      </h2>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          marginTop: 15,
          fontSize: 14,
        }}
      >
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Slug</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td>{c.campaign_name}</td>

              <td>
                <a
                  href={`/${c.slug}`}
                  target="_blank"
                  style={{ textDecoration: "underline" }}
                >
                  /{c.slug}
                </a>
              </td>

              <td>{c.start_date}</td>
              <td>{c.end_date}</td>

              {/* Switch Toggle */}
              <td>
                <label style={switchStyle}>
                  <input
                    type="checkbox"
                    checked={c.is_active}
                    onChange={() =>
                      toggleCampaign(c.id, c.is_active)
                    }
                    style={{ display: "none" }}
                  />

                  <span
                    style={{
                      ...sliderStyle,
                      background: c.is_active
                        ? "#4caf50"
                        : "#ccc",
                    }}
                  >
                    <span
                      style={{
                        ...dotStyle,
                        transform: c.is_active
                          ? "translateX(22px)"
                          : "translateX(0px)",
                      }}
                    />
                  </span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ✅ Switch Styles */
const switchStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
  width: 50,
  height: 26,
};

const sliderStyle: React.CSSProperties = {
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 20,
  transition: "0.3s",
};

const dotStyle: React.CSSProperties = {
  position: "absolute",
  height: 20,
  width: 20,
  left: 3,
  bottom: 3,
  backgroundColor: "white",
  borderRadius: "50%",
  transition: "0.3s",
};
