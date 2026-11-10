import { createFileRoute } from "@tanstack/react-router";
import { HospitalPage } from "@/components/hospital/HospitalPages";
export const Route = createFileRoute("/hospital/billing")({
  head: () => ({ meta: [{ title: "Billing | Centro" }] }),
  component: () => <HospitalPage kind="billing" />,
});
