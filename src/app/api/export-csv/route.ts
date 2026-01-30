import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cookies } from "next/headers";


export async function GET() {

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  if (!isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Fetch all records (or last 5000)
  const { data, error } = await supabaseAdmin
    .from("email_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    return new Response("Failed to export CSV", { status: 500 });
  }

  const rows = data || [];

  // Convert to CSV
  const header =
    "Name,Email,Place,City,Region,Country,IP Address,Created At\n";

  const csv = rows
    .map((r) =>
      [
        r.name,
        r.email,
        r.place,
        r.city,
        r.region,
        r.country,
        r.ip_address,
        r.created_at,
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  return new Response(header + csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="email_requests.csv"',
    },
  });
}
