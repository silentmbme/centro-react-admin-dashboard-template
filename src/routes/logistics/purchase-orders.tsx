import { createFileRoute } from "@tanstack/react-router";
import { LogisticsPage } from "@/components/logistics/LogisticsPages";
export const Route = createFileRoute("/logistics/purchase-orders")({
  head: () => ({ meta: [{ title: "Purchase Orders | Centro Logistics" }] }),
  component: () => <LogisticsPage kind="purchase-orders" />,
});
