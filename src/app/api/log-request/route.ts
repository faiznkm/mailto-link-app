import { supabaseServer } from "../../../lib/supabaseServer";

/* ✅ Detect Browser */
function detectBrowser(ua: string) {
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  return "Unknown";
}

/* ✅ Detect OS */
function detectOS(ua: string) {
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "Mac";
  return "Unknown";
}

/* ✅ Detect Traffic Source Automatically */
function detectTrafficSource(ua: string) {
  const userAgent = ua.toLowerCase();

  if (userAgent.includes("whatsapp")) return "whatsapp";
  if (userAgent.includes("instagram")) return "instagram";

  // Facebook in-app browsers
  if (userAgent.includes("fban") || userAgent.includes("fbav"))
    return "facebook";

  if (userAgent.includes("twitter")) return "twitter";
  if (userAgent.includes("telegram")) return "telegram";

  // Android WebView
  if (userAgent.includes("wv")) return "android-webview";

  return "direct";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      campaign_id,
      name,
      place,
      email,

      visitor_id,
      platform,
      device_type,
      screen_width,
      screen_height,
      language,
      referrer,
    } = body;

    // ✅ Required validation
    if (!name || !place || !email) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ IP Address
    const rawIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "";

    const ip = rawIp.split(",")[0]?.trim() || "unknown";

    // ✅ User Agent
    const userAgent = req.headers.get("user-agent") || "unknown";

    // ✅ Browser + OS
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);

    // ✅ Auto Traffic Source Detection
    const trafficSource = detectTrafficSource(userAgent);

    // ✅ Vercel Geo Headers (Works Only in Production)
    const country = req.headers.get("x-vercel-ip-country") || null;
    const region = req.headers.get("x-vercel-ip-country-region") || null;
    const city = req.headers.get("x-vercel-ip-city") || null;

    console.log("Logging Visitor:", {
      name,
      city,
      region,
      country,
      device_type,
      browser,
      os,
      trafficSource,
    });

    // ✅ Insert into Supabase
    const { error } = await supabaseServer.from("email_requests").insert([
      {
        campaign_id,
        name,
        place,
        email,

        visitor_id,
        device_type,
        browser,
        os,
        platform,
        screen_width,
        screen_height,
        language,
        referrer,

        // ✅ NEW FIELD
        traffic_source: trafficSource,

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

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { success: false, error: "Invalid request format" },
      { status: 400 }
    );
  }
}
