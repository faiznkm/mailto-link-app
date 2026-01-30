"use client";

import { useState } from "react";

export default function AdminTableClient({ rows }: { rows: any[] }) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  // Unique country list
  const countries = Array.from(
    new Set(rows.map((r) => r.country).filter(Boolean))
  );

  // Filter logic
  const filtered = rows.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());

    const matchesCountry =
      !countryFilter || r.country === countryFilter;

    return matchesSearch && matchesCountry;
  });

  return (
    <div style={{ marginTop: 30 }}>
      {/* Search + Filter Controls */}
      <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
        {/* Search */}
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            width: 250,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />

        {/* Country Filter */}
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          style={{
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <p>
        Showing <b>{filtered.length}</b> results
      </p>

      {/* Table */}
      <table
        border={1}
        cellPadding={10}
        style={{ width: "100%", fontSize: 14 }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Place</th>
            <th>City</th>
            <th>Country</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {filtered.slice(0, 50).map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.place}</td>
              <td>{row.city}</td>
              <td>{row.country}</td>
              <td>{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
