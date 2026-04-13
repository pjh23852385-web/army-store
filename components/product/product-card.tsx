import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square rounded-2xl bg-[#F5F5F7] overflow-hidden mb-4">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.is_new && (
            <Badge className="bg-purple text-white border-0 text-[10px] px-2 py-0.5">NEW</Badge>
          )}
          {product.is_popular && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">인기</Badge>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {product.member && (
          <p className="text-xs text-purple font-medium">{product.member}</p>
        )}
        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-purple transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-bold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
