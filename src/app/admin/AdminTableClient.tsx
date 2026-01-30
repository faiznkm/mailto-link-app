"use client";

import { useMemo, useState } from "react";

export default function AdminTableClient({ rows }: { rows: any[] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const [sortColumn, setSortColumn] = useState<
    "name" | "country" | "date"
  >("date");

  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc"
  >("desc");

  /* ---------------------------
     Derived data
  ---------------------------- */

  const countries = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.country).filter(Boolean))
      ),
    [rows]
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const text =
        (r.name + r.email + r.place).toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const matchesCountry =
        !countryFilter || r.country === countryFilter;

      return matchesSearch && matchesCountry;
    });
  }, [rows, search, countryFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let A: any;
      let B: any;

      if (sortColumn === "name") {
        A = a.name.toLowerCase();
        B = b.name.toLowerCase();
      }

      if (sortColumn === "country") {
        A = (a.country || "").toLowerCase();
        B = (b.country || "").toLowerCase();
      }

      if (sortColumn === "date") {
        A = new Date(a.created_at).getTime();
        B = new Date(b.created_at).getTime();
      }

      if (A < B) return sortDirection === "asc" ? -1 : 1;
      if (A > B) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortColumn, sortDirection]);

  function handleSort(col: "name" | "country" | "date") {
    if (sortColumn === col) {
      setSortDirection((d) =>
        d === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  }

  function arrow(col: string) {
    if (sortColumn !== col) return "⬍";
    return sortDirection === "asc" ? "⬆" : "⬇";
  }

  function exportCSV() {
    const csvRows = [
      ["Time", "Name", "Email", "Place", "City", "Country", "Date", "Campaign"],
      ...filtered.map((r) => [
        new Date(r.created_at).toLocaleTimeString(),
        r.name,
        r.email,
        r.place,
        r.city || "",
        r.country || "",
        new Date(r.created_at).toLocaleString(),
        r.campaign_id || "-"
      ]),
    ];

    const csv =
      "data:text/csv;charset=utf-8," +
      csvRows.map((r) => r.join(",")).join("\n");

    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "email_requests.csv";
    a.click();
  }

  /* ---------------------------
     UI
  ---------------------------- */

  return (
    <div style={ui.card}>
      {/* Header */}
      <div
        style={ui.header}
        onClick={() => setOpen((v) => !v)}
      >
        <h3 style={ui.title}>
          {open ? "▼" : "▶"} Email Requests
        </h3>
        <span style={ui.meta}>
          {rows.length} total
        </span>
      </div>

      {!open && (
        <p style={ui.hint}>
          Click to view and export email request logs
        </p>
      )}

      {open && (
        <>
          {/* Controls */}
          <div style={ui.controls}>
            <input
              placeholder="Search name, email, place…"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={ui.input}
            />

            <select
              value={countryFilter}
              onChange={(e) =>
                setCountryFilter(e.target.value)
              }
              style={ui.input}
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={exportCSV}
              style={ui.export}
            >
              ⬇ Export CSV
            </button>
          </div>

          <p style={ui.count}>
            Showing <b>{filtered.length}</b> records
          </p>

          {/* Table */}
          <div style={ui.tableWrap}>
            <table style={ui.table}>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("date")}
                  >
                    Date {arrow("date")}
                  </th>
                  <th>Time</th>
                  <th>Campaign Id</th>
                  <th onClick={() => handleSort("name")}>
                    Name {arrow("name")}
                  </th>
                  <th>Email</th>
                  <th>Place</th>
                  <th>City</th>
                  <th
                    onClick={() =>
                      handleSort("country")
                    }
                  >
                    Country {arrow("country")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {sorted.slice(0, 50).map((r) => (
                  <tr key={r.id}>
                    <td>
                      {new Date(
                        r.created_at
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(
                        r.created_at
                      ).toLocaleTimeString()}
                    </td>
                    <td>{r.campaign_id || "-"}</td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.place}</td>
                    <td>{r.city || "-"}</td>
                    <td>{r.country || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={ui.note}>
            Showing first 50 rows for performance
          </p>
        </>
      )}
    </div>
  );
}

/* ---------------------------
   Styles
---------------------------- */

const ui: any = {
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,.06)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 0,
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: "#6b7280",
  },
  controls: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 14,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    minWidth: 180,
  },
  export: {
    background: "#111827",
    color: "white",
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  count: {
    fontSize: 13,
    marginTop: 10,
  },
  tableWrap: {
    marginTop: 10,
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
  },
  table: {
    width: "100%",
    minWidth: 900,
    borderCollapse: "collapse",
    fontSize: 14,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },
};
