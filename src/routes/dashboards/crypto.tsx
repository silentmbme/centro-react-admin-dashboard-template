import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CryptoDashboard } from "@/components/dashboard/CryptoDashboard";

export const Route = createFileRoute("/dashboards/crypto")({
  head: () => ({ meta: [{ title: "Crypto Dashboard | Centro" }] }),
  component: () => (
    <AppShell>
      <CryptoDashboard />
    </AppShell>
  ),
});
