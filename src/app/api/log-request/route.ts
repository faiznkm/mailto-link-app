import { supabaseServer } from "../../../lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaign_id, name, place, email } = body;

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

    // ✅ Capture IP Address (Vercel + Local Safe)
    const rawIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "";

    const ip = rawIp.split(",")[0]?.trim() || "unknown";

    // ✅ Capture Device Info
    const userAgent = req.headers.get("user-agent") || "unknown";

    // ✅ Default location values
    let city: string | null = null;
    let region: string | null = null;
    let country: string | null = null;

    // ✅ Fetch Location by IP
    if (ip !== "unknown") {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: {
            // ipapi sometimes blocks requests without UA
            "User-Agent": "Mozilla/5.0 (MailtoLinkApp)",
          },
        });

        // ✅ Check if request succeeded
        if (!geoRes.ok) {
          console.log("Geo API failed:", geoRes.status);
        } else {
          const geoData = await geoRes.json();

          // ✅ ipapi error response handling
          if (geoData.error) {
            console.log("Geo lookup error:", geoData.reason);
          } else {
            city = geoData.city || null;
            region = geoData.region || null;
            country = geoData.country_name || null;
          }
        }
      } catch (geoError) {
        console.log("Geo lookup failed:", geoError);
      }
    }

    // ✅ Insert into Supabase
    const { error } = await supabaseServer.from("email_requests").insert([
      {
        campaign_id,
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
