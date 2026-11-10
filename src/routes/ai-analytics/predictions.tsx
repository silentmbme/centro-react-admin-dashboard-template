import { createFileRoute } from "@tanstack/react-router";
import { AiAnalyticsPage } from "@/components/ai-analytics/AiAnalyticsPages";
export const Route = createFileRoute("/ai-analytics/predictions")({
  head: () => ({ meta: [{ title: "Predictions | Centro" }] }),
  component: () => <AiAnalyticsPage kind="predictions" />,
});
