import { supabaseServer } from "../../../lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, place } = body;

    // Get metadata from request headers
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    // Insert into Supabase
    const { error } = await supabaseServer.from("email_requests").insert([
      {
        name,
        place,
        ip_address: ip,
        user_agent: userAgent,
      },
    ]);

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
