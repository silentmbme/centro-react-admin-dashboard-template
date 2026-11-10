import { createFileRoute } from "@tanstack/react-router";
import { FinancePage } from "@/components/finance/FinancePages";
export const Route = createFileRoute("/finance/budgets")({
  head: () => ({ meta: [{ title: "Budgets | Centro Finance" }] }),
  component: () => <FinancePage kind="budgets" />,
});
