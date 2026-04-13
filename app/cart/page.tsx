"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold mb-3">장바구니가 비어있습니다</h1>
        <p className="text-muted-foreground mb-8">마음에 드는 상품을 담아보세요!</p>
        <Link href="/products" className={cn(buttonVariants(), "bg-purple hover:bg-purple-dark text-white rounded-full px-8")}>
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">장바구니</h1>

      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={`${item.product.id}-${idx}`}>
            <div className="flex gap-4 md:gap-6">
              {/* Image */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#F5F5F7] overflow-hidden flex-shrink-0">
                {item.product.images[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="text-sm md:text-base font-medium hover:text-purple transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>
                {Object.entries(item.selectedOptions).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.entries(item.selectedOptions)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </p>
                )}
                <p className="text-sm font-bold mt-2">{formatPrice(item.product.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm hover:border-purple transition-colors"
                      onClick={() =>
                        updateQuantity(item.product.id, item.selectedOptions, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm hover:border-purple transition-colors"
                      onClick={() =>
                        updateQuantity(item.product.id, item.selectedOptions, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => removeItem(item.product.id, item.selectedOptions)}
                  >
                    삭제
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="hidden md:block text-right flex-shrink-0">
                <p className="font-bold">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            </div>
            {idx < items.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 p-6 bg-[#FAFAFA] rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">상품 금액</span>
          <span className="font-medium">{formatPrice(totalPrice())}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">배송비</span>
          <span className="font-medium">{totalPrice() >= 50000 ? "무료" : formatPrice(3000)}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">총 결제 금액</span>
          <span className="text-lg font-bold text-purple">
            {formatPrice(totalPrice() + (totalPrice() >= 50000 ? 0 : 3000))}
          </span>
        </div>
        {totalPrice() < 50000 && (
          <p className="text-xs text-muted-foreground mt-2">
            {formatPrice(50000 - totalPrice())} 더 구매하면 무료배송!
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/products" className={cn(buttonVariants({ variant: "outline" }), "flex-1 rounded-full")}>
          계속 쇼핑하기
        </Link>
        <Link href="/checkout" className={cn(buttonVariants(), "flex-1 bg-purple hover:bg-purple-dark text-white rounded-full")}>
          주문하기
        </Link>
      </div>
    </div>
  );
}
