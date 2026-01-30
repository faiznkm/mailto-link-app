import { supabaseServer } from "../../../lib/supabaseServer";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  if (!isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id, is_active } = await req.json();

  const { error } = await supabaseServer
    .from("email_campaigns")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    return Response.json({ success: false, error: error.message });
  }

  return Response.json({ success: true });
}
