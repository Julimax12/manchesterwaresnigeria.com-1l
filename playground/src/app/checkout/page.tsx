import Link from "next/link";
import { Container } from "@/components/Container";

export default function CheckoutPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
      <p className="mt-3 text-sm text-muted-foreground">This is a demo checkout. Integrate your preferred provider (Stripe, etc.).</p>
      <Link href="/products" className="mt-6 inline-block rounded-full border px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10">Continue shopping</Link>
    </Container>
  );
}