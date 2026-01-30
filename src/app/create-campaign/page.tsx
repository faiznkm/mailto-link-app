import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormClient from "./FormClient";

export default async function CreateCampaignPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div style={{ width: "100%", maxWidth: 720 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Create New Campaign
        </h1>

        <FormClient />
      </div>
    </main>
  );
}
