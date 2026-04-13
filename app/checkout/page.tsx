"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, generateOrderNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { id: "card", label: "신용/체크카드", icon: "💳" },
  { id: "transfer", label: "계좌이체", icon: "🏦" },
  { id: "kakaopay", label: "카카오페이", icon: "💛" },
  { id: "naverpay", label: "네이버페이", icon: "💚" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
    memo: "",
  });
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">주문할 상품이 없습니다</h1>
        <Link href="/products" className={cn(buttonVariants(), "bg-purple hover:bg-purple-dark text-white rounded-full px-8 mt-4")}>
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  const shipping = totalPrice() >= 50000 ? 0 : 3000;
  const total = totalPrice() + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderNumber = generateOrderNumber();

    // Store order in localStorage for demo
    const order = {
      id: crypto.randomUUID(),
      order_number: orderNumber,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_address: `${form.address} ${form.detailAddress}`,
      items: items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0] || "",
        price: item.product.price,
        quantity: item.quantity,
        selected_options: item.selectedOptions,
      })),
      total_amount: total,
      status: "ordered",
      created_at: new Date().toISOString(),
    };

    // Save to localStorage (in production, this would go to Supabase)
    const existingOrders = JSON.parse(localStorage.getItem("army-store-orders") || "[]");
    existingOrders.push(order);
    localStorage.setItem("army-store-orders", JSON.stringify(existingOrders));

    clearCart();

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push(`/orders/complete?orderNumber=${orderNumber}`);
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">주문/결제</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Left: Form */}
          <div className="md:col-span-3 space-y-8">
            {/* Customer Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">주문자 정보</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">이름 *</label>
                  <Input
                    required
                    placeholder="홍길동"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">연락처 *</label>
                  <Input
                    required
                    placeholder="010-1234-5678"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-semibold mb-4">배송지 정보</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">주소 *</label>
                  <Input
                    required
                    placeholder="서울특별시 강남구 테헤란로 123"
                    value={form.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">상세주소</label>
                  <Input
                    placeholder="아파트 동/호수"
                    value={form.detailAddress}
                    onChange={(e) => updateForm("detailAddress", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">배송 메모</label>
                  <Input
                    placeholder="부재시 경비실에 맡겨주세요"
                    value={form.memo}
                    onChange={(e) => updateForm("memo", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-lg font-semibold mb-4">결제 수단</h2>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`p-4 rounded-xl border text-left transition-colors ${
                      payment === method.id
                        ? "border-purple bg-purple/5"
                        : "border-border hover:border-purple/50"
                    }`}
                    onClick={() => setPayment(method.id)}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <p className="text-sm font-medium mt-1">{method.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="md:col-span-2">
            <div className="sticky top-24 p-6 bg-[#FAFAFA] rounded-2xl">
              <h2 className="text-lg font-semibold mb-4">주문 요약</h2>

              <div className="space-y-3 mb-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span>{shipping === 0 ? "무료" : formatPrice(shipping)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <span className="font-bold">총 결제 금액</span>
                <span className="text-lg font-bold text-purple">{formatPrice(total)}</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6 bg-purple hover:bg-purple-dark text-white rounded-full"
                disabled={loading}
              >
                {loading ? "처리 중..." : `${formatPrice(total)} 결제하기`}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                * 이 사이트는 데모입니다. 실제 결제가 이루어지지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
