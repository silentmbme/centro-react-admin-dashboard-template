import { createFileRoute } from "@tanstack/react-router";
import { HospitalPage } from "@/components/hospital/HospitalPages";
export const Route = createFileRoute("/hospital/ambulance")({
  head: () => ({ meta: [{ title: "Ambulance | Centro" }] }),
  component: () => <HospitalPage kind="ambulance" />,
});
