"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, generateOrderNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_gck_docs_Ovk5rk1EwkEbP0W23n07xlzm";
const CUSTOMER_KEY = "@@ANONYMOUS";

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      widgets: (params: { customerKey: string }) => TossWidgets;
    };
  }
}

interface TossWidgets {
  setAmount: (amount: { currency: string; value: number }) => Promise<void>;
  renderPaymentMethods: (params: { selector: string }) => Promise<void>;
  renderAgreement: (params: { selector: string }) => Promise<void>;
  requestPayment: (params: {
    orderId: string;
    orderName: string;
    customerName?: string;
    customerMobilePhone?: string;
    successUrl: string;
    failUrl: string;
  }) => Promise<void>;
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
    memo: "",
  });
  const [ready, setReady] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetsRef = useRef<TossWidgets | null>(null);
  const widgetRendered = useRef(false);

  const shipping = totalPrice() >= 50000 ? 0 : 3000;
  const total = totalPrice() + shipping;

  // 스크립트 로드 후 위젯 초기화 및 렌더링
  useEffect(() => {
    if (!scriptLoaded || items.length === 0 || widgetRendered.current) return;

    async function initAndRender() {
      try {
        const tossPayments = window.TossPayments(CLIENT_KEY);
        const widgets = tossPayments.widgets({ customerKey: CUSTOMER_KEY });
        widgetsRef.current = widgets;

        await widgets.setAmount({ currency: "KRW", value: total });
        await widgets.renderPaymentMethods({ selector: "#payment-method" });
        await widgets.renderAgreement({ selector: "#agreement" });

        widgetRendered.current = true;
        setReady(true);
      } catch (err) {
        console.error("토스페이먼츠 위젯 초기화 실패:", err);
      }
    }

    initAndRender();
  }, [scriptLoaded, items.length, total]);

  // 금액 변경 시 업데이트
  useEffect(() => {
    if (!widgetsRef.current || !widgetRendered.current) return;
    widgetsRef.current.setAmount({ currency: "KRW", value: total });
  }, [total]);

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

  const handlePayment = async () => {
    const widgets = widgetsRef.current;
    if (!widgets) return;
    if (!form.name || !form.phone || !form.address) {
      alert("주문자 정보와 배송지를 입력해주세요.");
      return;
    }

    const orderId = generateOrderNumber();

    // 주문 정보를 sessionStorage에 임시 저장 (결제 승인 후 사용)
    sessionStorage.setItem(
      "army-store-pending-order",
      JSON.stringify({
        orderId,
        customerName: form.name,
        customerPhone: form.phone,
        customerAddress: `${form.address} ${form.detailAddress}`,
        memo: form.memo,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.images[0] || "",
          price: item.product.price,
          quantity: item.quantity,
          selected_options: item.selectedOptions,
        })),
        totalAmount: total,
      })
    );

    const orderName =
      items.length === 1
        ? items[0].product.name
        : `${items[0].product.name} 외 ${items.length - 1}건`;

    await widgets.requestPayment({
      orderId,
      orderName,
      customerName: form.name,
      customerMobilePhone: form.phone.replace(/-/g, ""),
      successUrl: `${window.location.origin}/checkout/success`,
      failUrl: `${window.location.origin}/checkout/fail`,
    });
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <h1 className="text-3xl font-bold tracking-tight mb-8">주문/결제</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Left: Form + Widget */}
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

          {/* Toss Payments Widget */}
          <div>
            <h2 className="text-lg font-semibold mb-4">결제 수단</h2>
            <div id="payment-method" className="w-full" />
          </div>

          {/* Agreement Widget */}
          <div id="agreement" className="w-full" />
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
              type="button"
              size="lg"
              className="w-full mt-6 bg-purple hover:bg-purple-dark text-white rounded-full"
              disabled={!ready}
              onClick={handlePayment}
            >
              {!ready ? "결제 준비 중..." : `${formatPrice(total)} 결제하기`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
