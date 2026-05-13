import { createFileRoute } from "@tanstack/react-router";
import { Admin } from "@/components/Admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — StackVault" },
      { name: "description", content: "Vault owner controls and analytics." },
    ],
  }),
  component: Admin,
});
