"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";

const categories = [
  { name: "전체", href: "/products" },
  { name: "앨범", href: "/products?category=album" },
  { name: "포토카드", href: "/products?category=photocard" },
  { name: "시즌/MD", href: "/products?category=season_md" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-purple">ARMY</span> Store
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`text-sm font-medium transition-colors hover:text-purple ${
                pathname === cat.href ? "text-purple" : "text-muted-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <Link
            href="/search"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="검색"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="장바구니"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-purple text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="메뉴"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 12h16" />
                  <path d="M4 6h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${
                pathname === cat.href ? "text-purple" : "text-muted-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/orders/lookup"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium py-2 text-muted-foreground"
          >
            주문조회
          </Link>
        </div>
      )}
    </nav>
  );
}
