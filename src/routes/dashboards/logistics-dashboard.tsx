import { createFileRoute } from "@tanstack/react-router";
import { LogisticsDashboardPage } from "@/components/dashboard/LogisticsDashboard";
export const Route = createFileRoute("/dashboards/logistics-dashboard")({
  head: () => ({ meta: [{ title: "Logistics Dashboard | Centro" }] }),
  component: LogisticsDashboardPage,
});
