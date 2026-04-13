"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/product/product-card";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { sampleProducts } from "@/lib/sample-data";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const product = sampleProducts.find((p) => p.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
        <Link href="/products" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
          상품 목록으로
        </Link>
      </div>
    );
  }

  const relatedProducts = sampleProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedOptions);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-purple transition-colors">홈</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-purple transition-colors">상품</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl bg-[#F5F5F7] overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.is_new && (
              <Badge className="bg-purple text-white border-0">NEW</Badge>
            )}
            {product.is_popular && (
              <Badge variant="secondary">인기</Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.member && (
            <p className="text-purple text-sm font-medium mb-2">{product.member}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-purple mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Options */}
          {product.options.map((option) => (
            <div key={option.name} className="mb-6">
              <label className="text-sm font-medium mb-3 block">{option.name}</label>
              <div className="flex gap-2 flex-wrap">
                {option.values.map((value) => (
                  <button
                    key={value}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      selectedOptions[option.name] === value
                        ? "border-purple text-purple bg-purple/5"
                        : "border-border text-muted-foreground hover:border-purple/50"
                    }`}
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-8">
            <label className="text-sm font-medium mb-3 block">수량</label>
            <div className="flex items-center gap-3">
              <button
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-purple transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-purple transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          <p className="text-xs text-muted-foreground mb-4">
            재고: {product.stock > 0 ? `${product.stock}개 남음` : "품절"}
          </p>

          {/* Add to Cart */}
          <div className="flex gap-3 mt-auto">
            <Button
              size="lg"
              className="flex-1 bg-purple hover:bg-purple-dark text-white rounded-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {addedToCart ? "장바구니에 담았습니다!" : "장바구니 담기"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                handleAddToCart();
                router.push("/cart");
              }}
              disabled={product.stock === 0}
            >
              바로 구매
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-bold tracking-tight mb-6">관련 상품</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
