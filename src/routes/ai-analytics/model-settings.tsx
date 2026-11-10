import { createFileRoute } from "@tanstack/react-router";
import { AiAnalyticsPage } from "@/components/ai-analytics/AiAnalyticsPages";
export const Route = createFileRoute("/ai-analytics/model-settings")({
  head: () => ({ meta: [{ title: "Model Settings | Centro" }] }),
  component: () => <AiAnalyticsPage kind="models" />,
});
