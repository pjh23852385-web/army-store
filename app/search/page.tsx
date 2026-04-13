"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product/product-card";
import { sampleProducts } from "@/lib/sample-data";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return sampleProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.member && p.member.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">검색</h1>

      {/* Search Input */}
      <div className="relative max-w-xl mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <Input
          placeholder="상품명, 멤버 이름으로 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-12 rounded-full text-base"
          autoFocus
        />
      </div>

      {/* Results */}
      {query.trim() ? (
        results.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              &quot;{query}&quot; 검색 결과 {results.length}개
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg mb-2">&quot;{query}&quot;에 대한 검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드로 검색해 보세요.</p>
          </div>
        )
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">검색어를 입력해 주세요</p>
        </div>
      )}
    </div>
  );
}
