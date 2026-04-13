"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setErrorMessage("결제 정보가 올바르지 않습니다.");
      return;
    }

    async function confirmPayment() {
      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMessage(data.message || "결제 승인에 실패했습니다.");
          return;
        }

        // 주문 정보 저장
        const pendingOrder = sessionStorage.getItem("army-store-pending-order");
        if (pendingOrder) {
          const orderInfo = JSON.parse(pendingOrder);
          const order = {
            id: crypto.randomUUID(),
            order_number: orderId,
            customer_name: orderInfo.customerName,
            customer_phone: orderInfo.customerPhone,
            customer_address: orderInfo.customerAddress,
            items: orderInfo.items,
            total_amount: orderInfo.totalAmount,
            payment_key: paymentKey,
            status: "ordered",
            created_at: new Date().toISOString(),
          };

          const existingOrders = JSON.parse(localStorage.getItem("army-store-orders") || "[]");
          existingOrders.push(order);
          localStorage.setItem("army-store-orders", JSON.stringify(existingOrders));
          sessionStorage.removeItem("army-store-pending-order");
        }

        clearCart();
        setOrderNumber(orderId!);
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage("결제 처리 중 오류가 발생했습니다.");
      }
    }

    confirmPayment();
  }, [searchParams, clearCart, router]);

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-purple/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3">결제를 확인하고 있습니다...</h1>
        <p className="text-muted-foreground">잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3">결제에 실패했습니다</h1>
        <p className="text-muted-foreground mb-8">{errorMessage}</p>
        <Link href="/checkout" className={cn(buttonVariants(), "bg-purple hover:bg-purple-dark text-white rounded-full px-8")}>
          다시 시도하기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-purple/10 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-3">결제가 완료되었습니다!</h1>
      <p className="text-muted-foreground mb-8">
        주문해 주셔서 감사합니다. 아래 주문번호로 배송 현황을 확인하실 수 있습니다.
      </p>

      <div className="bg-[#FAFAFA] rounded-2xl p-6 mb-8 inline-block">
        <p className="text-sm text-muted-foreground mb-1">주문번호</p>
        <p className="text-xl font-bold text-purple tracking-wider">{orderNumber}</p>
      </div>

      <p className="text-sm text-muted-foreground mb-8">
        주문번호와 연락처를 기억해 주세요. 주문 조회 시 필요합니다.
      </p>

      <div className="flex gap-3 justify-center">
        <Link href="/orders/lookup" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8")}>
          주문 조회
        </Link>
        <Link href="/" className={cn(buttonVariants(), "bg-purple hover:bg-purple-dark text-white rounded-full px-8")}>
          홈으로
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-6 py-20 text-center">결제 확인 중...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
