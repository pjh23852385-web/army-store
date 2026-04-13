"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/product/product-card";
import { sampleProducts } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";

const categoryLabels: Record<string, string> = {
  all: "전체",
  album: "앨범",
  photocard: "포토카드",
  season_md: "시즌/MD",
};

const members = ["전체", "RM", "진", "슈가", "제이홉", "지민", "뷔", "정국"];

type SortKey = "newest" | "price_asc" | "price_desc" | "popular";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-center">로딩 중...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [category, setCategory] = useState(initialCategory);
  const [member, setMember] = useState("전체");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    let products = [...sampleProducts];

    if (category !== "all") {
      products = products.filter((p) => p.category === category);
    }
    if (member !== "전체") {
      products = products.filter((p) => p.member === member);
    }

    switch (sort) {
      case "newest":
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "price_asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        products.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
        break;
    }

    return products;
  }, [category, member, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb - ProductsContent */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-purple transition-colors">홈</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">
          {categoryLabels[category] || "전체 상품"}
        </span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-8">
        {categoryLabels[category] || "전체 상품"}
      </h1>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={category === key ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${
                category === key ? "bg-purple hover:bg-purple-dark text-white" : ""
              }`}
              onClick={() => setCategory(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Member Filter */}
        <div className="flex gap-2 flex-wrap">
          {members.map((m) => (
            <button
              key={m}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                member === m
                  ? "border-purple text-purple bg-purple/5"
                  : "border-border text-muted-foreground hover:border-purple/50"
              }`}
              onClick={() => setMember(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">정렬:</span>
          {[
            { key: "newest" as SortKey, label: "최신순" },
            { key: "price_asc" as SortKey, label: "낮은 가격순" },
            { key: "price_desc" as SortKey, label: "높은 가격순" },
            { key: "popular" as SortKey, label: "인기순" },
          ].map((s) => (
            <button
              key={s.key}
              className={`text-xs transition-colors ${
                sort === s.key ? "text-purple font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setSort(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">상품이 없습니다</p>
          <p className="text-sm">다른 필터를 선택해 보세요.</p>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        총 {filtered.length}개 상품
      </div>
    </div>
  );
}
