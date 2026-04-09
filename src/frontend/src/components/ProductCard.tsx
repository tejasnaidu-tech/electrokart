import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        ({Number(rating).toFixed(1)})
      </span>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      quantity: 1,
      price: product.price,
      originalPrice: product.originalPrice,
    });
    toast.success("Added to cart", {
      description: product.name,
    });
  };

  const discountPct =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="group block"
      data-ocid={`product-card-${product.id}`}
    >
      <div className="bg-card rounded-lg border border-border shadow-card card-hover overflow-hidden flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-square bg-muted/30 overflow-hidden">
          <img
            src={product.imageUrl || "/assets/images/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isTrending && (
              <Badge className="bg-accent text-accent-foreground text-xs px-2 py-0.5">
                Trending
              </Badge>
            )}
            {product.isFeatured && !product.isTrending && (
              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                Featured
              </Badge>
            )}
            {discountPct >= 5 && (
              <Badge className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5">
                -{discountPct}%
              </Badge>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col gap-2 flex-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {product.brand}
          </p>
          <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <StarRating rating={product.rating} />

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="font-display font-bold text-lg text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            className="w-full gap-2 mt-1"
            disabled={!product.inStock}
            onClick={handleAddToCart}
            data-ocid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="size-3.5" />
            {product.inStock ? "Add to Cart" : "Unavailable"}
          </Button>
        </div>
      </div>
    </Link>
  );
}

export { StarRating };
