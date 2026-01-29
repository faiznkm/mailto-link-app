import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { password?: string };
}) {
  const password = searchParams.password;

  // ✅ Simple Password Protection
  if (password !== process.env.ADMIN_PASSWORD) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Admin Access Denied</h1>
        <p>
          Add <code>?password=YOUR_PASSWORD</code> in the URL.
        </p>
      </main>
    );
  }

  // ✅ Fetch latest 50 requests
  const { data, error } = await supabaseAdmin
    .from("email_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Error Loading Data</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>
        Admin Dashboard
      </h1>

      <p style={{ marginTop: 10 }}>
        Showing last 50 email requests.
      </p>

      <table
        border={1}
        cellPadding={10}
        style={{ marginTop: 20, width: "100%", fontSize: 14 }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Place</th>
            <th>City</th>
            <th>Country</th>
            <th>IP</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.place}</td>
              <td>{row.city}</td>
              <td>{row.country}</td>
              <td>{row.ip_address}</td>
              <td>
                {new Date(row.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
