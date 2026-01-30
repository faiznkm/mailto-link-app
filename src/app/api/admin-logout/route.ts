import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("admin_auth", "", {
    path: "/",
    maxAge: 0,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
    },
  });
}
