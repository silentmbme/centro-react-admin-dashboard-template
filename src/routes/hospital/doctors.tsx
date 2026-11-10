import { createFileRoute } from "@tanstack/react-router";
import { HospitalPage } from "@/components/hospital/HospitalPages";
export const Route = createFileRoute("/hospital/doctors")({
  head: () => ({ meta: [{ title: "Doctors | Centro" }] }),
  component: () => <HospitalPage kind="doctors" />,
});
