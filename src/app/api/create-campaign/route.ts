import { supabaseServer } from "../../../lib/supabaseServer";
import { cookies } from "next/headers";

export async function POST(req: Request) {

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    function validateEmailArray(emails: unknown) {
      if (!Array.isArray(emails)) return false;
      return emails.every(
        (email) =>
          typeof email === "string" &&
          EMAIL_REGEX.test(email)
      );
    }

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
    thumbnail_url,
    to_email,
    cc_email,
    subject,
    body_text,
    start_date,
    end_date,
  } = body;

  if (
    !campaign_name ||
    !description ||
    !slug ||
    !validateEmailArray(to_email) ||
    !validateEmailArray(cc_email ?? []) ||
    !subject ||
    !body_text ||
    !start_date
  ) {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("email_campaigns")
    .insert([
      {
        campaign_name,
        description,
        slug,
        custom_domain,
        thumbnail_url,
        to_email,
        cc_email,
        subject,
        body: body_text,
        start_date,
        end_date: end_date || null,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, campaign: data });
}
