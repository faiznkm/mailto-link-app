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

    // ✅ Optimistic UI update
    setItems((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_active: newValue } : c
      )
    );

    // ✅ Call API
    const res = await fetch("/api/toggle-campaign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, is_active: newValue }),
    });

    if (!res.ok) {
      alert("Failed to update campaign status");
    }
  }

  return (
    <div>
      {/* Table Wrapper */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headRow}>
              <th style={styles.th}>Campaign</th>
              <th style={styles.th}>Slug</th>
              <th style={styles.th}>Start</th>
              <th style={styles.th}>End</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {items.map((c) => (
              <tr key={c.id} style={styles.row}>
                {/* Campaign Name */}
                <td style={styles.td}>
                  <p style={styles.campaignTitle}>
                    {c.campaign_name}
                  </p>
                </td>

                {/* Slug */}
                <td style={styles.td}>
                  <a
                    href={`/${c.slug}`}
                    target="_blank"
                    style={styles.slugLink}
                  >
                    /{c.slug}
                  </a>
                </td>

                {/* Dates */}
                <td style={styles.td}>
                  {c.start_date || "-"}
                </td>

                <td style={styles.td}>
                  {c.end_date || "-"}
                </td>

                {/* Status + Toggle */}
                <td style={styles.td}>
                  <div style={styles.statusWrap}>
                    {/* Badge */}
                    {c.is_active ? (
                      <span style={styles.activeBadge}>
                        Active
                      </span>
                    ) : (
                      <span style={styles.closedBadge}>
                        Closed
                      </span>
                    )}

                    {/* Toggle */}
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
                            ? "#4f46e5"
                            : "#d1d5db",
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty */}
        {items.length === 0 && (
          <p style={styles.emptyText}>
            No campaigns created yet.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------
   ✅ Modern Styles
---------------------------- */

const styles: any = {
  tableWrap: {
    overflowX: "auto",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    minWidth: 650,
  },

  headRow: {
    background: "#f9fafb",
    textAlign: "left",
  },

  th: {
    padding: "12px 14px",
    fontSize: 13,
    fontWeight: "bold",
    color: "#374151",
  },

  row: {
    borderTop: "1px solid #f3f4f6",
  },

  td: {
    padding: "14px",
    verticalAlign: "middle",
    color: "#111827",
  },

  campaignTitle: {
    fontWeight: "600",
    fontSize: 14,
    margin: 0,
  },

  slugLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },

  statusWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  activeBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },

  closedBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },

  emptyText: {
    padding: 15,
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
  },
};

/* ---------------------------
   ✅ Toggle Switch Styles
---------------------------- */

const switchStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
  width: 46,
  height: 24,
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
  height: 18,
  width: 18,
  left: 3,
  bottom: 3,
  backgroundColor: "white",
  borderRadius: "50%",
  transition: "0.3s",
};
