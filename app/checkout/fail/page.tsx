"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "UNKNOWN_ERROR";
  const message = searchParams.get("message") || "알 수 없는 오류가 발생했습니다.";

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
      <p className="text-muted-foreground mb-2">{message}</p>
      <p className="text-xs text-muted-foreground mb-8">오류 코드: {code}</p>

      <div className="flex gap-3 justify-center">
        <Link href="/cart" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8")}>
          장바구니로 돌아가기
        </Link>
        <Link href="/checkout" className={cn(buttonVariants(), "bg-purple hover:bg-purple-dark text-white rounded-full px-8")}>
          다시 시도하기
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-6 py-20 text-center">로딩 중...</div>}>
      <FailContent />
    </Suspense>
  );
}
