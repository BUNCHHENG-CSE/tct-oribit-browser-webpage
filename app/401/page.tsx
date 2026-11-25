import { UnauthorizedView } from "@/components/errors/UnauthorizedView";

export const metadata = {
  title: "401 Unauthorized — Sector Clearance Required",
  description: "Access to this orbital sector requires cryptographic mission control authorization.",
};

export default function Page401() {
  return <UnauthorizedView />;
}
