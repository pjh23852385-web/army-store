"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function OrderCompleteContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "";

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-purple/10 flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9333EA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-3">주문이 완료되었습니다!</h1>
      <p className="text-muted-foreground mb-8">
        주문해 주셔서 감사합니다. 아래 주문번호로 배송 현황을 확인하실 수 있습니다.
      </p>

      {/* Order Number */}
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

export default function OrderCompletePage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-6 py-20 text-center">로딩 중...</div>}>
      <OrderCompleteContent />
    </Suspense>
  );
}
