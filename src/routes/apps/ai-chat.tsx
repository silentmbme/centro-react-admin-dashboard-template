import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AiChat } from "@/components/apps/AiChat";
export const Route = createFileRoute("/apps/ai-chat")({
  head: () => ({ meta: [{ title: "AI Chat | Centro" }] }),
  component: () => (
    <AppShell>
      <AiChat />
    </AppShell>
  ),
});
