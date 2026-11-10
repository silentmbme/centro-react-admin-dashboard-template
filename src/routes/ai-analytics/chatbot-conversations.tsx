import { createFileRoute } from "@tanstack/react-router";
import { AiAnalyticsPage } from "@/components/ai-analytics/AiAnalyticsPages";
export const Route = createFileRoute("/ai-analytics/chatbot-conversations")({
  head: () => ({ meta: [{ title: "Chatbot Assistant | Centro" }] }),
  component: () => <AiAnalyticsPage kind="chatbot" />,
});
