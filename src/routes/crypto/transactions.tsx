import { createFileRoute } from "@tanstack/react-router";
import { CryptoPage } from "@/components/crypto/CryptoPages";
export const Route = createFileRoute("/crypto/transactions")({
  head: () => ({ meta: [{ title: "Crypto transactions | Centro" }] }),
  component: () => <CryptoPage kind="transactions" />,
});
