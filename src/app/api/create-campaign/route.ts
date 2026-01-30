import { supabaseServer } from "../../../lib/supabaseServer";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {

    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_auth")?.value === "true";

    if (!isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const {
      campaign_name,
      description,
      slug,
      custom_domain,
      to_email,
      cc_email,
      subject,
      body_text,
      start_date,
      end_date,
    } = body;

    // Validation
    if (
      !campaign_name ||
      !description ||
      !slug ||
      !to_email ||
      !subject ||
      !body_text ||
      !start_date ||
      !end_date
    ) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert campaign
    const { data, error } = await supabaseServer
      .from("email_campaigns")
      .insert([
        {
          campaign_name,
          description,
          slug,
          custom_domain,
          to_email,
          cc_email,
          subject,
          body: body_text,
          start_date,
          end_date,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true, campaign: data });
  } catch (err) {
    return Response.json(
      { success: false, error: "Invalid request format" },
      { status: 400 }
    );
  }
}
