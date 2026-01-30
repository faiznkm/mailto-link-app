"use client";

import { useState } from "react";

export default function AdminTableClient({ rows }: { rows: any[] }) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  /* ✅ Sorting State */
  const [sortColumn, setSortColumn] = useState<
    "name" | "country" | "date"
  >("date");

  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc"
  >("desc");

  /* ✅ Unique Countries */
  const countries = Array.from(
    new Set(rows.map((r) => r.country).filter(Boolean))
  );

  /* ✅ Filtering */
  let filtered = rows.filter((r) => {
    const text =
      (r.name + r.email + r.place).toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    const matchesCountry =
      !countryFilter || r.country === countryFilter;

    return matchesSearch && matchesCountry;
  });

  /* ✅ Sorting Logic */
  filtered.sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (sortColumn === "name") {
      valueA = a.name.toLowerCase();
      valueB = b.name.toLowerCase();
    }

    if (sortColumn === "country") {
      valueA = (a.country || "").toLowerCase();
      valueB = (b.country || "").toLowerCase();
    }

    if (sortColumn === "date") {
      valueA = new Date(a.created_at).getTime();
      valueB = new Date(b.created_at).getTime();
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  /* ✅ Header Click Handler */
  function handleSort(col: "name" | "country" | "date") {
    if (sortColumn === col) {
      // Toggle direction
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      // New column sort
      setSortColumn(col);
      setSortDirection("asc");
    }
  }

  /* ✅ Sort Arrow */
  function arrow(col: string) {
    if (sortColumn !== col) return "⬍";
    return sortDirection === "asc" ? "⬆" : "⬇";
  }

  /* ✅ CSV Export */
  function exportCSV() {
    const csvRows = [
      ["Name", "Email", "Place", "City", "Country", "Date"],
      ...filtered.map((r) => [
        r.name,
        r.email,
        r.place,
        r.city || "",
        r.country || "",
        new Date(r.created_at).toLocaleString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "email_requests.csv";
    link.click();
  }

  return (
    <div style={styles.wrapper}>
      {/* ✅ Controls */}
      <div style={styles.controls}>
        <input
          placeholder="Search name, email, place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          style={styles.input}
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button onClick={exportCSV} style={styles.exportBtn}>
          ⬇ Export CSV
        </button>
      </div>

      {/* Count */}
      <p style={styles.countText}>
        Showing <b>{filtered.length}</b> records
      </p>

      {/* ✅ Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headRow}>
              <th
                style={styles.sortableTh}
                onClick={() => handleSort("name")}
              >
                Name {arrow("name")}
              </th>

              <th style={styles.th}>Email</th>
              <th style={styles.th}>Place</th>
              <th style={styles.th}>City</th>

              <th
                style={styles.sortableTh}
                onClick={() => handleSort("country")}
              >
                Country {arrow("country")}
              </th>

              <th
                style={styles.sortableTh}
                onClick={() => handleSort("date")}
              >
                Date {arrow("date")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.slice(0, 50).map((row) => (
              <tr key={row.id} style={styles.row}>
                <td style={styles.td}>{row.name}</td>
                <td style={styles.td}>{row.email}</td>
                <td style={styles.td}>{row.place}</td>
                <td style={styles.td}>{row.city || "-"}</td>
                <td style={styles.td}>{row.country || "-"}</td>
                <td style={styles.td}>
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={styles.note}>
        Only first 50 records shown for performance.
      </p>
    </div>
  );
}

/* ✅ Styles */
const styles: any = {
  wrapper: { marginTop: 10 },

  controls: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 15,
  },

  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    minWidth: 180,
  },

  exportBtn: {
    background: "#111827",
    color: "white",
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },

  countText: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 10,
  },

  tableWrap: {
    overflowX: "auto",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 800,
    fontSize: 14,
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

  sortableTh: {
    padding: "12px 14px",
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    cursor: "pointer",
    userSelect: "none",
  },

  row: {
    borderTop: "1px solid #f3f4f6",
  },

  td: {
    padding: "14px",
    color: "#111827",
  },

  note: {
    marginTop: 10,
    fontSize: 12,
    color: "#6b7280",
  },
};
