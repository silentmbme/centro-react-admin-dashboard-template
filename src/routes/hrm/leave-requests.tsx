import { createFileRoute } from "@tanstack/react-router";
import { HrmPage } from "@/components/hrm/HrmPages";
export const Route = createFileRoute("/hrm/leave-requests")({
  head: () => ({ meta: [{ title: "Leave Requests | Centro" }] }),
  component: () => <HrmPage kind="leave-requests" />,
});
