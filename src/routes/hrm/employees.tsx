import { createFileRoute } from "@tanstack/react-router";
import { HrmPage } from "@/components/hrm/HrmPages";
export const Route = createFileRoute("/hrm/employees")({
  head: () => ({ meta: [{ title: "Employees | Centro" }] }),
  component: () => <HrmPage kind="employees" />,
});
