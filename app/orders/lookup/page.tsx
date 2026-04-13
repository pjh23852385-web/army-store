"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/types";

const statusLabels: Record<string, { label: string; color: string }> = {
  ordered: { label: "주문완료", color: "bg-purple text-white" },
  preparing: { label: "배송준비", color: "bg-yellow-500 text-white" },
  shipping: { label: "배송중", color: "bg-blue-500 text-white" },
  delivered: { label: "배송완료", color: "bg-green-500 text-white" },
};

export default function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    // Search in localStorage
    const orders: Order[] = JSON.parse(localStorage.getItem("army-store-orders") || "[]");
    const found = orders.find(
      (o) => o.order_number === orderNumber && o.customer_phone === phone
    );
    setOrder(found || null);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-3">주문 조회</h1>
      <p className="text-muted-foreground mb-8">
        주문번호와 연락처를 입력하여 주문 현황을 확인하세요.
      </p>

      <form onSubmit={handleSearch} className="space-y-4 mb-10">
        <div>
          <label className="text-sm font-medium mb-1.5 block">주문번호</label>
          <Input
            required
            placeholder="AS260413-XXXXXX"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">연락처</label>
          <Input
            required
            placeholder="010-1234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-purple hover:bg-purple-dark text-white rounded-full"
        >
          조회하기
        </Button>
      </form>

      {/* Result */}
      {searched && (
        order ? (
          <div className="bg-[#FAFAFA] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">주문번호</p>
                <p className="font-bold">{order.order_number}</p>
              </div>
              <Badge className={statusLabels[order.status]?.color || ""}>
                {statusLabels[order.status]?.label || order.status}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product_name} x{item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <span className="font-bold">총 결제 금액</span>
              <span className="font-bold text-purple">{formatPrice(order.total_amount)}</span>
            </div>

            <div className="mt-4 text-sm text-muted-foreground space-y-1">
              <p>주문자: {order.customer_name}</p>
              <p>배송지: {order.customer_address}</p>
              <p>주문일: {new Date(order.created_at).toLocaleDateString("ko-KR")}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-lg mb-2">주문을 찾을 수 없습니다</p>
            <p className="text-sm">주문번호와 연락처를 다시 확인해 주세요.</p>
          </div>
        )
      )}
    </div>
  );
}
