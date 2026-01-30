"use client";

import { useMemo, useState } from "react";

export default function CampaignManagerClient({
  campaigns,
  campaignEmailCount,
}: {
  campaigns: any[];
  campaignEmailCount: Record<string, number>;
}) {
  const [items, setItems] = useState(campaigns);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<
    "campaign" | "count" | "start" | "end" | "status"
  >("campaign");

  /* ----------------------------
     Derived data
  ----------------------------- */

  const filtered = useMemo(() => {
    return items.filter((c) =>
      c.campaign_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search]);

  const sortedItems = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === "campaign") {
        return a.campaign_name.localeCompare(
          b.campaign_name
        );
      }

      if (sortKey === "count") {
        const countA = campaignEmailCount[a.id] || 0;
        const countB = campaignEmailCount[b.id] || 0;
        return countB - countA; // desc
      }

      if (sortKey === "start") {
        return (a.start_date || "").localeCompare(
          b.start_date || ""
        );
      }

      if (sortKey === "end") {
        return (a.end_date || "").localeCompare(
          b.end_date || ""
        );
      }

      if (sortKey === "status") {
        return Number(b.is_active) - Number(a.is_active);
      }

      return 0;
    });
  }, [filtered, sortKey, campaignEmailCount]);

  const activeCount = items.filter(
    (c) => c.is_active
  ).length;

  /* ----------------------------
     Actions
  ----------------------------- */

  async function toggleCampaign(id: number, current: boolean) {
    const newValue = !current;

    // optimistic update
    setItems((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_active: newValue } : c
      )
    );

    const res = await fetch("/api/toggle-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: newValue }),
    });

    if (!res.ok) {
      alert("Failed to update campaign status");
    }
  }

  /* ----------------------------
     UI
  ----------------------------- */

  return (
    <div style={ui.card}>
      {/* Header */}
      <div style={ui.header}>
        <div>
          <h3 style={ui.title}>All Campaigns</h3>
          <p style={ui.sub}>
            {items.length} campaigns • {activeCount} active
          </p>
        </div>

        <input
          placeholder="Search campaigns…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={ui.search}
        />
      </div>

      {/* Table */}
      <div style={ui.tableWrap}>
        <table style={ui.table}>
          <thead>
            <tr>
              <th>Sl</th>
              <th onClick={() => setSortKey("campaign")}>
                Campaign
              </th>
              <th onClick={() => setSortKey("count")}>
                Support ⬍
              </th>
              <th>Slug</th>
              <th onClick={() => setSortKey("start")}>
                Start
              </th>
              <th onClick={() => setSortKey("end")}>
                End
              </th>
              <th onClick={() => setSortKey("status")}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedItems.map((c, index) => (
              <tr key={c.id} style={styles.row}>
                {/* Sl */}
                <td style={styles.td}>{index + 1}</td>

                {/* Campaign */}
                <td style={styles.td}>
                  <p style={styles.campaignTitle}>
                    {c.campaign_name}
                  </p>
                </td>

                {/* Support count */}
                <td style={styles.td}>
                  {campaignEmailCount[c.id] || 0}
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

                {/* Status */}
                <td style={styles.td}>
                  <StatusToggle
                    active={c.is_active}
                    onToggle={() =>
                      toggleCampaign(c.id, c.is_active)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedItems.length === 0 && (
          <p style={ui.empty}>No campaigns found</p>
        )}
      </div>
    </div>
  );
}

/* ----------------------------
   Status Toggle
----------------------------- */

function StatusToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <label style={toggle.wrap}>
      <input
        type="checkbox"
        checked={active}
        onChange={onToggle}
        hidden
      />
      <span
        style={{
          ...toggle.slider,
          background: active ? "#4f46e5" : "#d1d5db",
        }}
      >
        <span
          style={{
            ...toggle.dot,
            transform: active
              ? "translateX(22px)"
              : "translateX(0)",
          }}
        />
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: active ? "#166534" : "#991b1b",
        }}
      >
        {active ? "Active" : "Closed"}
      </span>
    </label>
  );
}

/* ----------------------------
   Styles
----------------------------- */

const ui: any = {
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 6px 18px rgba(0,0,0,.06)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 0,
  },
  sub: {
    fontSize: 13,
    color: "#6b7280",
  },
  search: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    minWidth: 220,
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 750,
    fontSize: 14,
  },
  empty: {
    padding: 16,
    textAlign: "center",
    color: "#6b7280",
  },
};

const styles: any = {
  row: {
    borderTop: "1px solid #f3f4f6",
  },
  td: {
    padding: "14px",
    verticalAlign: "middle",
    color: "#111827",
    fontSize: 14,
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
};

const toggle: any = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  slider: {
    position: "relative",
    width: 46,
    height: 24,
    borderRadius: 20,
    transition: "0.3s",
  },
  dot: {
    position: "absolute",
    height: 18,
    width: 18,
    left: 3,
    bottom: 3,
    background: "#fff",
    borderRadius: "50%",
    transition: "0.3s",
  },
};
