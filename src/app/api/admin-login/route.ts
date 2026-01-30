import { serialize } from "cookie";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ success: false }, { status: 401 });
  }

  // ✅ Set cookie for admin session
  const cookie = serialize("admin_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
    },
  });
}
