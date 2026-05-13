import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StackVault" },
      { name: "description", content: "Manage your STX stake, view rewards, and process withdrawals." },
    ],
  }),
  component: Dashboard,
});
