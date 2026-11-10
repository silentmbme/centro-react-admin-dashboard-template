import { createFileRoute } from "@tanstack/react-router";
import { HospitalPage } from "@/components/hospital/HospitalPages";
export const Route = createFileRoute("/hospital/pharmacy")({
  head: () => ({ meta: [{ title: "Pharmacy | Centro" }] }),
  component: () => <HospitalPage kind="pharmacy" />,
});
