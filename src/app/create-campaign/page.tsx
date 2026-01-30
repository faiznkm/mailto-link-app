import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormClient from "./FormClient";

export default async function CreateCampaignPage() {
  // ✅ Admin Cookie Check
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  // If not logged in → redirect to login
  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <main style={{ padding: 50, maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>
        Create New Campaign
      </h1>

      <FormClient />
    </main>
  );
}
