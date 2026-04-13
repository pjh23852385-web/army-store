import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { sampleProducts } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const categories = [
  { name: "앨범", href: "/products?category=album", emoji: "💿" },
  { name: "포토카드", href: "/products?category=photocard", emoji: "🃏" },
  { name: "시즌/MD", href: "/products?category=season_md", emoji: "🎁" },
];

export default function HomePage() {
  const newProducts = sampleProducts.filter((p) => p.is_new).slice(0, 4);
  const popularProducts = sampleProducts.filter((p) => p.is_popular).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-purple/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-36 text-center">
          <p className="text-purple font-medium text-sm tracking-widest uppercase mb-4">
            Premium BTS Goods
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            당신의 덕질을<br />
            <span className="text-purple">완성</span>하세요.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            앨범, 포토카드, 시즌그리팅까지.<br />
            ARMY를 위한 프리미엄 굿즈 스토어.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "bg-purple hover:bg-purple-dark text-white rounded-full px-8")}>
              쇼핑하기
            </Link>
            <Link href="/products?category=album" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8")}>
              앨범 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group bg-[#F5F5F7] hover:bg-purple/5 rounded-2xl p-6 md:p-10 text-center transition-all duration-300"
            >
              <div className="text-3xl md:text-5xl mb-3">{cat.emoji}</div>
              <h3 className="text-sm md:text-base font-semibold group-hover:text-purple transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-purple text-sm font-medium mb-1">NEW ARRIVALS</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">신상품</h2>
          </div>
          <Link href="/products" className="text-sm text-muted-foreground hover:text-purple transition-colors">
            전체보기 &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-purple text-sm font-medium mb-1">BEST SELLERS</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">인기상품</h2>
          </div>
          <Link href="/products" className="text-sm text-muted-foreground hover:text-purple transition-colors">
            전체보기 &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-purple to-purple-light rounded-3xl p-10 md:p-16 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">주문 조회</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            주문번호와 연락처로 간편하게 주문 현황을 확인하세요.
          </p>
          <Link href="/orders/lookup" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "rounded-full px-8 bg-white text-purple hover:bg-white/90")}>
            주문 조회하기
          </Link>
        </div>
      </section>
    </div>
  );
}
