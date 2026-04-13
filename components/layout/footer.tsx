import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#FAFAFA] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-tight mb-3">
              <span className="text-purple">ARMY</span> Store
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              BTS 팬을 위한 프리미엄 굿즈 스토어.<br />
              앨범, 포토카드, 시즌그리팅 등 다양한 굿즈를 만나보세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">바로가기</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-purple transition-colors">전체 상품</Link></li>
              <li><Link href="/products?category=album" className="hover:text-purple transition-colors">앨범</Link></li>
              <li><Link href="/products?category=photocard" className="hover:text-purple transition-colors">포토카드</Link></li>
              <li><Link href="/orders/lookup" className="hover:text-purple transition-colors">주문 조회</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3">고객센터</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>운영시간: 평일 10:00 - 18:00</li>
              <li>이메일: help@armystore.kr</li>
              <li>카카오톡: @armystore</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          &copy; 2026 ARMY Store. All rights reserved. This is a fan-made project.
        </div>
      </div>
    </footer>
  );
}
