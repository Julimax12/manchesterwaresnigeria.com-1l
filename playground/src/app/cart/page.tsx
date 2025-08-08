import { Container } from "@/components/Container";
import { CartContent } from "@/components/CartContent";

export default function CartPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Your Cart</h1>
      <CartContent />
    </Container>
  );
}