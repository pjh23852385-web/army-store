export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AS${date}-${random}`;
}
