import { createFileRoute } from "@tanstack/react-router";
import { CryptoPage } from "@/components/crypto/CryptoPages";
export const Route = createFileRoute("/crypto/market")({
  head: () => ({ meta: [{ title: "Crypto market | Centro" }] }),
  component: () => <CryptoPage kind="market" />,
});
