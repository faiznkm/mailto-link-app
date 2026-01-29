import { supabaseServer } from "../../../lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, place, email } = body;

    // ✅ Required validation
    if (!name || !place || !email) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Strict Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ Capture IP Address (Vercel-safe)
    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || "unknown";

    // ✅ Capture Device Info
    const userAgent = req.headers.get("user-agent") || "unknown";

    // ✅ Default location values
    let city = null;
    let region = null;
    let country = null;

    // ✅ Fetch Location by IP (Global)
    if (ip !== "unknown") {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = await geoRes.json();

        city = geoData.city || null;
        region = geoData.region || null;
        country = geoData.country_name || null;
      } catch (geoError) {
        console.log("Geo lookup failed:", geoError);
      }
    }

    // ✅ Insert into Supabase
    const { error } = await supabaseServer.from("email_requests").insert([
      {
        name,
        place,
        email,
        ip_address: ip,
        user_agent: userAgent,
        city,
        region,
        country,
      },
    ]);

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      location: { city, region, country },
    });
  } catch (err) {
    return Response.json(
      { success: false, error: "Invalid request format" },
      { status: 400 }
    );
  }
}
